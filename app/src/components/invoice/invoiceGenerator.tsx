import { Flex, Tabs, Text, Input, Box, Textarea, Group, Image as ChakraImage, Image } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group";
import { useEffect, useRef, useState } from "react";
import WrongIcon from "../../assets/wrong";
import { useInvoiceEditStore } from "../../stores/invoiceEdit";
import { useCompanyStore } from "../../stores/company";
import { useSettingsStore } from "../../stores/settings";

const InvoiceEditor = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { code, setCode, type, setType, terms, setTerms } = useInvoiceEditStore();
    const { billFrom, setBillFrom, billFromDetails, setBillFromDetails } = useInvoiceEditStore();
    const { billTo, setBillTo, billToDetails, setBillToDetails } = useInvoiceEditStore();
    const { h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16,
        setH1, setH2, setH3, setH4, setH5, setH6, setH7, setH8, setH9, setH10,
        setH11, setH12, setH13, setH14, setH15, setH16 } = useInvoiceEditStore();
    const { periodOfService, setPeriodOfService } = useInvoiceEditStore();
    const { logoUrl, setLogoUrl } = useInvoiceEditStore();
    const { date, setDate } = useInvoiceEditStore();
    const { dueDate, setDueDate } = useInvoiceEditStore();
    const { poNumber, setPoNumber } = useInvoiceEditStore();
    const { items, setItems } = useInvoiceEditStore();
    const [logoCount, setLogoCount] = useState<any>(0);
    const { subTotal, setSubTotal } = useInvoiceEditStore();
    const { total } = useInvoiceEditStore();
    const { CGST, setCGST, SGST, setSGST, CGSTAmount, SGSTAmount } = useInvoiceEditStore();
    const { amountPaid, setAmountPaid, balanceDue } = useInvoiceEditStore();
    const { fetchCompanyDetails, company } = useCompanyStore();

    // useEffect(() => {
    //     fetchCompanyDetails();
    // }, []);


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
            p={0} justifyContent={"center"} alignItems={"start"}
        >
            <Flex ref={invoiceRef} border={"1px solid"} borderColor={"gray.200"}
                w={"950px"} h={"1347px"} p={5} flexDirection={"column"} justifyContent={"start"}
                alignItems={"center"}
            >
                {/* Section 1 */}
                <Flex color={"blackAlpha.800"} w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
                    {/* logo input */}
                    <Image src={company?.logoUrl} alt="Logo" objectFit="fill" w={200} />
                    {/* heading and code */}
                    <Flex flexDirection={"column"} alignItems={"end"} gap={4}>
                        <Input textAlign={"end"} fontWeight={400} border={0} fontSize={"4xl"} w={300} type="text" onChange={(e) => { setType(e.target.value) }} value={type} />
                        <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200} value={code} onChange={(e) => { setCode(e.target.value) }} />
                    </Flex>
                </Flex>

                {/* Section 2 */}
                <Flex gap={10} mt={5} color={"blackAlpha.500"} w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
                    <Flex w={"50%"} flexDir={"column"} gap={5} >
                        <Flex flexDir={"column"} >
                            <Text color={"blackAlpha.800"} fontWeight={600} fontSize={"sm"} w={300}>{billFrom}</Text>
                            <Text whiteSpace={"pre-line"} color={"blackAlpha.700"} fontWeight={500} fontSize={"xs"} w={300}>{billFromDetails}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5}>
                            <Flex w={"100%"} flexDir={"column"} >
                                <Input fontWeight={500} size="xs" border={0} value={h1} onChange={(e) => { setH1(e.target.value) }} />
                                <Flex flexDir={"column"}>
                                    <Text color={"blackAlpha.800"} fontWeight={600} fontSize={"sm"} w={300}>{billTo}</Text>
                                    <Text whiteSpace={"pre-line"} color={"blackAlpha.700"} fontWeight={500} fontSize={"xs"} w={300}>{billToDetails}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex w={"50%"} flexDir={"column"} gap={1}>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h2} onChange={(e) => { setH2(e.target.value) }} />
                            <Input color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"xs"} w={200} value={periodOfService} onChange={(e) => { setPeriodOfService(e.target.value) }} />
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
                            <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                <InputGroup startElement="Rs" fontSize={"xs"}  >
                                    <Input ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0}
                                        value={subTotal} onChange={(e) => { if (e.target.value) setSubTotal() }} />
                                </InputGroup>
                            </Flex>                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Flex alignItems={"center"} w={"100%"}>
                                <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h12} onChange={(e) => { setH12(e.target.value) }} />
                                <Text>{CGST}%</Text>
                            </Flex>
                            <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                <InputGroup startElement="Rs" fontSize={"xs"}  >
                                    <Input disabled ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0}
                                        value={CGSTAmount} onChange={(e) => { if (e.target.value) setCGST(parseInt(e.target.value)) }} />
                                </InputGroup>
                            </Flex>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Flex alignItems={"center"} w={"100%"}>
                                <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h13} onChange={(e) => { setH13(e.target.value) }} />
                                <Text>{SGST}%</Text>
                            </Flex>
                            <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                <InputGroup startElement="Rs" fontSize={"xs"}  >
                                    <Input disabled ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0}
                                        value={SGSTAmount} onChange={(e) => { if (e.target.value) setSGST(parseInt(e.target.value)) }} />
                                </InputGroup>
                            </Flex>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Input textAlign={"end"} fontWeight={500} size="xs" border={0} value={h14} onChange={(e) => { setH14(e.target.value) }} />
                            <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                <InputGroup startElement="Rs" fontSize={"xs"}  >
                                    <Input ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0}
                                        defaultValue={total} />
                                </InputGroup>
                            </Flex>                        </Flex>
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
                            <Flex borderRadius={5} border={"1px solid"} borderColor={"gray.300"} minW={100} flexDir={"column"} justifyContent={"center"} gap={1}>
                                <InputGroup startElement="Rs" fontSize={"xs"}  >
                                    <Input ml={2} type="number" outlineColor={"whiteAlpha.800"} fontWeight={500} fontSize="sm" border={0}
                                        defaultValue={balanceDue} />
                                </InputGroup>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            {/* <InvoiceDemo /> */}
        </Flex>
    )
}

export default InvoiceEditor