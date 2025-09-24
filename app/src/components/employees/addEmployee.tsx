import {
    Button, createListCollection, Drawer, Portal, Flex, Tabs
    , Grid, GridItem, Input, Group, InputAddon, Textarea,
    Spinner, Text, Badge,
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
import { convertDateToUTC, convertToUTC } from "../../utils/date";
import { useSubscriptionsStore } from "../../stores/subscription";

const formSchema = z.object({
    userType: z.string({ message: "Select User Type" }).array(),
    name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    phone: z.string().nullable().optional(),
    subscriptionId: z.string().array(),
    gender: z.string().array().optional().default([]),
    dob: z.string().nullable().optional(),
    joiningDate: z.string().nullable().optional(),
    address: z.string().optional()
});

const genderValues = createListCollection({
    items: [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
        { label: "Other", value: "OTHER" },
    ],
})

const userTypeValues = createListCollection({
    items: [
        { label: "Employee", value: "EMPLOYEE" },
        { label: "Company Admin", value: "USER_ADMIN" },
    ],
})

const AddEmployee: React.FC = () => {
    const [open, setOpen] = useState(false)
    const { createEmployee, fetchEmployees, page } = useUserStore();
    const { register, handleSubmit, formState: { errors }, clearErrors, control, watch, reset } = useForm({ resolver: zodResolver(formSchema) });
    const { subscriptions, fetchSubscriptions } = useSubscriptionsStore();

    const subscriptionValues = createListCollection({
        items: subscriptions?.map((item: any) => {
            return { label: item?.service?.name, value: item?.id, left: item?.employeesAllowed - item?.employeesFilled }
        })
    });

    useEffect(() => { fetchSubscriptions(); fetchEmployees(); }, []);

    const [loading, setLoading] = useState(false);
    ;
    const onSubmit = handleSubmit(async (data: any) => {
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        clearErrors();
        setLoading(true);
        try {
            let userData = {
                ...data,
                subscriptionId: data?.subscriptionId[0],
                dob: convertDateToUTC(data?.dob),
                joiningDate: convertDateToUTC(data?.joiningDate),
                gender: data?.gender[0],
                userType: data.userType[0],
            }
            const response: any = await createEmployee(userData);
            toaster.update(toastId, { description: response.message || "Employee created  successfully", type: "success" });
            setLoading(false);
            reset();
            setOpen(false);
            await fetchEmployees(page);
        } catch (error: any) {
            console.log(error);
            toaster.update(toastId, { description: error?.data?.message || "Employee creation Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, (errors) => {
        console.error("Form validation errors:", errors);
    });

    return (
        <Drawer.Root size={"sm"} open={open} onOpenChange={(e) => { setOpen(e.open); fetchSubscriptions() }} >
            <Drawer.Trigger asChild>
                <Button variant="solid" size="sm">
                    Add User
                </Button>

            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header alignItems={"center"} display={"flex"} justifyContent={"space-between"} >
                            <Drawer.Title>Adding User</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body  >
                            <form id="addEmployee" onSubmit={onSubmit}>
                                <Flex flexDir={"column"} gap={5} mt={5}>
                                    <Flex gap={3} w={"100%"} >
                                        <Grid flexGrow={1}
                                            templateColumns={{ base: "repeat(1, 1fr)" }}
                                            templateRows="repeat(1fr)"
                                            gap={5}
                                            color={"blackAlpha.700"}
                                        >
                                           
                                            <GridItem colSpan={1} >
                                                <Field label="Full Name" required invalid={!!errors.name} errorText={errors.name?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("name")} placeholder="Enter your full name" />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field label="Email Address" required invalid={!!errors.email} errorText={errors.email?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("email")} placeholder="Enter your email address" />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field label="Phone Number" invalid={!!errors.phone} errorText={errors.phone?.message}>
                                                    <Group attached w={"100%"} >
                                                        <InputAddon cursor={"disabled"} variant={"outline"}>+91</InputAddon>
                                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("phone")} placeholder="Enter your phone number" />
                                                    </Group>
                                                </Field>
                                            </GridItem>
                                             <GridItem colSpan={1} >
                                                <Field label="User Type" required invalid={!!errors.userType} errorText={errors.userType?.message}>
                                                    <Controller
                                                        control={control}
                                                        name="userType"
                                                        render={({ field }) => (
                                                            <SelectRoot
                                                                variant={"outline"}
                                                                name={field.name}
                                                                value={field.value}
                                                                onValueChange={({ value }) => field.onChange(value)}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={userTypeValues}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValueText placeholder="Select User Type" />
                                                                </SelectTrigger>
                                                                <SelectContent zIndex={9999}>
                                                                    {userTypeValues.items.map((type) => (
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
                                                <Field label="Company Subscriptions" invalid={!!errors.subscriptionId} errorText={errors.subscriptionId?.message}>
                                                    <Controller
                                                        control={control}
                                                        name="subscriptionId"
                                                        render={({ field }) => (
                                                            <SelectRoot
                                                                variant={"outline"}
                                                                name={field.name}
                                                                value={field.value}
                                                                onValueChange={({ value }) => field.onChange(value)}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={subscriptionValues}

                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValueText placeholder="Select Subscription" />
                                                                </SelectTrigger>
                                                                <SelectContent zIndex={9999} >
                                                                    {subscriptionValues.items.map((type: any) => (
                                                                        <SelectItem opacity={type.left == 0 ? 0.5 : 1} pointerEvents={type.left == 0 ? "none" : "all"} item={type} key={type.value}>
                                                                            <Flex w={"220px"} justifyContent={"space-between"}><Text>{(type).label}</Text> <Flex gap={2}><Badge colorPalette={"green"} >Left: {type.left}</Badge></Flex></Flex>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </SelectRoot>
                                                        )}
                                                    />
                                                </Field>
                                            </GridItem >
                                            <GridItem colSpan={1} >
                                                <Field label="Gender" invalid={!!errors.gender} errorText={errors.gender?.message}>
                                                    <Controller
                                                        control={control}
                                                        name="gender"
                                                        render={({ field }) => (
                                                            <SelectRoot
                                                                variant={"outline"}
                                                                name={field.name}
                                                                value={field.value}
                                                                onValueChange={({ value }) => field.onChange(value)}
                                                                onInteractOutside={() => field.onBlur()}
                                                                collection={genderValues}

                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValueText placeholder="Select gender" />
                                                                </SelectTrigger>
                                                                <SelectContent zIndex={9999} >
                                                                    {genderValues.items.map((type) => (
                                                                        <SelectItem item={type} key={type.value}>
                                                                            {type.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </SelectRoot>
                                                        )}
                                                    />
                                                </Field>
                                            </GridItem >
                                            
                                          {/* /** <GridItem colSpan={1} >
                                                <Field label="Date of Birth" invalid={!!errors.dob} errorText={errors.dob?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="date" {...register("dob")} placeholder="Select Date of Birth" />
                                                </Field>
                                            </GridItem> */ }
                                            <GridItem colSpan={1} >
                                                <Field required label="Joining Date" invalid={!!errors.joiningDate} errorText={errors.joiningDate?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="date" {...register("joiningDate")} placeholder="Select Joining Date" />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field label="User Address" required invalid={!!errors.address} errorText={errors.address?.message}>
                                                    <Textarea rows={3} variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("address")} />
                                                </Field>
                                            </GridItem>
                                        </Grid>
                                    </Flex>
                                </Flex>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button form="addEmployee" type="submit" bg={"dark"} w={120} >{loading ? <Spinner /> : "Create"}</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
};

export default AddEmployee;