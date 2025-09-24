import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Image as ChakraImage, Separator, Spinner, Text } from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PdfHeader from "../assets/pdfHeader.png";
import pdfQuotationHeader from "../assets/quotationPdfHeader.png";
import pdfFooter from "../assets/pdfFooter.png"
import { convertDatePrimaryStyle } from '../utils/date';
import useServiceStore from '../stores/services';
import Signature from "../assets/signature.png"
import Download from '../assets/download';
import { useCompanyStore } from '../stores/company';
import InvoiceTerms from './invoiceTerms&Conditions';
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from 'react-dom/client';
import { system } from '../theme';

interface InvoiceProps {
    invoiceDetails?: any;
    buttonContent?: any;
    status?: any;
}
const Invoice: React.FC<InvoiceProps> = ({ invoiceDetails, buttonContent, status }) => {
    const { invoiceDownload, setInvoiceDownload } = useServiceStore();
    const details = invoiceDetails;
    const user = details?.booking?.user;
    const invoice = details
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { company } = useCompanyStore();





    // const downloadPdf = async (invoiceRef: any): Promise<void> => {
    //     setInvoiceDownload({ id: invoice?.id, loading: true })
    //     if (!invoiceRef.current) return;
    //     try {
    //         // Clone invoice for A4 export
    //         const clone = invoiceRef.current.cloneNode(true) as HTMLElement;
    //         // Remove all <img> elements
    //         clone.querySelectorAll('.remove').forEach(img => img.remove());



    //         // Remove horizontal padding (paddingLeft & paddingRight) from elements with class "pd"
    //         clone.querySelectorAll('.pd').forEach((element) => {
    //             (element as HTMLElement).style.paddingLeft = '0px';
    //             (element as HTMLElement).style.paddingRight = '0px';
    //         });


    //         const tempDiv = document.createElement('div');
    //         tempDiv.style.position = 'absolute';
    //         tempDiv.style.left = '-9999px';
    //         tempDiv.style.top = '-9999px';
    //         clone.style.width = '794px';
    //         clone.style.height = 'auto';
    //         clone.style.maxWidth = 'none';
    //         clone.style.transform = 'none';
    //         clone.style.padding = '40px';
    //         clone.style.paddingTop = '0px';
    //         clone.style.boxSizing = 'border-box';

    //         tempDiv.appendChild(clone);
    //         document.body.appendChild(tempDiv);


    //         // Generate canvas
    //         const canvas = await html2canvas(clone, {
    //             scale: 600 / 96,
    //             useCORS: true,
    //             logging: false,
    //             allowTaint: true,
    //             backgroundColor: '#ffffff'
    //         });

    //         const pdf = new jsPDF({ orientation: "portrait", unit: 'mm', format: "a4" });

    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = pdf.internal.pageSize.getHeight();
    //         const imgWidth = canvas.width;
    //         const imgHeight = canvas.height;

    //         // Scale to fit PDF width
    //         const scaleFactor = pdfWidth / imgWidth;
    //         const scaledImgHeight = imgHeight * scaleFactor;

    //         const loadImageDimensions = (imageSrc: string): Promise<{ width: number; height: number }> => {
    //             return new Promise((resolve) => {
    //                 const img = new Image();
    //                 img.src = imageSrc;
    //                 img.onload = () => {
    //                     resolve({ width: img.naturalWidth, height: img.naturalHeight });
    //                 };
    //             });
    //         };

    //         // Header/Footer setup
    //         const headerImg = await loadImageDimensions(PdfHeader);
    //         const footerImg = await loadImageDimensions(pdfFooter);

    //         const headerScale = pdfWidth / headerImg.width;
    //         const footerScale = pdfWidth / footerImg.width;

    //         const headerHeight = (headerImg.height * headerScale);
    //         const footerHeight = footerImg.height * footerScale;

    //         let yPosition = headerHeight;
    //         const contentHeight = pdfHeight - headerHeight - footerHeight;

    //         let currentY = 0;
    //         let pageIndex = 0;

    //         while (currentY < scaledImgHeight) {
    //             if (pageIndex > 0) {
    //                 pdf.addPage();
    //             }

    //             // Add header
    //             pdf.addImage(PdfHeader, "PNG", 0, 0, pdfWidth, headerHeight);

    //             // Calculate portion of image to add
    //             const remainingHeight = scaledImgHeight - currentY;
    //             const sliceHeight = Math.min(remainingHeight, contentHeight);

    //             // Crop image and add it to PDF
    //             const croppedCanvas = document.createElement("canvas");
    //             croppedCanvas.width = imgWidth;
    //             croppedCanvas.height = sliceHeight / scaleFactor;

    //             const ctx = croppedCanvas.getContext("2d");
    //             if (ctx) {
    //                 ctx.drawImage(canvas, 0, currentY / scaleFactor, imgWidth, croppedCanvas.height, 0, 0, imgWidth, croppedCanvas.height);
    //             }

    //             const croppedImgData = croppedCanvas.toDataURL("image/jpeg", 1.0);
    //             pdf.addImage(croppedImgData, "JPEG", 0, yPosition, pdfWidth, sliceHeight);

    //             // Add footer
    //             pdf.addImage(pdfFooter, "PNG", 0, pdfHeight - footerHeight, pdfWidth, footerHeight);

    //             // Move to next portion
    //             currentY += sliceHeight;
    //             pageIndex++;
    //         }

    //         pdf.save(`invoice-${"demo"}.pdf`);
    //         document.body.removeChild(tempDiv);
    //         setInvoiceDownload({});
    //     } catch (error) {
    //         console.error('Error generating PDF:', error);
    //         alert('Error generating PDF. Please try again.');
    //     } finally {
    //         setInvoiceDownload({});
    //     }
    // };

    const downloadPdf = async (invoiceRef: any): Promise<void> => {
        setInvoiceDownload({ id: invoice?.id, loading: true })
        if (!invoiceRef.current) return;
        try {
            // Step 1: Process main invoice content
            // Clone invoice for A4 export
            const clone = invoiceRef.current.cloneNode(true) as HTMLElement;

            // Remove all <img> elements with class "remove"
            clone.querySelectorAll('.remove').forEach(img => img.remove());

            // Remove horizontal padding from elements with class "pd"
            clone.querySelectorAll('.pd').forEach((element) => {
                (element as HTMLElement).style.paddingLeft = '0px';
                (element as HTMLElement).style.paddingRight = '0px';
            });

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
            clone.style.paddingTop = '0px';
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

            const loadImageDimensions = (imageSrc: string): Promise<{ width: number; height: number }> => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = imageSrc;
                    img.onload = () => {
                        resolve({ width: img.naturalWidth, height: img.naturalHeight });
                    };
                });
            };

            // Header/Footer setup
            const headerImg = await loadImageDimensions(status === "QUOTED" ? pdfQuotationHeader : PdfHeader);
            const footerImg = await loadImageDimensions(pdfFooter);

            const headerScale = pdfWidth / headerImg.width;
            const footerScale = pdfWidth / footerImg.width;

            const headerHeight = (headerImg.height * headerScale);
            const footerHeight = footerImg.height * footerScale;

            let yPosition = headerHeight;
            const contentHeight = pdfHeight - headerHeight - footerHeight;

            // Step 3: Render main invoice content (possibly multi-page)
            let currentY = 0;
            let pageIndex = 0;

            while (currentY < scaledImgHeight) {
                if (pageIndex > 0) {
                    pdf.addPage();
                }

                // Add header
                pdf.addImage(status === "QUOTED" ? pdfQuotationHeader : PdfHeader, "PNG", 0, 0, pdfWidth, headerHeight);

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
                pdf.addImage(croppedImgData, "JPEG", 0, yPosition, pdfWidth, sliceHeight);

                // Add footer
                pdf.addImage(pdfFooter, "PNG", 0, pdfHeight - footerHeight, pdfWidth, footerHeight);

                // Move to next portion
                currentY += sliceHeight;
                pageIndex++;
            }

            // Step 4: Add Terms & Conditions on a separate page
            // Create a separate element just for InvoiceTerms
            const termsContainer = document.createElement('div');
            termsContainer.id = 'InvoiceTerms';
            termsContainer.style.position = 'absolute';
            termsContainer.style.left = '-9999px';
            termsContainer.style.top = '-9999px';
            termsContainer.style.width = '794px';
            termsContainer.style.padding = '40px';
            termsContainer.style.boxSizing = 'border-box';
            termsContainer.style.backgroundColor = '#ffffff';
            document.body.appendChild(termsContainer);

            // Create a separate React root for the terms component
            // Use direct DOM API approach instead of trying to use ReactDOM.render

            // First, check which version of React is being used
            if (typeof ReactDOM.createRoot === 'function') {
                // React 18+ approach
                const root = ReactDOM.createRoot(termsContainer);
                root.render(<ChakraProvider value={system}><InvoiceTerms /></ChakraProvider>);
            }

            // Wait for rendering to complete
            await new Promise(resolve => setTimeout(resolve, 600));

            // Generate canvas for terms page
            const termsCanvas = await html2canvas(termsContainer, {
                scale: 600 / 96,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            // Add a new page for terms
            pdf.addPage();

            // Add header to terms page
            pdf.addImage(status === "QUOTED" ? pdfQuotationHeader : PdfHeader, "PNG", 0, 0, pdfWidth, headerHeight);

            // Scale terms canvas to fit PDF
            const termsWidth = termsCanvas.width;
            const termsScaleFactor = pdfWidth / termsWidth;
            const scaledTermsHeight = Math.min(termsCanvas.height * termsScaleFactor, contentHeight);

            // Add terms to PDF
            pdf.addImage(termsCanvas, "JPEG", 0, yPosition, pdfWidth, scaledTermsHeight);

            // Add footer to terms page
            pdf.addImage(pdfFooter, "PNG", 0, pdfHeight - footerHeight, pdfWidth, footerHeight);

            // Save the PDF
            pdf.save(`${status === "QUOTED" ? "Quotation" : "Invoice"}-${details?.id}.pdf`);

            // Clean up
            document.body.removeChild(tempDiv);
            document.body.removeChild(termsContainer);

            setInvoiceDownload({});
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setInvoiceDownload({});
        }
    };


    return (
        <Flex flexDir={"column"} alignItems={"center"} flexGrow={1}>
            <Box justifyContent={"center"} alignItems={"center"} overflow={"hidden"} >
                <Flex
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    ref={invoiceRef}
                    width="794px"
                    height="1123px"
                    transform="scale(0)"
                    transformOrigin="top left"
                    position="absolute"  // Ensure it's positioned correctly inside the parent
                >
                    <ChakraImage className='remove' src={status === "QUOTED" ? pdfQuotationHeader : PdfHeader} />
                    <Flex className='pd' p={"20px"} pb={0} justifyContent={"space-between"} >
                        <Flex flexDirection={"column"} gap={1} w={"45%"} >
                            <Text fontWeight={"600"} color={"blackAlpha.700"} fontSize={13} >Invoice #: {invoice?.code}</Text>
                        </Flex>
                        <Flex flexDirection={"column"} gap={0} w={"45%"} >
                            <Text fontWeight={"600"} color={"blackAlpha.700"} fontSize={13} >Invoice Date: {convertDatePrimaryStyle(invoice?.createdAt)}</Text>
                            <Text fontWeight={"600"} color={"blackAlpha.700"} fontSize={13} >Effective Date: {convertDatePrimaryStyle(invoice?.effectiveDate)}</Text>
                            <Text fontWeight={"600"} color={"blackAlpha.700"} fontSize={13} >Due Date: {convertDatePrimaryStyle(invoice?.dueDate)}</Text>
                        </Flex>
                    </Flex>
                    <Flex className='pd' p={"20px"} pt={"10px"} justifyContent={"space-between"} >
                        <Flex flexDir={"column"} w={"45%"} >
                            <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={15} >Bill To:</Text>
                            <Flex flexDir={"column"} gap={0}>
                                {
                                    user?.userType === "USER_ADMIN" ?
                                        <Text fontWeight={"bold"} color={"blackAlpha.800"} fontSize={13} >{user?.company?.name}</Text> :
                                        <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >{user?.name}</Text>
                                }
                                {
                                    user?.userType === "USER_ADMIN" &&
                                    <Box>
                                        {user?.company?.address && <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >{user?.company?.address}</Text>}
                                        {user?.company?.GSTIN && <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >GSTIN No : {user?.company?.GSTIN}</Text>}
                                        {user?.company?.PAN && <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >PAN No : {user?.company?.PAN}</Text>}
                                        <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Contact Person : {user?.name}</Text>
                                        <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Mobile : {user?.phone}</Text>
                                    </Box>
                                }
                            </Flex>
                        </Flex>
                        <Flex flexDir={"column"} w={"45%"}>
                            <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={15} >Bill From:</Text>
                            <Flex flexDir={"column"} gap={0} >
                                <Text fontWeight={"bold"} color={"blackAlpha.800"} fontSize={13} >{company?.name}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >{company?.address}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >GSTIN No : {company?.GSTIN}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex gap={5} flexGrow={1} className='pd' p={"20px"} flexDir={"column"}>
                        <Flex w={"100%"} justifyContent={"space-between"} justifyItems={"center"} gap={2}>
                            <Text w={200} fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >Description</Text>
                            <Text w={180} fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >HSN/SAC CODE</Text>
                            <Text w={150} fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >Rate</Text>
                            <Text w={120} fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >QTY</Text>
                            <Text textAlign={"end"} w={150} fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >Amount</Text>

                        </Flex>
                        <Separator />

                        <Flex w={"100%"} justifyContent={"space-between"} justifyItems={"center"} gap={"10px"} >
                            <Text w={200} fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >{invoice?.description}</Text>
                            <Text w={180} fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >{invoice?.SAC || "-"}</Text>
                            <Text w={150} fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >₹{invoice?.perQuantityAmount || 0.00}</Text>
                            <Text w={120} fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >{invoice?.quantity || 1}</Text>
                            <Text textAlign={"end"} w={150} fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >₹{(invoice?.totalAmount || 0.00).toFixed(2)}</Text>
                        </Flex>
                        <Separator />
                        <Flex w={"100%"} justifyContent={"space-between"}>
                            <Text fontWeight={"500"} color={"blackAlpha.800"} fontSize={15} >Discount </Text>
                            <Flex alignItems={"center"} color={"green"}  >
                                <Text fontWeight={"500"} fontSize={15} >-₹{invoice?.discount ? (invoice?.discount as any)?.toFixed(2) : 0.00.toFixed(2)}</Text>
                            </Flex>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"space-between"}>
                            <Text fontWeight={"500"} color={"blackAlpha.800"} fontSize={15} >Taxable value </Text>
                            <Flex alignItems={"center"} color={"support"}  >
                                <Text fontWeight={"500"} fontSize={15} >₹{(invoice?.taxableAmount || 0.00).toFixed(2)}</Text>
                            </Flex>
                        </Flex>
                        <Flex w={"100%"} justifyContent={"space-between"}>
                            <Text fontWeight={"500"} color={"blackAlpha.800"} fontSize={15} >GST({invoice.sgst}%)</Text>
                            <Flex alignItems={"center"} >
                                <Text fontWeight={"500"} color={"blackAlpha.800"} fontSize={15} >₹{invoice?.taxAmount ? (invoice?.taxAmount as any)?.toFixed(2) : 0.00.toFixed(2)}</Text>
                            </Flex>
                        </Flex>
                        <Separator />
                        <Flex flexDir={"column"} gap={3}>
                            <Flex w={"100%"} justifyContent={"space-between"} color={"secondary"}>
                                <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={"md"} >Total Amount</Text>
                                <Flex alignItems={"center"} >
                                    <Text fontWeight={"600"} fontSize={"xmdl"} >₹{invoice?.finalAmount ? (invoice?.finalAmount as any)?.toFixed(2) : 0.00.toFixed(2)}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Separator />
                    </Flex>
                    <Flex flexDir={"column"} justifyContent={"center"} alignSelf={"end"} mt={10} p={5} >
                        <ChakraImage alignSelf={"center"} w={92} src={Signature} />
                        <Separator />
                        <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={"small"}>Authorised Signature</Text>
                    </Flex>
                    <ChakraImage className='remove' src={pdfFooter} />
                </Flex>
            </Box >
            {
                buttonContent === "INVOICES" && <Button p={0} onClick={() => downloadPdf(invoiceRef)} h={8} bg={"support"} variant={"ghost"}>{invoiceDownload?.id === invoice?.id && invoiceDownload.loading === true ? <Spinner color={"white"} /> : Download("25", "25", "white")}</Button>
            }
            {
                buttonContent === "CONFIRMATION" && <Button w={150} onClick={() => downloadPdf(invoiceRef)} > {invoiceDownload?.id === invoice?.id && invoiceDownload.loading === true ? <Spinner /> : "Download Invoice"}</Button>
            }
        </Flex >
    );
};

export default Invoice;