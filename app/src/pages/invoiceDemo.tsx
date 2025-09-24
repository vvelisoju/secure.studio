import { Flex, Editable, Text, Input, Box, Image as ChakraImage } from "@chakra-ui/react"
import { Button, FileUpload, Float, useFileUploadContext, } from "@chakra-ui/react"
import { InputGroup } from "../components/ui/input-group"
import { useRef, useState } from "react"
import WrongIcon from "../assets/wrong"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useInvoiceGeneratorStore } from "../stores/invoiceGenerator"
import { formatDateForInvoice } from "../utils/date"
import Renew from "../assets/renew"
import { useSettingsStore } from "../stores/settings"
import { useCompanyStore } from "../stores/company"


const InvoiceDemo = () => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { billFrom, billFromDetails } = useInvoiceGeneratorStore();
    const { billTo, setBillTo, billToDetails, setBillToDetails, terms } = useInvoiceGeneratorStore();

    const { h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16,
        setH1, setH2, setH3, setH4, setH5, setH6, setH7, setH8, setH9, setH10,
        setH11, setH12, setH13, setH14, setH15, setH16 } = useInvoiceGeneratorStore();
    const { periodOfService, date, dueDate, poNumber, balanceDue, amountPaid, setAmountPaid } = useInvoiceGeneratorStore();
    const { type, code, tab } = useInvoiceGeneratorStore();
    const { subTotal, setSubTotal } = useInvoiceGeneratorStore();
    const { total } = useInvoiceGeneratorStore();
    const { type2, type3 } = useInvoiceGeneratorStore();
    const { CGST, CGSTAmount, SGST, SGSTAmount, logoUrl } = useInvoiceGeneratorStore();
    const [logoCount, setLogoCount] = useState<any>(0);
    const { items } = useInvoiceGeneratorStore();
    const { company } = useCompanyStore();


    const Upload = () => {
        return (
            <Flex direction="column" gap={4}>
                <ChakraImage src={company?.logoBase64} alt="Preview" objectFit="fill" w={250} />
            </Flex>
        )
    }


    const downloadPdf = async (invoiceRef: any): Promise<void> => {
        if (!invoiceRef.current) return;
        try {
            // Step 1: Process main invoice content
            // Clone invoice for A4 export
            const clone = invoiceRef.current.cloneNode(true) as HTMLElement;

            // Create a temporary div for the invoice content
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            clone.style.width = '794px';
            clone.style.height = 'auto';
            clone.style.maxWidth = 'none';
            clone.style.transform = 'none';
            clone.style.padding = '40px';
            clone.style.boxSizing = 'border-box';

            tempDiv.appendChild(clone);
            document.body.appendChild(tempDiv);

            // Generate canvas for main invoice
            const canvas = await html2canvas(clone, {
                scale: 600 / 96,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            // Step 2: Setup PDF dimensions and scaling
            const pdf = new jsPDF({ orientation: "portrait", unit: 'mm', format: "a4" });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Scale to fit PDF width
            const scaleFactor = pdfWidth / imgWidth;
            const scaledImgHeight = imgHeight * scaleFactor;

            const contentHeight = pdfHeight;

            // Step 3: Render main invoice content (possibly multi-page)
            let currentY = 0;
            let pageIndex = 0;

            while (currentY < scaledImgHeight) {
                if (pageIndex > 0) {
                    pdf.addPage();
                }


                // Calculate portion of image to add
                const remainingHeight = scaledImgHeight - currentY;
                const sliceHeight = Math.min(remainingHeight, contentHeight);

                // Crop image and add it to PDF
                const croppedCanvas = document.createElement("canvas");
                croppedCanvas.width = imgWidth;
                croppedCanvas.height = sliceHeight / scaleFactor;

                const ctx = croppedCanvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(canvas, 0, currentY / scaleFactor, imgWidth, croppedCanvas.height, 0, 0, imgWidth, croppedCanvas.height);
                }

                const croppedImgData = croppedCanvas.toDataURL("image/jpeg", 1.0);
                pdf.addImage(croppedImgData, "JPEG", 0, 0, pdfWidth, sliceHeight);


                // Move to next portion
                currentY += sliceHeight;
                pageIndex++;
            }

            // Wait for rendering to complete
            await new Promise(resolve => setTimeout(resolve, 600));


            // Save the PDF
            pdf.save(`${type}-${tab}-${code}.pdf`);

            // Clean up
            document.body.removeChild(tempDiv);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
        }
    };


    return (
        <Flex flexGrow={1} p={5} justifyContent={"center"} alignItems={"start"}
        >
            <Flex transformOrigin="top left"
                position="absolute"  // Ensure it's positioned correctly inside the parent
                transform="scale(0)" ref={invoiceRef} w={"950px"} h={"1347px"} flexDirection={"column"} justifyContent={"start"}
                alignItems={"center"}
            >
                {/* Section 1 */}
                <Flex w={"100%"} justifyContent={"space-between"} alignItems={"start"}>
                    {/* logo input */}
                    {Upload()}
                    {/* heading and code */}
                    <Flex flexDirection={"column"} alignItems={"end"} >
                        <Text color={"blackAlpha.800"} textAlign={"end"} fontWeight={400} fontSize={"4xl"} w={300}>{type}</Text>
                        <Text color={"blackAlpha.700"} textAlign={"end"} fontWeight={500} fontSize={"sm"} w={300}># {code}</Text>
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
                                <Text color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} w={300}>{h1}</Text>
                                <Flex flexDir={"column"}>
                                    <Text color={"blackAlpha.800"} fontWeight={600} fontSize={"sm"} w={300}>{billTo}</Text>
                                    <Text whiteSpace={"pre-line"} color={"blackAlpha.700"} fontWeight={500} fontSize={"xs"} w={300}>{billToDetails}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex w={"50%"} flexDir={"column"} gap={2}>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h2}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >{periodOfService}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h3}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >{formatDateForInvoice(date)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h4}</Text>
                            <Text w={"30%"} flexGrow={1} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >{formatDateForInvoice(dueDate)}</Text>
                        </Flex>
                        {poNumber && <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h5}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >{poNumber}</Text>
                        </Flex>}
                        <Flex height="32px" alignItems={"center"} borderRadius={5} bg={"blackAlpha.200"} >
                            <Flex alignItems={"center"} w={"100%"} gap={5}>
                                <Text mt={-3} w={"70%"} h={6} textAlign={"end"} color={"blackAlpha.800"} fontWeight={600} fontSize={"sm"} >{h6}</Text>
                                <Text mt={-3} w={"30%"} h={6} textAlign={"start"} color={"blackAlpha.800"} fontWeight={600} fontSize={"sm"} > ₹{balanceDue.toFixed(2)}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                {/* Section 3 */}
                <Flex w={"100%"} flexDir={"column"} >
                    <Flex h={"28px"} bg={"blackAlpha.700"} gap={1} mt={5} color={"whiteAlpha.800"}
                        w={"100%"} justifyContent={"space-between"} alignItems={"center"}
                        borderRadius={5}
                    >
                        <Flex flexGrow={1} minW={100} flexDir={"column"} gap={5}  >
                            <Text mt={-3} px={3} fontWeight={500} border={0} fontSize={"sm"} >{h7}</Text>
                        </Flex>
                        <Flex w={"10%"} minW={100} flexDir={"column"} gap={1}>
                            <Text mt={-3} fontWeight={500} border={0} fontSize={"sm"}>{h8}</Text>
                        </Flex>
                        <Flex w={"10%"} minW={100} flexDir={"column"} gap={1}>
                            <Text mt={-3} fontWeight={500} border={0} fontSize={"sm"}>{h9}</Text>
                        </Flex>
                        <Flex w={"15%"} minW={100} flexDir={"column"} gap={1}>
                            <Text mt={-3} fontWeight={500} border={0} fontSize={"sm"}>{h10}</Text>
                        </Flex>
                    </Flex>
                    {
                        items.map((item: any) => {
                            return <Flex key={item.id} h={"10"} gap={1} color={"blackAlpha.800"}
                                w={"100%"} justifyContent={"space-between"} alignItems={"center"}
                                borderRadius={5}
                            >
                                <Flex borderRadius={5} flexGrow={1} minW={100} flexDir={"column"} gap={5}  >
                                    <Text mt={-3} px={3} fontWeight={500} border={0} fontSize={"sm"} >{item.description}</Text>
                                </Flex>
                                <Flex borderRadius={5} w={"10%"} minW={100} flexDir={"column"} gap={1}>
                                    <Text mt={-3} fontWeight={500} border={0} fontSize={"sm"} >{item.quantity}</Text>
                                </Flex>
                                <Flex borderRadius={5} w={"10%"} minW={100} flexDir={"column"} gap={1}>
                                    <Text mt={-3} color={"blackAlpha.700"} fontWeight={500} border={0} fontSize={"sm"} >{"₹" + item.rate}</Text>
                                </Flex>
                                <Flex w={"15%"} minW={100} gap={1} >
                                    <Text mt={-3} fontWeight={500} w={"70%"} fontSize={"sm"}>{"₹" + item.amount.toFixed(2)}</Text>

                                </Flex>
                            </Flex>
                        })
                    }
                </Flex>

                {/* Section 4 */}
                <Flex mt={5} color={"blackAlpha.500"} w={"100%"} justifyContent={"end"} alignItems={"start"}>

                    <Flex w={"50%"} flexDir={"column"} gap={2}>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h11}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >₹{subTotal.toFixed(2)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{type2 === "PERCENTAGE" ? h12 + `(${CGST})%` : h12}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >₹{CGSTAmount.toFixed(2)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{type3 === "PERCENTAGE" ? h13 + `(${SGST})%` : h13}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >₹{SGSTAmount.toFixed(2)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h14}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >₹{total.toFixed(2)}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} alignItems={"center"}>
                            <Text w={"70%"} textAlign={"end"} color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} >{h15}</Text>
                            <Text w={"30%"} textAlign={"start"} color={"blackAlpha.700"} fontWeight={600} fontSize={"xs"} >₹{amountPaid.toFixed(2)}</Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex mt={5} color={"blackAlpha.500"} w={"100%"} justifyContent={"end"} alignItems={"start"}>
                    <Flex w={"100%"} flexDir={"column"} gap={5} >
                        <Flex w={"100%"} gap={5}>
                            <Flex w={"100%"} flexDir={"column"} >
                                <Text color={"blackAlpha.600"} fontWeight={600} fontSize={"xs"} w={300}>{h16}</Text>
                                <Flex w={"100%"} flexDir={"column"} gap={0.5}>
                                    <Text whiteSpace={"pre-line"} color={"blackAlpha.700"} fontWeight={500} fontSize={"xs"} w={"100%"}>{terms}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Button w={150} onClick={() => downloadPdf(invoiceRef)} >Download {type[0].toUpperCase() + type.slice(1).toLowerCase()}</Button>
        </Flex>
    )
}

export default InvoiceDemo