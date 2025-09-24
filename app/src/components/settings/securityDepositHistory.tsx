import { Heading, Stack, Table, Spinner, Badge, Flex, Button, useBreakpointValue, Box, Text, Icon } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAdvanceHistory } from "../../stores/advanceHistory";
import { Tooltip } from "../ui/tooltip";
import { convertDatePrimaryStyle, convertDateSecondaryStyle } from "../../utils/date";
import useAuthStore from "../../stores/auth";
import { useUserStore } from "../../stores/users";
import { EditSquareNew } from "../../assets/editSquare";
import { createListCollection, Grid, GridItem, Input, Group, InputAddon, Textarea, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field } from "../ui/field";
import { toaster } from "../ui/toaster";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";
import Receipt from "../receiptVoucher";
const getBadgeColor = (status: any): string => {
    switch (status) {
        case "GIVEN":
            return "green";
        case "REPAID":
            return "red";
        case "ADJUSTMENT":
            return "yellow";
        default:
            return "gray";
    }
};

const advanceTypeValues = createListCollection({
    items: [
        { label: "Given", value: "GIVEN" },
        { label: "Repaid", value: "REPAID" },
        { label: "Adjustment", value: "ADJUSTMENT" },
    ],
})

const AdvanceHistory = () => {
    const [addOrEdit, setAddOrEdit] = useState<any>();
    const formSchema = z.object({
        type: z.array(z.string()).optional(),
        description: z.string(),
        amount: z.string(),
    });

    const { register, handleSubmit, formState: { errors }, clearErrors, control, watch, reset, trigger } = useForm({ resolver: zodResolver(formSchema) });
    const { fetchAdvances, creditedList, loading, updateAdvance, addAdvance, total } = useAdvanceHistory();
    const [selectedAdvance, setSelectedAdvance] = useState<any>();
    const [open, setOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const { role } = useAuthStore();
    const { userId, user, fetchUser } = useUserStore();
    useEffect(() => {
        const getData = async () => {
            await fetchAdvances(userId)
            await fetchUser()
        }
        getData();
    }, []);

    useEffect(() => {
        if (selectedAdvance?.id) reset({ description: selectedAdvance?.description || "", amount: selectedAdvance?.amount + "" || 0 + "" })
    }, [selectedAdvance?.id]);

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
            let response: any;
            if (addOrEdit === "ADD") {
                response = await addAdvance({ ...data, userId, amount: parseFloat(data?.amount), type: (data.type as string[])[0] });
            } else {
                response = await updateAdvance({ ...data, id: selectedAdvance?.id, amount: parseFloat(data?.amount) });
            }
            toaster.update(toastId, { description: response.message || addOrEdit === "ADD" ? "Added Successfully" : "Updated  successfully", type: "success" });
            setUpdateLoading(false);
            fetchAdvances(userId);
            setOpen(false);
        } catch (error: any) {
            toaster.update(toastId, { description: error.data.message || addOrEdit === "ADD" ? "Added Failed" : "Updated Failed", type: "error" });
            setUpdateLoading(false);
        } finally {
            setUpdateLoading(false);
        }
    })

    const addAndEditAdvance = (type: string, item?: any) => {
        return <Drawer.Root size={"sm"} open={open} onOpenChange={(e) => setOpen(e.open)} >
            <Drawer.Trigger asChild>
                {type === "ADD" ? <Button onClick={() => { setSelectedAdvance(null); setAddOrEdit("ADD"); reset({ description: "", amount: "", type: [] }); }} >Add</Button> :
                    <Flex h={8} w={8} alignItems={"center"} justifyContent={"center"} bg={"secondary"} borderRadius={5} >
                        <Box _hover={{ cursor: "pointer" }} onClick={() => { setAddOrEdit("EDIT"); setSelectedAdvance(item) }} h={5} w={5} color={"white"} >{EditSquareNew()}</Box>
                    </Flex>
                }
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header alignItems={"center"} display={"flex"} justifyContent={"space-between"} >
                            <Drawer.Title>{addOrEdit === "ADD" ? "Add Security Deposit" : "Edit Security Deposit"}</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body  >
                            <form id={"editAdvance"} onSubmit={onSubmit} noValidate>
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
                                                    <Textarea rows={2} variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("description")} placeholder="Enter Description" />
                                                </Field>
                                            </GridItem>
                                            {
                                                addOrEdit === "ADD" && <GridItem colSpan={1} >
                                                    <Field label="Security Deposit Type" required invalid={!!errors.type} errorText={errors.type?.message}>
                                                        <Controller
                                                            control={control}
                                                            name="type"
                                                            render={({ field }) => (
                                                                <SelectRoot
                                                                    variant={"outline"}
                                                                    name={field.name}
                                                                    value={field.value}
                                                                    onValueChange={({ value }) => field.onChange(value)}
                                                                    onInteractOutside={() => field.onBlur()}
                                                                    collection={advanceTypeValues}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValueText placeholder="Select User Type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent zIndex={9999}>
                                                                        {advanceTypeValues.items.map((type) => (
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
                                            }

                                            <GridItem colSpan={1} >
                                                <Field label="Amount" required invalid={!!errors.amount} errorText={errors.amount?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="number" {...register("amount")} placeholder="Enter  Amount" />
                                                </Field>
                                            </GridItem>
                                        </Grid>
                                    </Flex>
                                </Flex>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button form={"editAdvance"} type="submit" bg={"dark"} w={120} >{updateLoading ? <Spinner /> : addOrEdit === "ADD" ? "Add" : "Update"}</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    }

    return (
        <Stack width="full" gap="5" flexGrow={1} bg={'white'} p={role !== "SUPER_ADMIN" ? 5 : 0} borderRadius={{ base: 10, md: 10 }} overflowY={"auto"} >
            {role === "SUPER_ADMIN" && <Flex px={4} justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={2}>
                    <Heading size="xl">Total Deposit : ₹{total?.toFixed(2)}</Heading>
                    <Receipt type="TOTAL" />
                </Flex>
                {addAndEditAdvance("ADD")}
            </Flex>}
            {role !== "SUPER_ADMIN" && <Flex px={4} justifyContent={"space-between"} alignItems={"center"}>
                <Heading size="xl">Security Deposit History</Heading>
            </Flex>}
            {
                !isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : creditedList.length > 0 ? (
                            <Table.ScrollArea borderWidth="1px" rounded="md" >
                                <Table.Root size="sm" rounded={"md"} stickyHeader={true} >
                                    <Table.Header >
                                        <Table.Row bg={"gray.100"}>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Description</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Type</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Amount</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Created At</Table.ColumnHeader>
                                            {role === "SUPER_ADMIN" &&
                                                <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"} >Actions</Table.ColumnHeader>}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {creditedList.map((item, index) => (
                                            <Table.Row key={index} h={14} >
                                                <Table.Cell py={3} px={2} textAlign={"center"} w={5}  >{index + 1}&#41;</Table.Cell>

                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>{item.description}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}><Badge colorPalette={getBadgeColor(item.type)}>{item.type}</Badge></Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>₹{item.amount.toFixed(2)}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}><Badge colorPalette={"blue"}>{convertDatePrimaryStyle(item.createdAt)}</Badge></Table.Cell>
                                                {role === "SUPER_ADMIN" && <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} w={"100%"} display={"flex"} alignItems={"center"}>
                                                    <Flex gap={4} alignItems={"center"} >
                                                        <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Edit History">
                                                            {addAndEditAdvance("EDIT", item)}
                                                        </Tooltip>
                                                        <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Download Receipt">
                                                            <Receipt receiptDetails={item} type="SINGLE" />
                                                        </Tooltip>
                                                    </Flex>
                                                </Table.Cell>}
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
        </Stack >
    );
};

export default AdvanceHistory;
