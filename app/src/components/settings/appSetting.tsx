import { Button, Heading, Flex, Grid, GridItem, Textarea, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { z } from "zod";
import { Field } from "../ui/field";
import { useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAppSetting, updateAppSetting } from "../../api/appSetting";


const formSchema = z.object({
    cgst: z.string(),
    sgst: z.string(),
    ccEmails: z
        .string()
        .nullable()
        .optional()
        .refine((val) => {
            if (!val) return true; // allow null or undefined

            const emails = val
                .split(",")
                .map(email => email.trim())
                .filter(email => email !== "");

            const allValid = emails.every(email =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            );

            const uniqueEmails = new Set(emails);

            return allValid && uniqueEmails.size === emails.length;
        }, {
            message: "ccEmails must be a comma-separated list of valid, non-duplicate email addresses",
        }),
});

const AppSetting = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, control, reset } = useForm({ resolver: zodResolver(formSchema) });

    useEffect(() => {
        (async () => {
            const settings = await getAppSetting();
            const response = await settings.data;
            reset({ ccEmails: response?.ccEmails, cgst: response?.cgst, sgst: response?.sgst });
        })();
    }, [])

    const onSubmit = handleSubmit(async (data: any) => {
        if (data.ccEmails) {
            let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
            clearErrors();
            try {
                const response: any = await updateAppSetting({ ...data, cgst: parseFloat(data.cgst), sgst: parseFloat(data.sgst) });
                toaster.update(toastId, { description: response.message || "App Settings updated  successfully", type: "success" });
                const responseData = await response.data;
                reset({ ccEmails: responseData.ccEmails });
            } catch (error: any) {
                console.error(error);
                toaster.update(toastId, { description: error?.data?.message || "App Settings updation Failed", type: "error" });
            } finally {
            }
        }
        return;
    }, (errors) => {
        console.error("Form validation errors:", errors);
    });

    return (
        <Flex w={"100%"} flexDir={"column"} gap={5} border={"1px solid"} borderColor={"gray.200"} boxShadow={"lg"} p={5} borderRadius={10}>
            <Flex justifyContent={"space-between"} flexDir={"column"} >
                <Heading size="xl">Core Settings</Heading>
                <form id="appSettings" onSubmit={onSubmit}>
                    <Flex flexDir={"column"} gap={5} mt={5}>
                        <Flex gap={3} w={"100%"} >
                            <Grid flexGrow={1}
                                templateColumns={{ base: "repeat(1, 1fr)" }}
                                templateRows="repeat(1fr)"
                                gap={5}
                                color={"blackAlpha.700"}
                            >
                                <GridItem colSpan={1} >
                                    <Field label="CGST(%)" required invalid={!!errors.cgst} errorText={errors.cgst?.message}>
                                        <Input outlineColor={"primary"} type="number" size={"xl"} placeholder="Enter cgst percentage" variant={"outline"}
                                            _focus={{ borderColor: "primary" }}  {...register("cgst")} />
                                    </Field>
                                </GridItem>
                                <GridItem colSpan={1} >
                                    <Field label="SGST(%)" required invalid={!!errors.sgst} errorText={errors.sgst?.message}>
                                        <Input outlineColor={"primary"} type="number" size={"xl"} placeholder="Enter sgst percentage" variant={"outline"}
                                            _focus={{ borderColor: "primary" }}  {...register("sgst")} />
                                    </Field>
                                </GridItem>
                                <GridItem colSpan={1} >
                                    <Field label="CC Mails" invalid={!!errors.ccEmails} errorText={errors.ccEmails?.message}>
                                        <Textarea outlineColor={"primary"} size={"xl"} rows={4} placeholder="Provide coma separated mails. (example1@mail.com,example2@mail.com)" variant={"outline"}
                                            _focus={{ borderColor: "primary" }}  {...register("ccEmails")} />
                                    </Field>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Button form="appSettings" type="submit" alignSelf={"end"} >Update</Button>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )

}

export default AppSetting