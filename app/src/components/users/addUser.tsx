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
import { convertDateToUTC, convertToUTC } from "../../utils/date";
import AddUser from "../../assets/addUser";

const formSchema = z.object({
    userType: z.string({ message: "Select User Type" }).array(),
    name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    phone: z.string().nullable().optional(),
    gender: z.string().array().optional().default([]),
    dob: z.string().nullable().optional(),
    joiningDate: z.string().nullable().optional(),
    address: z.string().optional(),
    companyName: z.string().optional(),
    employeeRange: z.string({ message: "Select Employee range" }).array().optional(),
    GSTIN: z.string().optional(),
    PAN: z.string().optional(),
    companyAddress: z.string().optional(),
    websiteUrl: z.string().optional(),
});

const userTypeValues = createListCollection({
    items: [
        { label: "Individual", value: "USER" },
        { label: "Company", value: "USER_ADMIN" },
    ],
})

const employeesRangeValues = createListCollection({
    items: [
        { label: "1 to 5", value: "ONE_TO_FIVE" },
        { label: "6 to 10", value: "SIX_TO_TEN" },
        { label: "11 to 20", value: "ELEVEN_TO_TWENTY" },
        { label: "20 +", value: "TWENTY_PLUS" },
    ],
})


const genderValues = createListCollection({
    items: [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
        { label: "Other", value: "OTHER" },
    ],
})


const ManageUser: React.FC = () => {
    const [open, setOpen] = useState(false)
    const { createUser, fetchUsers, page } = useUserStore();
    const { register, handleSubmit, formState: { errors }, clearErrors, control, watch, reset } = useForm({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<string>("INDIVIDUAL");
    const userType = watch('userType');
    ;
    const onSubmit = handleSubmit(async (data: any) => {
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        clearErrors();
        setLoading(true);
        try {
            let userData: any;
            if (data?.userType[0] === "USER") {
                userData = {
                    ...data,
                    dob: data?.dob ? convertDateToUTC(data?.dob) : undefined,
                    joiningDate: convertDateToUTC(data?.joiningDate),
                    gender: data?.gender[0],
                    userType: data?.userType[0]
                }
            } else {
                userData = {
                    ...data,
                    dob: data?.dob ? convertDateToUTC(data?.dob) : undefined,
                    joiningDate: convertDateToUTC(data?.joiningDate),
                    gender: data?.gender[0],
                    userType: data?.userType[0],
                    employeeRange: data?.employeeRange && data?.employeeRange[0]
                }
            }
            const response: any = await createUser(userData);
            toaster.update(toastId, { description: response.message || "User created  successfully", type: "success" });
            setLoading(false);
            reset();
            setOpen(false);
            await fetchUsers(page, "USERS");
        } catch (error: any) {
            console.log(error);
            toaster.update(toastId, { description: error?.data?.message || "User creation Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, (errors) => {
        console.error("Form validation errors:", errors);
    });

    return (
        <Drawer.Root size={"sm"} open={open} onOpenChange={(e) => setOpen(e.open)} >
            <Drawer.Trigger asChild>
                <Button bg={"primary"} variant="solid" size="sm">
                    <Box >{AddUser()}</Box>    Add User
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header alignItems={"center"} display={"flex"} justifyContent={"space-between"} >
                            <Drawer.Title>Create Account</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body  >
                            <form id={value as string} onSubmit={onSubmit}>
                                <Flex flexDir={"column"} gap={5} mt={5}>
                                    <Flex gap={3} w={"100%"} >
                                        <Grid flexGrow={1}
                                            templateColumns={{ base: "repeat(1, 1fr)" }}
                                            templateRows="repeat(1fr)"
                                            gap={5}
                                            color={"blackAlpha.700"}
                                        >
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
                                            <GridItem colSpan={1} >
                                                <Field label="Date of Birth" invalid={!!errors.dob} errorText={errors.dob?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="date" {...register("dob")} placeholder="Select Date of Birth" />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field required label="Joining Date" invalid={!!errors.joiningDate} errorText={errors.joiningDate?.message}>
                                                    <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="date" {...register("joiningDate")} placeholder="Select Joining Date" />
                                                </Field>
                                            </GridItem>
                                            <GridItem colSpan={1} >
                                                <Field label="User Address" required invalid={!!errors.address} errorText={errors.address?.message}>
                                                    <Textarea rows={1} variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("address")} />
                                                </Field>
                                            </GridItem>
                                            {userType && userType[0] === 'USER_ADMIN' && <>
                                                <GridItem colSpan={1} >
                                                    <Field label="Company Name" required invalid={!!errors.companyName} errorText={errors.companyName?.message}>
                                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("companyName")} placeholder="Enter company name" />
                                                    </Field>
                                                </GridItem>
                                                <GridItem colSpan={1} >
                                                    <Field label="GSTIN" invalid={!!errors.GSTIN} errorText={errors.GSTIN?.message}>
                                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("GSTIN")} placeholder="Enter your GSTIN" />
                                                    </Field>
                                                </GridItem>
                                                <GridItem colSpan={1} >
                                                    <Field label="PAN" invalid={!!errors.PAN} errorText={errors.PAN?.message}>
                                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("PAN")} placeholder="Enter your PAN" />
                                                    </Field>
                                                </GridItem>
                                                <GridItem colSpan={1} >
                                                    <Field label="Employee Range" invalid={!!errors.employeeRange} errorText={errors.employeeRange?.message}>
                                                        <Controller
                                                            control={control}
                                                            name="employeeRange"
                                                            render={({ field }) => (
                                                                <SelectRoot
                                                                    variant={"outline"}
                                                                    name={field.name}
                                                                    value={field.value}
                                                                    onValueChange={({ value }) => field.onChange(value)}
                                                                    onInteractOutside={() => field.onBlur()}
                                                                    collection={employeesRangeValues}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValueText placeholder="Select Employee Range" />
                                                                    </SelectTrigger>
                                                                    <SelectContent zIndex={9999}>
                                                                        {employeesRangeValues.items.map((type) => (
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
                                                    <Field label="websiteUrl" invalid={!!errors.websiteUrl} errorText={errors.websiteUrl?.message}>
                                                        <Input variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("websiteUrl")} placeholder="Enter your websiteUrl" />
                                                    </Field>
                                                </GridItem>

                                                <GridItem colSpan={1} >
                                                    <Field label="Company Address" invalid={!!errors.companyAddress} errorText={errors.companyAddress?.message}>
                                                        <Textarea rows={1} variant={"outline"} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("companyAddress")} />
                                                    </Field>
                                                </GridItem>
                                            </>}
                                        </Grid>
                                    </Flex>
                                </Flex>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button form={value} type="submit" bg={"dark"} w={120} >{loading ? <Spinner /> : "Create"}</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
};

export default ManageUser;