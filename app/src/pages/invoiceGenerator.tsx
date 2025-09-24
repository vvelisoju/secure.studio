import { Flex, Tabs, Text, Input, Box, Textarea, Group, Image as ChakraImage } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { InputGroup } from "../components/ui/input-group";
import { useEffect, useRef, useState } from "react";
import WrongIcon from "../assets/wrong";
import { useInvoiceGeneratorStore } from "../stores/invoiceGenerator";
import InvoiceDemo from "./invoiceDemo";
import Renew from "../assets/renew";
import { getInvoiceSetting } from "../api/invoiceSetting";
import { useSettingsStore } from "../stores/settings";
import { toaster } from "../components/ui/toaster";
import { useCompanyStore } from "../stores/company";
import { useAppSettingState } from "../stores/appSetting";

const InvoiceGenerator = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { code, setCode, type, setType, tab, setTab, terms, setTerms } = useInvoiceGeneratorStore();
    const { billFrom, setBillFrom, billFromDetails, setBillFromDetails } = useInvoiceGeneratorStore();
    const { billTo, setBillTo, billToDetails, setBillToDetails } = useInvoiceGeneratorStore();
    const { h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16,
        setH1, setH2, setH3, setH4, setH5, setH6, setH7, setH8, setH9, setH10,
        setH11, setH12, setH13, setH14, setH15, setH16 } = useInvoiceGeneratorStore();
    const { periodOfService, setPeriodOfService } = useInvoiceGeneratorStore();
    const { logoUrl, setLogoUrl } = useInvoiceGeneratorStore();
    const { date, setDate } = useInvoiceGeneratorStore();
    const { dueDate, setDueDate } = useInvoiceGeneratorStore();
    const { poNumber, setPoNumber } = useInvoiceGeneratorStore();
    const { items, setItems } = useInvoiceGeneratorStore();
    const [logoCount, setLogoCount] = useState<any>(0);
    const { subTotal, setSubTotal } = useInvoiceGeneratorStore();
    const { total } = useInvoiceGeneratorStore();
    const { type2, setType2, type3, setType3 } = useInvoiceGeneratorStore();
    const { CGST, setCGST, SGST, setSGST } = useInvoiceGeneratorStore();
    const { amountPaid, setAmountPaid, balanceDue } = useInvoiceGeneratorStore();
    const { fetchCompanyDetails, company } = useCompanyStore();
    const { fetchAppSetting } = useAppSettingState();

    useEffect(() => {
        fetchAppSetting()
        fetchCompanyDetails();
        setTab("INVOICE")
    }, []);

    const onAddItem = () => {
        const currentItemsLength = items.length;
        const newItem = { id: currentItemsLength + 1, description: "", quantity: 1, rate: 0.00, amount: 0.00 }
        setItems([...items, newItem]);
    }

    const onRemoveItem = (id: number) => {
        const filteredItems = items.filter((item: any) => item.id !== id);
        setItems([...filteredItems]);
        setSubTotal();
    }

    const onChangeDescription = (description: string, id: number) => {
        const updatedItems = items.map((item: any) => {
            if (id === item.id) {
                return { ...item, description }
            } else {
                return item
            }
        });
        setItems([...updatedItems]);
    }

    const onChangeQuantity = (quantity: number, id: number) => {
        const updatedItems = items.map((item: any) => {
            if (id === item.id) {
                return { ...item, quantity, amount: quantity * item.rate }
            } else {
                return item
            }
        });
        setItems([...updatedItems]);
        setSubTotal();
    }

    const onChangeRate = (rate: number, id: number) => {
        const updatedItems = items.map((item: any) => {
            if (id === item.id) {
                return { ...item, rate, amount: item.quantity * rate }
            } else {
                return item
            }
        });
        setItems([...updatedItems]);
        setSubTotal();
    }



    return (
        <Flex bg={"white"} borderRadius={10}
            p={5} justifyContent={"center"} alignItems={"start"}
        >
            <Flex ref={invoiceRef} border={"1px solid"} borderColor={"gray.200"}
                w={"950px"} h={"1347px"} p={5} flexDirection={"column"} justifyContent={"start"}
                alignItems={"center"}
            >
                {/* Section 1 */}
                <Flex color={"blackAlpha.800"} w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
                    <ChakraImage src={company?.logoBase64} alt="Preview" objectFit="fill" w={250} />
                    <Tabs.Root variant="enclosed" fitted value={tab} onValueChange={(e) => { setTab(e.value) }} >
                        <Tabs.List>
                            <Tabs.Trigger value={"INVOICE"}>Invoice</Tabs.Trigger>
                            <Tabs.Trigger value={"TAXINVOICE"}>Tax Invoice</Tabs.Trigger>
                        </Tabs.List>
                    </Tabs.Root>
                    {/* heading and code */}
                    <Flex flexDirection={"column"} alignItems={"end"} gap={4}>
                        <Input textAlign={"end"} fontWeight={400} border={0} fontSize={"4xl"} w={300} type="text" onChange={(e) => { setType(e.target.value) }} value={type} />
                        <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200} value={code} onChange={(e) => { setCode(e.target.value) }} />
                    </Flex>
                </Flex>

                {/* Section 2 */}
                <Flex gap={10} mt={5} color={"blackAlpha.500"} w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
                    <Flex w={"50%"} flexDir={"column"} gap={5} >
                        <Flex flexDir={"column"} gap={0.5}>
                            <Input color={"blackAlpha.800"} fontWeight={600} size="sm" placeholder="Who is this From ?" value={billFrom} onChange={(e) => { setBillFrom(e.target.value) }} />
                            <Textarea color={"blackAlpha.700"} fontWeight={500} size="xs" resize={"none"} placeholder="Details ?" w={"100%"} minH={10} autoresize value={billFromDetails} onChange={(e) => { setBillFromDetails(e.target.value) }} />
                        </Flex>
                        <Flex w={"100%"} gap={5}>
                            <Flex w={"100%"} flexDir={"column"} >
                                <Input fontWeight={500} size="xs" border={0} value={h1} onChange={(e) => { setH1(e.target.value) }} />
                                <Flex flexDir={"column"} gap={0.5}>
                                    <Input color={"blackAlpha.800"} fontWeight={600} size="sm" placeholder="Who is this To ?" value={billTo} onChange={(e) => { setBillTo(e.target.value) }} />
                                    <Textarea color={"blackAlpha.700"} fontWeight={500} size="xs" resize={"none"} placeholder="Details ?" w={"100%"} minH={10} autoresize value={billToDetails} onChange={(e) => { setBillToDetails(e.target.value) }} />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex w={"50%"} flexDir={"column"} gap={1}>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h2} onChange={(e) => { setH2(e.target.value) }} />
                            <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200}  value={periodOfService} onChange={(e) => { setPeriodOfService(e.target.value) }} />
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h3} onChange={(e) => { setH3(e.target.value) }} />
                            <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200} type="date" value={date} onChange={(e) => { setDate(e.target.value) }} />
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h4} onChange={(e) => { setH4(e.target.value) }} />
                            <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200} type="date" value={dueDate} onChange={(e) => { setDueDate(e.target.value); }} />
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h5} onChange={(e) => { setH5(e.target.value) }} />
                            <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200} value={poNumber} onChange={(e) => { setPoNumber(e.target.value) }} />
                        </Flex>
                    </Flex>
                </Flex>

                {/* Section 3 */}
                <Flex w={"100%"} flexDir={"column"} gap={1}>
                    <Flex h={"10"} bg={"secondary"} gap={1} mt={5} color={"whiteAlpha.800"}
                        w={"100%"} justifyContent={"space-between"} alignItems={"center"}
                        borderRadius={5}
                    >
                        <Flex flexGrow={1} minW={100} flexDir={"column"} gap={5}  >
                            <Input outlineColor={"whiteAlpha.800"} fontWeight={500} size="sm" border={0} value={h7} onChange={(e) => { setH7(e.target.value) }} />
                        </Flex>
                        <Flex w={"10%"} minW={100} flexDir={"column"} gap={1}>
                            <Input outlineColor={"whiteAlpha.800"} fontWeight={500} size="sm" border={0} value={h8} onChange={(e) => { setH8(e.target.value) }} />
                        </Flex>
                        <Flex w={"10%"} minW={100} flexDir={"column"} gap={1}>
                            <Input outlineColor={"whiteAlpha.800"} fontWeight={500} size="sm" border={0} value={h9} onChange={(e) => { setH9(e.target.value) }} />
                        </Flex>
                        <Flex w={"15%"} minW={100} flexDir={"column"} gap={1}>
                            <Input outlineColor={"whiteAlpha.800"} fontWeight={500} size="sm" border={0} value={h10} onChange={(e) => { setH10(e.target.value) }} />
                        </Flex>
                    </Flex>
                    {
                        items.map((item: any) => {
                            return <Flex key={item.id} h={"10"} gap={1} color={"blackAlpha.800"}
                                w={"100%"} justifyContent={"space-between"} alignItems={"center"}
                                borderRadius={5}
                            >
                                <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} flexGrow={1} minW={100} flexDir={"column"} justifyContent={"center"}   >
                                    <Input type="text" placeholder="Description of Item/Service." outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0} value={item.description} onChange={(e) => { onChangeDescription(e.target.value, item.id) }} />
                                </Flex>
                                <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} w={"10%"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                    <Input type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0} min={1} value={item.quantity} onChange={(e) => { if (e.target.value) onChangeQuantity(parseInt(e.target.value), item.id) }} />
                                </Flex>
                                <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} w={"10%"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                    <InputGroup startElement="Rs" fontSize={"xs"}  >
                                        <Input ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0} value={item.rate} onChange={(e) => { if (e.target.value) onChangeRate(parseInt(e.target.value), item.id) }} />
                                    </InputGroup>
                                </Flex>
                                <Flex w={"15%"} minW={100} gap={1} alignItems={"center"}>
                                    <Text fontSize="sm" fontWeight={500} color={"blackAlpha.600"} w={"70%"} textAlign={"end"}>{"₹" + item.amount.toFixed(2)}</Text>
                                    {items.length > 1 && <Button onClick={() => { onRemoveItem(item.id) }} variant={"ghost"} >{WrongIcon()}  </Button>}
                                </Flex>
                            </Flex>
                        })
                    }
                    <Button onClick={onAddItem} size={"xs"} color={"support"} borderColor={"support"} variant={"outline"} alignSelf={"start"}>+ Line Item</Button>
                </Flex>

                {/* Section 4 */}
                <Flex gap={10} mt={5} color={"blackAlpha.500"} w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
                    <Flex w={"50%"} flexDir={"column"} gap={5} >
                        <Flex w={"100%"} gap={5}>
                            <Flex w={"100%"} flexDir={"column"} >
                                <Input fontWeight={500} size="xs" border={0} value={h16} onChange={(e) => { setH16(e.target.value) }} />
                                <Flex flexDir={"column"} gap={0.5}>
                                    <Textarea color={"blackAlpha.700"} fontWeight={500} size="xs" resize={"none"} placeholder="Terms and Conditions - late fees, payment methods, delivery schedule" w={"100%"}
                                        minH={20} autoresize value={terms} onChange={(e) => { setTerms(e.target.value) }} />
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex w={"50%"} flexDir={"column"} gap={1}>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h11} onChange={(e) => { setH11(e.target.value) }} />
                            <Text fontSize="sm" fontWeight={500} color={"blackAlpha.600"} w={"50%"} >{"₹" + subTotal.toFixed(2)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h12} onChange={(e) => { setH12(e.target.value) }} />
                            <Group attached w={"50%"}>
                                {
                                    type2 === "PERCENTAGE" ? <InputGroup endElement="%">
                                        <Input value={CGST} onChange={(e) => { setCGST(parseInt(e.target.value)) }} min={0} type="number" />
                                    </InputGroup> :
                                        <InputGroup startElement="Rs" fontSize={"xs"}  >
                                            <Input value={CGST} onChange={(e) => { setCGST(parseInt(e.target.value)) }} ml={2} type="number"
                                                outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0} />
                                        </InputGroup>
                                }
                                <Button w={0} onClick={() => {
                                    type2 === "PERCENTAGE" ? setType2("PRICE") : setType2("PERCENTAGE");
                                    setSubTotal();
                                }} color={"blackAlpha.600"} variant="outline">
                                    {Renew()}
                                </Button>
                            </Group>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h13} onChange={(e) => { setH13(e.target.value) }} />
                            <Group attached w={"50%"}>
                                {
                                    type3 === "PERCENTAGE" ? <InputGroup endElement="%">
                                        <Input type="number" value={SGST} onChange={(e) => { setSGST(parseInt(e.target.value)) }} min={0} />
                                    </InputGroup> : <InputGroup startElement="Rs" fontSize={"xs"}  >
                                        <Input value={SGST} onChange={(e) => { setSGST(parseInt(e.target.value)) }} ml={2} type="number"
                                            outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0} />
                                    </InputGroup>
                                }
                                <Button w={0} onClick={() => {
                                    type3 === "PERCENTAGE" ? setType3("PRICE") : setType3("PERCENTAGE");
                                    setSubTotal();
                                }} color={"blackAlpha.600"} variant="outline">
                                    {Renew()}
                                </Button>
                            </Group>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h14} onChange={(e) => { setH14(e.target.value) }} />
                            <Text fontSize="sm" fontWeight={500} color={"blackAlpha.600"} w={"50%"} >{"₹" + total.toFixed(2)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h15} onChange={(e) => { setH15(e.target.value) }} />
                            <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                <InputGroup startElement="Rs" fontSize={"xs"}  >
                                    <Input ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0}
                                        value={amountPaid} onChange={(e) => { if (e.target.value) setAmountPaid(parseInt(e.target.value)) }} />
                                </InputGroup>
                            </Flex>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h6} onChange={(e) => { setH6(e.target.value) }} />
                            <Text fontSize="sm" fontWeight={500} color={"blackAlpha.600"} w={"50%"} >{"₹" + balanceDue.toFixed(2)}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <InvoiceDemo />
        </Flex>
    )
}

export default InvoiceGenerator