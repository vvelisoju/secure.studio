import { Flex, Button, Input, createListCollection, Text, Box, Group, InputAddon, Textarea, Switch } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react"
import Profile from "../../assets/demo-profile.png"
import EditSquare from "../../assets/editSquare";
import { Field } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react"
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";
import { Grid, GridItem } from "@chakra-ui/react"
import Delete from "../../assets/delete";
import { Tooltip } from "../ui/tooltip";
import { useSettingsStore } from "../../stores/settings";
import { convertDatePrimaryStyle, convertToUTC } from "../../utils/date";
import UploadAndCrop from "../cropImage";
import useAuthStore from "../../stores/auth";

const formSchema = z.object({
    name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    phone: z.string().nullable().optional(),
    gender: z.string().array().optional().default([]),
    dateOfBirth: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    taxInvoice: z.string().array().optional().default([]),
    status: z.string().array().optional().default([]),

});

type FormValues = z.infer<typeof formSchema>;

const genderValues = createListCollection({
    items: [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" },
        { label: "Other", value: "OTHER" },
    ],
})


const taxInvoiceValues = createListCollection({
    items: [
        { label: "Active", value: "ACTIVE" },
        { label: "In Active", value: "INACTIVE" },
    ],
});

const userStatusValues = createListCollection({
    items: [
        { label: "Active", value: "ACTIVE" },
        { label: "In Active", value: "INACTIVE" },
    ],
});

const ProfileCard = () => {
    const { editProfile, setEditProfile, profileDetails, editProfileDetails, deleteProfileImage } = useSettingsStore();
    const { register, handleSubmit, formState: { errors }, clearErrors, control, reset } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);
    const { logout, role } = useAuthStore();


    useEffect(() => {
        reset({
            name: profileDetails?.name,
            email: profileDetails?.email,
            phone: profileDetails?.phone,
            gender: [profileDetails?.gender],
            dateOfBirth: profileDetails?.dob?.split("T")[0],
            address: profileDetails?.address,
            taxInvoice: profileDetails?.taxInvoice ? ["ACTIVE"] : ['INACTIVE'],
            status: [profileDetails?.status]
        })
    }, [profileDetails])

    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "updating.....", type: "loading" });
        clearErrors();
        setLoading(true);

        try {
            let dob;
            if (data.dateOfBirth) {
                dob = convertToUTC(data.dateOfBirth as string);
            }
            delete data.dateOfBirth;
            const response: any = await editProfileDetails({
                ...data,
                dob,
                gender: data.gender ? data?.gender[0] : undefined,
                taxInvoice: data.taxInvoice[0] === "ACTIVE" ? true : false,
                status: data.status[0]
            });
            toaster.update(toastId, { description: response.message || "Updated successfully", type: "success" });
            setLoading(false);
            setEditProfile(false)
        } catch (error: any) {
            toaster.update(toastId, { description: error.data.message || "Updated Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    });


    const onDeleteProfile = handleSubmit(async () => {
        if (!profileDetails?.imageUrl) {
            setEditProfile(false);
            return;
        }
        let toastId: any = toaster.create({ description: "Deleting....", type: "loading" });
        try {
            const response: any = await deleteProfileImage({ url: profileDetails?.imageUrl });
            toaster.update(toastId, { description: response.message || "Image Deleted successfully", type: "success" });
            setEditProfile(false)
        } catch (error: any) {
            toaster.update(toastId, { description: error.data.message || "Image Deleted Failed", type: "error" });
            setLoading(false);
        }
    });

    return (
        <Flex color={"blackAlpha.800"} w={"100%"} flexDir={"column"} border={"1px solid"} borderColor={"gray.200"} fontSize={[14, 16, 20]}
            bg={"white"} p={5} justifyContent={"center"} gap={7} boxShadow={"lg"} borderRadius={{ base: 10, md: 10 }} borderTopLeftRadius={{ base: 0, md: 0 }} >

            <Flex justifyContent={"end"} alignItems={"center"}>
                {!editProfile && <Flex onClick={() => setEditProfile(true)} _hover={{ cursor: "pointer" }} alignItems={"center"} gap={2} color={"secondary"}>
                    {EditSquare("1em", "1em", "var(--chakra-colors-secondary)")}
                    <Text fontWeight={"500"} fontSize={"0.7em"} >Edit Profile</Text>
                </Flex>}
            </Flex>
            <Flex justifyContent={"start"} gap={10} flexDir={{ base: "column", md: "row" }} >
                <Flex gap={5} flexDir={"column"} alignItems={"center"}>
                    <Flex _hover={{ cursor: "disabled" }} justifyContent={"center"} >
                        <Avatar.Root boxShadow={"xl"} w={"7em"} h={"7em"}  >
                            <Avatar.Image src={profileDetails?.imageUrl || Profile} />
                            <Avatar.Fallback />
                        </Avatar.Root>
                    </Flex>
                    {
                        (editProfile) && <Flex gap={4}>
                            <UploadAndCrop />
                            {
                                profileDetails?.imageUrl && <Tooltip content="Delete Image">
                                    <Box onClick={onDeleteProfile} _hover={{ cursor: "pointer" }} borderRadius={5} p={1} bg={"red.600"}>{Delete("1.2em", "1.2em", "var(--chakra-colors-white-alpha-800)")}</Box>
                                </Tooltip>
                            }
                        </Flex>
                    }
                </Flex>
                <Flex direction={"column"} flexGrow={1} gap={8} >
                    <form onSubmit={onSubmit}>
                        <Flex flexDir={"column"} gap={5}>
                            <Flex gap={3} w={"100%"} >
                                <Grid flexGrow={1}
                                    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
                                    templateRows="repeat(1fr)"
                                    gap={5}
                                    color={"blackAlpha.700"}
                                >
                                    <GridItem colSpan={1} >
                                        <Field label="Full Name" required invalid={!!errors.name} errorText={errors.name?.message}>
                                            <Input variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("name")} placeholder="Enter your full name" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Email Address" required invalid={!!errors.email} errorText={errors.email?.message}>
                                            <Input variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("email")} placeholder="Enter your email address" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Phone Number" invalid={!!errors.phone} errorText={errors.phone?.message}>
                                            <Group attached w={"100%"} >
                                                <InputAddon cursor={"disabled"} variant={!editProfile ? "subtle" : "outline"}>+91</InputAddon>
                                                <Input variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("phone")} placeholder="Enter your phone number" />
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
                                                        variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile}
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={({ value }) => field.onChange(value)}
                                                        onInteractOutside={() => field.onBlur()}
                                                        collection={genderValues}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValueText placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
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
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Date of Birth" invalid={!!errors.dateOfBirth} errorText={errors.dateOfBirth?.message}>
                                            <Input variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="date" {...register("dateOfBirth")} placeholder="Select Date of Birth" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Address" invalid={!!errors.address} errorText={errors.address?.message}>
                                            <Textarea rows={1} variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("address")} />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Tax Invoice" required invalid={!!errors.gender} errorText={errors.gender?.message}>
                                            <Controller
                                                control={control}
                                                name="taxInvoice"
                                                render={({ field }) => (
                                                    <SelectRoot
                                                        variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile}
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={({ value }) => field.onChange(value)}
                                                        onInteractOutside={() => field.onBlur()}
                                                        collection={taxInvoiceValues}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValueText placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {taxInvoiceValues.items.map((type) => (
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
                                        <Field label="Staus" required invalid={!!errors.gender} errorText={errors.gender?.message}>
                                            <Controller
                                                control={control}
                                                name="status"
                                                render={({ field }) => (
                                                    <SelectRoot
                                                        variant={!editProfile ? "subtle" : "outline"} disabled={!editProfile}
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={({ value }) => field.onChange(value)}
                                                        onInteractOutside={() => field.onBlur()}
                                                        collection={userStatusValues}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValueText placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {userStatusValues.items.map((type) => (
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
                            {editProfile && <Flex justifyContent={"end"} gap={5}>
                                <Button variant={"outline"} onClick={() => setEditProfile(false)}  >Cancel</Button>
                                <Button type="submit" bg={"secondary"} w={120} >{loading ? <Spinner /> : "Save Changes"}</Button>
                            </Flex>}
                        </Flex>
                    </form>

                    {!editProfile && <Flex justifyContent={"end"} gap={5}>
                        <Text fontSize={"0.7em"} fontWeight={"500"} color={"blackAlpha.500"}>Last updated: {convertDatePrimaryStyle(profileDetails?.updatedAt)}</Text>
                    </Flex>}
                </Flex >
            </Flex>

        </Flex >
    )
}

export default ProfileCard