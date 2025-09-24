import { HStack, Heading, Stack, Table, Spinner, Badge, Flex, Button, useBreakpointValue, Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAdvanceHistory } from "../stores/advanceHistory";
import { Tooltip } from "../components/ui/tooltip";
import Invoice from "../components/invoice";
import { convertDatePrimaryStyle, convertDateSecondaryStyle } from "../utils/date";
import useAuthStore from "../stores/auth";
import { useCompanyStore } from "../stores/company";
import CalenderIcon from "../assets/calender";
import { useUserStore } from "../stores/users";
import { EditSquareNew } from "../assets/editSquare";
import { createListCollection, Grid, GridItem, Input, Group, InputAddon, Textarea, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field } from "../components/ui/field";
import { toaster } from "../components/ui/toaster";
import { useNotificationScheduleStore } from "../stores/notificationSchedule";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../components/ui/select";
import { getSchedulableNotificationTemplates } from "../api/notificationTemplate";

const daysBeforeValues = createListCollection({
    items: [
        { label: "1 day Before", value: "1" },
        { label: "2 days Before", value: "2" },
        { label: "3 days Before", value: "3" },
        { label: "4 days Before", value: "4" },
        { label: "5 days Before", value: "5" },
    ],
})



const formSchema = z.object({
    description: z.string(),
    daysBefore: z.string({ message: "Select days" }).array(),
    notificationTemplateId: z.string({ message: "Select Template" }).array(),
});

const Reminders = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, control, watch, reset } = useForm({ resolver: zodResolver(formSchema) });
    const { fetchNotificationSchedules, notificationSchedules, updateNotificationSchedule, loading, setLoading } = useNotificationScheduleStore();
    const [selectedAdvance, setSelectedAdvance] = useState<any>();
    const [open, setOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [templatesValues, setTemplatesValues] = useState(createListCollection({ items: [] }));




    useEffect(() => {
        fetchNotificationSchedules()
    }, []);

    useEffect(() => {
        const getTemplates = async () => {
            const response = await getSchedulableNotificationTemplates();
            setTemplatesValues(createListCollection({
                items: response.data.map((item: any) => ({
                    label: item.name,
                    value: item.id
                }))
            }));
        }
        getTemplates();
    }, []);

    // useEffect(() => {
    //     if (selectedAdvance?.id) reset({ description: selectedAdvance?.description || "", amount: selectedAdvance?.amount || 0 })
    // }, [selectedAdvance?.id]);

    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    // const card = (details: any, index: any) => {
    //     return (
    //         <Flex key={index} alignItems={"center"} justifyContent={"space-between"} color={"blackAlpha.700"} py={"2cqw"} px={"3cqw"}
    //             border={"2px solid"} borderColor={"orange.200"} borderLeft={"5px solid"} borderLeftColor={"orange.400"} borderRadius={10}>
    //             <Flex flexDir={"column"}>
    //                 <Text fontWeight={"bold"} fontSize={"3.5cqw"}>{details?.booking?.service.name}</Text>

    //                 <Flex alignItems={"center"} gap={"1cqw"} >
    //                     <Icon h={"3cqw"} w={"3cqw"} color={"blackAlpha.600"} >{CalenderIcon()}</Icon>
    //                     <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"} color={"blackAlpha.600"} >{convertDateSecondaryStyle(details?.createdAt)}</Text>
    //                 </Flex>
    //             </Flex>
    //             <Box><Invoice bookingDetails={details?.booking} buttonContent="INVOICES" /></Box>
    //         </Flex>
    //     )
    // }

    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "updating.....", type: "loading" });
        clearErrors();
        setUpdateLoading(true);
        try {
            const response: any = await updateNotificationSchedule({ ...data, id: selectedAdvance?.id, daysBefore: data.daysBefore.map((num: string) => parseInt(num)), notificationTemplateId: data.notificationTemplateId[0] });
            toaster.update(toastId, { description: response.message || "Updated  successfully", type: "success" });
            setUpdateLoading(false);
            fetchNotificationSchedules();
            setOpen(false);
        } catch (error: any) {
            toaster.update(toastId, { description: error.data.message || "Updated Failed", type: "error" });
            setUpdateLoading(false);
        } finally {
            setUpdateLoading(false);
        }
    })

    const editAdvance = (item: any) => {
        return <Drawer.Root size={"sm"} open={open} onOpenChange={(e) => setOpen(e.open)} >
            <Drawer.Trigger asChild>
                <Box _hover={{ cursor: "pointer" }} onClick={() => {
                    setSelectedAdvance(item),
                        reset({
                            daysBefore: item.daysBefore.map((num: any) => num + "") || [],
                            description: item.description,
                            notificationTemplateId: item.notificationTemplateId ? [item.notificationTemplateId] : []
                        })
                }} h={5} w={5} color={"secondary"} >{EditSquareNew()}</Box>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header alignItems={"center"} display={"flex"} justifyContent={"space-between"} >
                            <Drawer.Title>Edit Reminder</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body  >
                            <form id={"editAdvance"} onSubmit={onSubmit}>
                                <Flex flexDir={"column"} gap={5} mt={5}>
                                    <Flex gap={3} w={"100%"} >
                                        <Grid flexGrow={1}
                                            templateColumns={{ base: "repeat(1, 1fr)" }}
                                            templateRows="repeat(1fr)"
                                            gap={5}
                                            color={"blackAlpha.700"}
                                        >
                                            <GridItem colSpan={1} >
                                                <Field label="Description" required invalid={!!errors.description} errorText={errors.description?.message}>
                                                    <Textarea variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("description")} placeholder="Enter Description" />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field label="Days Before" required invalid={!!errors.daysBefore} errorText={errors.daysBefore?.message}>
                                                    <Controller
                                                        control={control}
                                                        name="daysBefore"
                                                        render={({ field }) => (
                                                            <SelectRoot
                                                                multiple
                                                                variant={"outline"}
                                                                name={field.name}
                                                                value={field.value}
                                                                onValueChange={({ value }) => { field.onChange(value); }}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={daysBeforeValues}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValueText placeholder="Select User Type" />
                                                                </SelectTrigger>
                                                                <SelectContent zIndex={9999}>
                                                                    {daysBeforeValues.items.map((type) => (
                                                                        <SelectItem item={type} key={type.value}>
                                                                            {type.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </SelectRoot>
                                                        )}
                                                    />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field label="Notification Template" required invalid={!!errors.notificationTemplateId} errorText={errors.notificationTemplateId?.message}>
                                                    <Controller
                                                        control={control}
                                                        name="notificationTemplateId"
                                                        render={({ field }) => (
                                                            <SelectRoot
                                                                multiple
                                                                variant={"outline"}
                                                                name={field.name}
                                                                value={field.value}
                                                                onValueChange={({ value }) => { field.onChange(value);}}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={templatesValues}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValueText placeholder="Select Template" />
                                                                </SelectTrigger>
                                                                <SelectContent zIndex={9999}>
                                                                    {templatesValues.items.map((type: any) => (
                                                                        <SelectItem item={type} key={type.value}>
                                                                            {type.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </SelectRoot>
                                                        )}
                                                    />
                                                </Field>
                                            </GridItem>
                                        </Grid>
                                    </Flex>
                                </Flex>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button form={"editAdvance"} type="submit" bg={"dark"} w={120} >{updateLoading ? <Spinner /> : "Update"}</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    }

    return (
        <Stack width="full" gap="5" flexGrow={1} bg={'white'} p={5} borderRadius={{ base: 10, md: 10 }} overflowY={"auto"} >
            <Flex>
                <Heading size="xl">Reminders</Heading>
            </Flex>
            {
                !isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : notificationSchedules.length > 0 ? (
                            <Table.ScrollArea borderWidth="1px" rounded="md" >
                                <Table.Root size="sm" rounded={"md"} stickyHeader={true} >
                                    <Table.Header >
                                        <Table.Row bg={"gray.100"}>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Description</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Days Before</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Created At</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Updated At</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"} >Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {notificationSchedules.map((item, index) => (
                                            <Table.Row key={index} h={14} >
                                                <Table.Cell py={3} px={2} textAlign={"center"} w={5}  >{index + 1}&#41;</Table.Cell>
                                                <Table.Cell py={3} px={5}>{item.description}</Table.Cell>
                                                <Table.Cell py={3} px={5}>
                                                    <Flex gap={3}>
                                                        {item.daysBefore.map((day: any, index: any) => <Flex key={index} justifyContent={"center"} alignItems={"center"} borderRadius={5} h={6} w={6} bg={"gray.100"} ><Text fontSize={"sm"}>{day}d</Text></Flex>)}
                                                    </Flex>
                                                </Table.Cell>
                                                <Table.Cell py={3} px={5}><Badge colorPalette={"blue"}>{convertDatePrimaryStyle(item.createdAt)}</Badge></Table.Cell>
                                                <Table.Cell py={3} px={5}><Badge colorPalette={"blue"}>{convertDatePrimaryStyle(item.updatedAt)}</Badge></Table.Cell>
                                                <Table.Cell py={3} px={5}>
                                                    <Flex flexGrow={1} justifyContent={"center"}>
                                                        <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Edit History">
                                                            {editAdvance(item)}
                                                        </Tooltip>
                                                    </Flex>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>

                        ) : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>
                        }
                    </Flex>
                )
            }
            {/* {
                isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : invoices.length > 0 ? (
                            <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1} >
                                {invoices && invoices.length > 0 && invoices?.map((item: any, index: any) => {
                                    return card(item, index);
                                })}
                            </Flex>

                        ) : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>
                        }
                        <PaginationRoot
                            alignSelf={"end"}
                            count={totalPages}
                            pageSize={pageSize}
                            defaultPage={page}
                            variant="solid"
                            onPageChange={(e) => {
                                setPage(e.page)
                            }}
                        >
                            <HStack wrap="wrap">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </HStack>
                        </PaginationRoot>
                    </Flex>
                )
            } */}
        </Stack >
    );
};

export default Reminders;
