import { useState, useEffect } from "react";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle,
    DialogCloseTrigger,
    DialogActionTrigger,
} from "../ui/dialog";
import { Button, Flex, Box, Text, Separator } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import InvoiceEditor from "../invoice/invoiceGenerator";
import { useInvoiceEditStore } from "../../stores/invoiceEdit";
import { createDirectInvoice } from "../../api/invoices";
import { useSettingsStore } from "../../stores/settings";
import { formatLocalToUtcDate } from "../../utils/date";
import InvoiceIcon from "../../assets/invoice";
import { Tooltip } from "../ui/tooltip";
import { useAppSettingState } from "../../stores/appSetting";
import { v4 } from "uuid";
import { LuPlus } from "react-icons/lu";

interface DirectInvoiceModalProps {
    user: any;
}

const DirectInvoiceModal = ({ user }: DirectInvoiceModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { fetchAdminProfileDetails } = useSettingsStore();
    const { appSetting } = useAppSettingState();
    
    const {
        code, setCode, items, setItems, subTotal, CGST, SGST,
        CGSTAmount, SGSTAmount, total, date, dueDate, periodOfService,
        poNumber, balanceDue, amountPaid, type, h1, h2, h3, h4, h5, h6,
        h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17,
        setBillTo, setBillToDetails, setDate, setDueDate, setCGST, setSGST, setSubTotal
    } = useInvoiceEditStore();

    useEffect(() => {
        if (open && user) {
            // Fetch admin details for "Bill From"
            fetchAdminProfileDetails();
            
            // Pre-fill user/company details for "Bill To"
            setBillTo(user?.company?.name || user?.name || "");
            setBillToDetails(
                `${user?.company?.address || user?.address || ""}\n${
                    user?.company?.GSTIN ? "GSTIN No: " + user?.company?.GSTIN : ""
                }\n${user?.name ? "Contact Person: " + user?.name : ""}\n${
                    user?.phone ? "Mobile: " + user?.phone : ""
                }`
            );

            // Set default dates
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
            
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setDueDate(nextMonth.toISOString().split('T')[0]);

            // Set GST from app settings
            if (appSetting) {
                setCGST(appSetting.cgst || 9);
                setSGST(appSetting.sgst || 9);
            }

            // Initialize with one empty item if no items exist
            if (items.length === 0) {
                setItems([{ id: v4(), description: "", quantity: 1, rate: 0.00, amount: 0.00, SAC: "" }]);
            }
        }
    }, [open, user]);

    const onAddItem = () => {
        const newItem = { 
            id: v4(), 
            description: "", 
            quantity: 1, 
            rate: 0.00, 
            amount: 0.00,
            SAC: ""
        };
        setItems([...items, newItem]);
    };

    const handleSaveInvoice = async () => {
        try {
            setLoading(true);

            // Validation
            if (!date || !dueDate) {
                toaster.create({
                    description: "Please fill in date and due date",
                    type: "error"
                });
                return;
            }

            if (items.length === 0 || !items[0].description) {
                toaster.create({
                    description: "Please add at least one item with description",
                    type: "error"
                });
                return;
            }

            // Validate amounts
            if (items[0].rate <= 0 || items[0].amount <= 0) {
                toaster.create({
                    description: "Please enter a valid rate greater than 0",
                    type: "error"
                });
                return;
            }

            if (total <= 0) {
                toaster.create({
                    description: "Invoice total must be greater than 0",
                    type: "error"
                });
                return;
            }

            // Prepare invoice data
            const invoiceData = {
                userId: user.id,
                effectiveDate: formatLocalToUtcDate(date),
                dueDate: formatLocalToUtcDate(dueDate),
                description: items[0]?.description,
                SAC: items[0]?.SAC || null,
                perQuantityAmount: parseFloat(items[0]?.rate) || 0,
                quantity: parseInt(items[0]?.quantity) || 1,
                totalAmount: parseFloat(items[0]?.amount) || 0,
                taxableAmount: parseFloat(subTotal) || 0,
                amountPaid: parseFloat(amountPaid) || 0,
                poNumber: poNumber || null,
                balanceDue: parseFloat(balanceDue) || 0,
                periodOfService: periodOfService || null,
                cgstAmount: parseFloat(CGSTAmount) || 0,
                sgstAmount: parseFloat(SGSTAmount) || 0,
                cgst: parseFloat(CGST) || 0,
                sgst: parseFloat(SGST) || 0,
                finalAmount: parseFloat(total) || 0,
                type: user.taxInvoice ? "TAXABLE" : "NON_TAXABLE",
                headingsJson: { type, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17 },
                itemsJson: items.map(item => ({
                    ...item,
                    rate: parseFloat(item.rate) || 0,
                    amount: parseFloat(item.amount) || 0,
                    quantity: parseInt(item.quantity) || 1
                })),
                status: true
            };

            await createDirectInvoice(invoiceData);
            
            toaster.create({
                description: "Invoice created successfully",
                type: "success"
            });

            setOpen(false);
            
            // Reset form state
            setItems([]);
            setCode("");
        } catch (error: any) {
            toaster.create({
                description: error?.data?.message || "Failed to create invoice",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Reset items on close
        setItems([]);
        setCode("");
    };

    return (
        <DialogRoot 
            open={open} 
            onOpenChange={(e) => {
                if (!e.open) handleClose();
                else setOpen(e.open);
            }} 
            size="full"
        >
            <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Generate Invoice">
                <Button
                    onClick={() => setOpen(true)}
                    variant="ghost"
                    p={0}
                    h="auto"
                    minW="auto"
                    w="auto"
                >
                    <Box color="secondary">{InvoiceIcon()}</Box>
                </Button>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Invoice for {user?.name}</DialogTitle>
                    <DialogCloseTrigger />
                </DialogHeader>

                <DialogBody p={0} overflowY="auto">
                    <Flex flexDir="column" h="full">
                        {/* Invoice Preview Section */}
                        <Box 
                            bg="gray.50" 
                            borderBottom="1px solid" 
                            borderColor="gray.200"
                            p={6}
                        >
                            <InvoiceEditor />
                        </Box>

                        {/* Add Line Item Section - Positioned after items table */}
                        <Flex 
                            justifyContent="center" 
                            py={4}
                            px={6}
                            bg="white"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <Button 
                                onClick={onAddItem} 
                                size="sm" 
                                variant="outline"
                                colorPalette="blue"
                            >
                                <LuPlus /> Add Line Item
                            </Button>
                        </Flex>

                        {/* Helper Text */}
                        <Box px={6} py={3} bg="blue.50" borderBottom="1px solid" borderColor="blue.100">
                            <Text fontSize="sm" color="blue.700">
                                💡 <strong>Tip:</strong> All user and company details are pre-filled. Add your items and click Generate Invoice.
                            </Text>
                        </Box>
                    </Flex>
                </DialogBody>

                <DialogFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
                    <Flex w="full" justifyContent="space-between" alignItems="center">
                        <Text fontSize="sm" color="gray.600">
                            Invoice will be saved to {user?.name}'s account
                        </Text>
                        <Flex gap={3}>
                            <DialogActionTrigger asChild>
                                <Button variant="outline" size="md">Cancel</Button>
                            </DialogActionTrigger>
                            <Button
                                colorPalette="blue"
                                onClick={handleSaveInvoice}
                                loading={loading}
                                size="md"
                            >
                                Generate Invoice
                            </Button>
                        </Flex>
                    </Flex>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
};

export default DirectInvoiceModal;
