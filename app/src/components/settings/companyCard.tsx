import { Flex, Button, Input, createListCollection, Text, Box, Group, InputAddon, CloseButton, Textarea, Drawer, Portal, Image } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react"
import Profile from "../../assets/demo-profile.png"
import EditSquare from "../../assets/editSquare";
import { Field } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@chakra-ui/react"
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";
import { Grid, GridItem } from "@chakra-ui/react"
import { useSettingsStore } from "../../stores/settings";
import { convertDatePrimaryStyle } from "../../utils/date";
import UploadAndCrop from "../cropImage";
import { Tooltip } from "../ui/tooltip";
import Delete from "../../assets/delete";
import uploadIcon from "../../assets/upload";
import ReplaceImage from "../../assets/replaceImage";


const formSchema = z.object({
    name: z.string().nullable().optional(),
    employeeRange: z.array(z.string({ message: "Select Employee range" })),
    GSTIN: z.string().nullable().optional(),
    PAN: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    websiteUrl: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const employeesCountValues = createListCollection({
    items: [
        { label: "1 to 5", value: "ONE_TO_FIVE" },
        { label: "6 to 10", value: "SIX_TO_TEN" },
        { label: "11 to 20", value: "ELEVEN_TO_TWENTY" },
        { label: "20 +", value: "TWENTY_PLUS" },
    ],
})


const CompanyCard = () => {
    const { editCompany, setEditCompany, companyDetails, editCompanyDetails, deleteLogo, uploadLogo, replaceLogo } = useSettingsStore();
    const { register, handleSubmit, formState: { errors }, clearErrors, control, reset } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [logoUrl, setLogoUrl] = useState<any>();

    // useEffect(() => {
    //     fetchProfileDetails().catch(error => { toaster.create({ description: error?.data?.message || "Failed to fetch useDetails", type: "error" }) });
    // }, []);

    useEffect(() => {
        reset({
            name: companyDetails?.name,
            GSTIN: companyDetails?.GSTIN,
            employeeRange: [companyDetails?.employeeRange],
            address: companyDetails?.address,
            PAN: companyDetails?.PAN,
            websiteUrl: companyDetails?.websiteUrl
        })
    }, [companyDetails])

    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "updating.....", type: "loading" });
        clearErrors();
        setLoading(true);

        try {
            const response: any = await editCompanyDetails({ ...data, employeeRange: data?.employeeRange[0], id: companyDetails?.id });
            toaster.update(toastId, { description: response.message || "Updated  successfully", type: "success" });
            setLoading(false);
            setEditCompany(false)
        } catch (error: any) {
            toaster.update(toastId, { description: error.data.message || "Updated Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    });


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogoUrl(imageUrl);

            // Send file to API
            const formData = new FormData();
            formData.append("file", file); // Important: 'file' as key

            if (companyDetails?.logoUrl) {
                formData.append("url", companyDetails?.logoUrl);
            }

            try {
                companyDetails?.logoUrl ? await replaceLogo(formData) : await uploadLogo(formData); // Or your API call

            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleBoxClick = () => {
        inputRef.current?.click();
    };


    const onDeleteLogo = () => {
        deleteLogo({ url: companyDetails?.logoUrl })
        setLogoUrl("");
    }

    return (
        <Flex color={"blackAlpha.800"} w={"100%"} flexDir={"column"} border={"1px solid"} borderColor={"gray.200"} fontSize={[14, 16, 20]}
            bg={"white"} p={5} justifyContent={"center"} gap={7} boxShadow={"lg"} borderRadius={{ base: 10, md: 10 }}  >
            <Flex justifyContent={"end"} alignItems={"center"}>
                {!editCompany && <Flex onClick={() => setEditCompany(true)} _hover={{ cursor: "pointer" }} alignItems={"center"} gap={2} color={"secondary"}>
                    {EditSquare("1em", "1em", "var(--chakra-colors-secondary)")}
                    <Text fontWeight={"500"} fontSize={"0.7em"} >Edit Profile</Text>
                </Flex>}
            </Flex>
            <Flex gap={5} flexDir={"column"} alignItems={"center"}>
                {
                    (companyDetails?.logoUrl || logoUrl) ? (
                        <Image onClick={() => { editCompany && handleBoxClick() }} src={companyDetails.logoUrl || logoUrl} alt="Logo" objectFit="fill" w={200} />
                    ) : (
                        <Box
                            h={100}
                            w={150}
                            bg="gray.100"
                            border="2px dashed gray"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            overflow="hidden"
                            onClick={() => { editCompany && handleBoxClick() }}
                        > Select Logo
                        </Box>
                    )
                }

                <Input display="none" ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} />

                {
                    (editCompany) && <Flex gap={4}>
                        {/* {
                            !companyDetails?.logoUrl && <Tooltip content="upload Image">
                                <Box _hover={{ cursor: "pointer" }} borderRadius={5} p={1} bg={"var(--chakra-colors-green-600)"} >{uploadIcon("1.2em", "1.2em", "var(--chakra-colors-white-alpha-800)")}</Box>
                            </Tooltip>
                        } */}
                        {
                            companyDetails?.logoUrl && <Tooltip content="Change Image">
                                <Box onClick={handleBoxClick} _hover={{ cursor: "pointer" }} borderRadius={5} p={1} bg={"blackAlpha.800"} >{ReplaceImage("1.2em", "1.2em", "var(--chakra-colors-white-alpha-800)")}</Box>
                            </Tooltip>
                        }
                        {
                            companyDetails?.logoUrl && <Tooltip content="Delete Image">
                                <Box onClick={onDeleteLogo} _hover={{ cursor: "pointer" }} borderRadius={5} p={1} bg={"red.600"}>{Delete("1.2em", "1.2em", "var(--chakra-colors-white-alpha-800)")}</Box>
                            </Tooltip>
                        }
                    </Flex>
                }
            </Flex>
            <Flex justifyContent={"start"} gap={10} >
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
                                        <Field label="Name" required invalid={!!errors.name} errorText={errors.name?.message}>
                                            <Input variant={!editCompany ? "subtle" : "outline"} disabled={!editCompany} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("name")} placeholder="Enter company name" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="GSTIN" invalid={!!errors.GSTIN} errorText={errors.GSTIN?.message}>
                                            <Input variant={!editCompany ? "subtle" : "outline"} disabled={!editCompany} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("GSTIN")} placeholder="Enter your GSTIN" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="PAN" invalid={!!errors.PAN} errorText={errors.PAN?.message}>
                                            <Input variant={!editCompany ? "subtle" : "outline"} disabled={!editCompany} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("PAN")} placeholder="Enter your PAN" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Employee Range" required invalid={!!errors.employeeRange} errorText={errors.employeeRange?.message}>
                                            <Controller
                                                control={control}
                                                name="employeeRange"
                                                render={({ field }) => (
                                                    <SelectRoot
                                                        variant={!editCompany ? "subtle" : "outline"} disabled={!editCompany}
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={({ value }) => field.onChange(value)}
                                                        onInteractOutside={() => field.onBlur()}
                                                        collection={employeesCountValues}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValueText placeholder="Select Employee Range" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {employeesCountValues.items.map((type) => (
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
                                            <Input variant={!editCompany ? "subtle" : "outline"} disabled={!editCompany} outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("websiteUrl")} placeholder="Enter your websiteUrl" />
                                        </Field>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Field label="Address" invalid={!!errors.address} errorText={errors.address?.message}>
                                            <Textarea rows={1} variant={!editCompany ? "subtle" : "outline"} disabled={!editCompany} outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("address")} />
                                        </Field>
                                    </GridItem>
                                </Grid>
                            </Flex>
                            {editCompany && <Flex justifyContent={"end"} gap={5}>
                                <Button variant={"outline"} onClick={() => setEditCompany(false)}  >Cancel</Button>
                                <Button type="submit" bg={"secondary"} w={120} >{loading ? <Spinner /> : "Save Changes"}</Button>
                            </Flex>}
                        </Flex>
                    </form>

                    {!editCompany && <Flex justifyContent={"end"} gap={5}>
                        <Text fontSize={"0.7em"} fontWeight={"500"} color={"blackAlpha.500"}>Last updated: {convertDatePrimaryStyle(companyDetails?.updatedAt)}</Text>
                    </Flex>}

                </Flex >
            </Flex>
        </Flex >
    )
}

export default CompanyCard