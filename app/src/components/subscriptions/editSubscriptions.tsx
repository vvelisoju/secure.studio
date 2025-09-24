import {
    Button, createListCollection, Drawer, Portal, Flex, Box
    , Grid, GridItem, Input, Group, InputAddon, Textarea,
    Spinner,
    CloseButton
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Field } from "../ui/field";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";
import { Controller, useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "../../stores/users";
import { convertDateTimeFormat, convertDateToUTC, convertToUTC } from "../../utils/date";
import AddUser from "../../assets/addUser";
import { EditSquareNew } from "../../assets/editSquare";
import { updateInvoice } from "../../api/invoices";
import { useInvoicesStore } from "../../stores/invoice";
import { updateSubscription } from "../../api/subscription";
import { useSubscriptionsStore } from "../../stores/subscription";
const formSchema = z.object({
    // status: z.string({ message: "Select Status" }).array(),
    startTime: z.string({ required_error: "Start time is required" }),
    endTime: z.string(),
    amount: z.string(),
    discount: z.string()
});


const subscriptionStatus = createListCollection({
    items: [
        { label: "Active", value: "ACTIVE" },
        { label: "InActive", value: "INACTIVE" },
    ],
})


const ManageSubscription: React.FC<any> = ({ item }) => {
    const [open, setOpen] = useState(false)
    const { fetchSubscriptions, } = useSubscriptionsStore();
    const { register, handleSubmit, formState: { errors }, clearErrors, control, watch, reset } = useForm({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);
    ;


    const onSubmit = handleSubmit(async (data: any) => {
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        clearErrors();
        setLoading(true);
        try {

            const response: any = await updateSubscription({
                startTime: convertDateToUTC(data.startTime),
                endTime: convertDateToUTC(data.endTime),
                id: item.id,
                amount: parseFloat(data.amount).toFixed(2),
                discount: parseFloat(data.discount).toFixed(2)
            });
            toaster.update(toastId, { description: response.message || "Invoice Updated  successfully", type: "success" });
            setLoading(false);
            reset();
            setOpen(false);
            await fetchSubscriptions();
        } catch (error: any) {
            console.log(error);
            toaster.update(toastId, { description: error?.data?.message || "Invoice Updated Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, (errors) => {
        console.error("Form validation errors:", errors);
    });

    useEffect(() => {
        reset({ startTime: convertDateTimeFormat(item?.startTime), endTime: convertDateTimeFormat(item?.endTime), amount: item?.amount + '', discount: item?.discount + '' })
    }, [])


    console.log("start-time", convertDateTimeFormat(item?.startTime))

    return (
        <Drawer.Root size={"sm"} open={open} onOpenChange={(e) => setOpen(e.open)} >
            <Drawer.Trigger asChild>
                <Button p={2} minW={"auto"} h={"auto"} bg={"primary"} variant="solid" size="sm">
                    <Box  >{EditSquareNew()}</Box>
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header alignItems={"center"} display={"flex"} justifyContent={"space-between"} >
                            <Drawer.Title>Update Subscription</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body  >
                            <form id="updateInvoice" onSubmit={onSubmit}>
                                <Flex flexDir={"column"} gap={5} mt={5}>
                                    <Flex gap={3} w={"100%"} >
                                        <Grid flexGrow={1}
                                            templateColumns={{ base: "repeat(1, 1fr)" }}
                                            templateRows="repeat(1fr)"
                                            gap={5}
                                            color={"blackAlpha.700"}
                                        >
                                            {/* <GridItem colSpan={1} >
                                                <Field label="Status" required invalid={!!errors.status} errorText={errors.status?.message}>
                                                    <Controller
                                                        control={control}
                                                        name="status"
                                                        render={({ field }) => (
                                                            <SelectRoot
                                                                variant={"outline"}
                                                                name={field.name}
                                                                value={field.value}
                                                                onValueChange={({ value }) => field.onChange(value)}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={subscriptionStatus}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValueText placeholder="Select User Type" />
                                                                </SelectTrigger>
                                                                <SelectContent zIndex={9999}>
                                                                    {subscriptionStatus.items.map((type) => (
                                                                        <SelectItem item={type} key={type.value}>
                                                                            {type.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </SelectRoot>
                                                        )}
                                                    />
                                                </Field>
                                            </GridItem> */}
                                            <GridItem>
                                                <Field color={"blackAlpha.700"} label="Start DateTime" required flexGrow={1} w="100%" justifyContent="center" invalid={!!errors.startTime}
                                                    errorText={errors.startTime?.message} helperText="Ex: 05-03-2025 05:00 AM">
                                                    <Input
                                                        // step="3600"
                                                        outlineColor="primary"
                                                        _focus={{ borderColor: "primary" }}
                                                        type="datetime-local"
                                                        {...register("startTime")}
                                                        css={{
                                                            '&::-webkit-datetime-edit-hour-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-datetime-edit-minute-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-datetime-edit-second-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-datetime-edit-ampm-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-clear-button': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-inner-spin-button': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                    />
                                                </Field>
                                            </GridItem>
                                            <GridItem>
                                                <Field color={"blackAlpha.700"} label="End DateTime" required flexGrow={1} w="100%" justifyContent="center" invalid={!!errors.endTime}
                                                    errorText={errors.endTime?.message} helperText="Ex: 05-03-2025 05:00 AM">
                                                    <Input
                                                        // step="3600"
                                                        outlineColor="primary"
                                                        _focus={{ borderColor: "primary" }}
                                                        type="datetime-local"
                                                        {...register("endTime")}
                                                        css={{
                                                            '&::-webkit-datetime-edit-hour-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-datetime-edit-minute-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-datetime-edit-second-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-datetime-edit-ampm-field': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-clear-button': {
                                                                display: 'none'
                                                            },
                                                            '&::-webkit-inner-spin-button': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                    />
                                                </Field>
                                            </GridItem>
                                            <GridItem>
                                                <Field color={"blackAlpha.700"} label="Amount" required flexGrow={1} w="100%" justifyContent="center" invalid={!!errors.amount}
                                                    errorText={errors.amount?.message} >
                                                    <Input disabled
                                                        // step="3600"
                                                        outlineColor="primary"
                                                        _focus={{ borderColor: "primary" }}
                                                        type="number"
                                                        {...register("amount")}
                                                    />
                                                </Field>
                                            </GridItem>
                                            <GridItem>
                                                <Field color={"blackAlpha.700"} label="Discount" required flexGrow={1} w="100%" justifyContent="center" invalid={!!errors.discount}
                                                    errorText={errors.amount?.message} >
                                                    <Input
                                                        // step="3600"
                                                        outlineColor="primary"
                                                        _focus={{ borderColor: "primary" }}
                                                        type="number"
                                                        {...register("discount")}
                                                    />
                                                </Field>
                                            </GridItem>
                                        </Grid>
                                    </Flex>
                                </Flex>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button form={"updateInvoice"} type="submit" bg={"dark"} w={120} >{loading ? <Spinner /> : "Update"}</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
};

export default ManageSubscription;