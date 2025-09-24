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
import { EditSquareNew } from "../../assets/editSquare";
import { updateInvoice } from "../../api/invoices";
import { useInvoicesStore } from "../../stores/invoice";
import { useInvoiceEditStore } from "../../stores/invoiceEdit";
import InvoiceGenerator from "./invoiceGenerator2";

const formSchema = z.object({
    code: z.string(),
});

const ManageInvoice: React.FC<any> = ({ item }) => {
    const [open, setOpen] = useState(false)
    const { fetchInvoices, page } = useInvoicesStore();
    const { setSelectedInvoice, updateInvoice } = useInvoiceEditStore();
    const { register, handleSubmit, formState: { errors }, clearErrors, control, watch, reset } = useForm({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);

    


    const onUpdateInvoice = async () => {
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        setLoading(true);
        try {
            const response: any = await updateInvoice();
            toaster.update(toastId, { description: response.message || "Invoice Updated  successfully", type: "success" });
            setLoading(false);
            setOpen(false);
            await fetchInvoices(page);
        } catch (error: any) {
            console.log(error);
            toaster.update(toastId, { description: error?.data?.message || "Invoice Updated Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Drawer.Root size={"xl"} open={open} onOpenChange={(e) => setOpen(e.open)} >
            <Drawer.Trigger asChild>
                <Button onClick={() => { setSelectedInvoice(item) }} p={2} minW={"auto"} minH={"auto"} bg={"primary"} variant="solid" size="sm">
                    <Box   >{EditSquareNew()}</Box>
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header alignItems={"center"} display={"flex"} justifyContent={"space-between"} >
                            <Drawer.Title>Update Invoice</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body  >
                            <InvoiceGenerator />

                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={onUpdateInvoice} bg={"dark"} w={120} >{loading ? <Spinner /> : "Update"}</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
};

export default ManageInvoice;