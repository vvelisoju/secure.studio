import { Button, Heading, Flex, Grid, GridItem, Textarea, Input, Box, Image } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { Field } from "../ui/field";
import { useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { getInvoiceSetting, updateInvoiceSetting } from "../../api/invoiceSetting";


const formSchema = z.object({
    invoiceNo: z.string(),
    taxInvoiceNo: z.string(),
});

const InvoiceSetting = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, control, reset } = useForm({ resolver: zodResolver(formSchema) });

    useEffect(() => {
        (async () => {
            const settings = await getInvoiceSetting();
            const response = await settings.data;
            reset({ invoiceNo: response.invoiceNumber + "", taxInvoiceNo: response.taxInvoiceNumber + "" });
        })();
    }, [])

    const onSubmit = handleSubmit(async (data: any) => {
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        clearErrors();
        try {
            const response: any = await updateInvoiceSetting({ invoiceNumber: parseInt(data.invoiceNo), taxInvoiceNumber: parseInt(data.taxInvoiceNo) });
            toaster.update(toastId, { description: response.message || "Invoice Settings updated  successfully", type: "success" });
            const responseData = await response.data;
            reset({ invoiceNo: responseData.invoiceNumber + "", taxInvoiceNo: responseData.taxInvoiceNumber + "" });
        } catch (error: any) {
            console.error(error);
            toaster.update(toastId, { description: error?.data?.message || "Invoice Settings updation Failed", type: "error" });
        } finally {
        }
        return;
    }, (errors) => {
        console.error("Form validation errors:", errors);
    });


    return (
        <Flex h={"100%"} w={"100%"} flexDir={"column"} gap={5} border={"1px solid"} borderColor={"gray.200"} boxShadow={"lg"} p={5} borderRadius={10}>
            <Flex justifyContent={"space-between"} flexDir={"column"} >
                <Heading size="xl">Invoice Settings</Heading>
                <form id="invoiceSettings" onSubmit={onSubmit}>
                    <Flex flexDir={"column"} gap={5} mt={5}>
                        <Flex gap={3} w={"100%"} >
                            <Grid flexGrow={1}
                                templateColumns={{ base: "repeat(1, 1fr)" }}
                                templateRows="repeat(1fr)"
                                gap={5}
                                color={"blackAlpha.700"}
                            >
                                <GridItem colSpan={1} >
                                    <Field label="Invoice No" required invalid={!!errors.invoiceNo} errorText={errors.invoiceNo?.message}>
                                        <Input outlineColor={"primary"} type="number" size={"xl"} placeholder="Enter Tax Invoice Number" variant={"outline"}
                                            _focus={{ borderColor: "primary" }}  {...register("invoiceNo")} />
                                    </Field>
                                </GridItem>
                                <GridItem colSpan={1} >
                                    <Field label="Tax Invoice No" required invalid={!!errors.taxInvoiceNo} errorText={errors.taxInvoiceNo?.message}>
                                        <Input outlineColor={"primary"} type="number" size={"xl"} placeholder="Enter Tax Invoice Number" variant={"outline"}
                                            _focus={{ borderColor: "primary" }}  {...register("taxInvoiceNo")} />
                                    </Field>
                                </GridItem>
                            </Grid>
                        </Flex>
                        <Button form="invoiceSettings" type="submit" alignSelf={"end"} >Update</Button>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )

}

export default InvoiceSetting