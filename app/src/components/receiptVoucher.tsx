import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Image as ChakraImage, Separator, Spinner, Text } from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PdfHeader from "../assets/receiptPdfHeader.png"
import pdfFooter from "../assets/pdfFooter.png"
import { convertDatePrimaryStyle } from '../utils/date';
import useServiceStore from '../stores/services';
import Signature from "../assets/signature.png"
import Download from '../assets/download';
import { useCompanyStore } from '../stores/company';
import { ChakraProvider } from "@chakra-ui/react";
import * as ReactDOM from 'react-dom/client';
import { system } from '../theme';
import { useAdvanceHistory } from '../stores/advanceHistory';
import { useUserStore } from '../stores/users';
import { useSettingsStore } from '../stores/settings';


interface ReceiptProps { receiptDetails?: any, type: any }
const Receipt: React.FC<ReceiptProps> = ({ receiptDetails, type }) => {
    const { receiptDownload, setReceiptDownload, total } = useAdvanceHistory();
    const details = receiptDetails;
    const receiptId = type === "SINGLE" ? details?.id : type === "TOTAL" ? "RCPT-TOTAL" : "NOT-PROVIDED";
    const receiptCode = type === "SINGLE" ? details?.code : type === "TOTAL" ? "RCPT-TOTAL" : "NOT-PROVIDED";
    const receiptDescription = type === "SINGLE" ? details?.description : type === "TOTAL" ? "Over All Security Deposit" : "NOT-PROVIDED";
    const receiptAmount = type === "SINGLE" ? (details?.amount as any)?.toFixed(2) : type === "TOTAL" ? (total as any)?.toFixed(2) : 0.00;
    const receiptCreatedAt = type === "SINGLE" ? details?.createdAt : type === "TOTAL" ? convertDatePrimaryStyle(new Date().toISOString()) : "NOT-PROVIDED";
    const receiptRef = useRef<HTMLDivElement>(null);
    const { company } = useCompanyStore();
    const { profileDetails } = useSettingsStore();
    const user = profileDetails;
    const accountDetails = company?.account || {};

    const downloadPdf = async (receiptRef: any): Promise<void> => {
        setReceiptDownload({ id: receiptId, loading: true })
        if (!receiptRef.current) return;
        try {
            // Step 1: Process main receipt content
            // Clone receipt for A4 export
            const clone = receiptRef.current.cloneNode(true) as HTMLElement;

            // Remove all <img> elements with class "remove"
            clone.querySelectorAll('.remove').forEach(img => img.remove());

            // Remove horizontal padding from elements with class "pd"
            clone.querySelectorAll('.pd').forEach((element) => {
                (element as HTMLElement).style.paddingLeft = '0px';
                (element as HTMLElement).style.paddingRight = '0px';
            });

            // Create a temporary div for the receipt content
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

            // Generate canvas for main receipt
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
            const headerImg = await loadImageDimensions(PdfHeader);
            const footerImg = await loadImageDimensions(pdfFooter);

            const headerScale = pdfWidth / headerImg.width;
            const footerScale = pdfWidth / footerImg.width;

            const headerHeight = (headerImg.height * headerScale);
            const footerHeight = footerImg.height * footerScale;

            let yPosition = headerHeight;
            const contentHeight = pdfHeight - headerHeight - footerHeight;

            // Step 3: Render main receipt content (possibly multi-page)
            let currentY = 0;
            let pageIndex = 0;

            while (currentY < scaledImgHeight) {
                if (pageIndex > 0) {
                    pdf.addPage();
                }

                // Add header
                pdf.addImage(PdfHeader, "PNG", 0, 0, pdfWidth, headerHeight);

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

            // // Step 4: Add Terms & Conditions on a separate page
            // // Create a separate element just for InvoiceTerms
            // const termsContainer = document.createElement('div');
            // termsContainer.id = 'InvoiceTerms';
            // termsContainer.style.position = 'absolute';
            // termsContainer.style.left = '-9999px';
            // termsContainer.style.top = '-9999px';
            // termsContainer.style.width = '794px';
            // termsContainer.style.padding = '40px';
            // termsContainer.style.boxSizing = 'border-box';
            // termsContainer.style.backgroundColor = '#ffffff';
            // document.body.appendChild(termsContainer);

            // // Create a separate React root for the terms component
            // // Use direct DOM API approach instead of trying to use ReactDOM.render

            // // First, check which version of React is being used
            // if (typeof ReactDOM.createRoot === 'function') {
            //     // React 18+ approach
            //     const root = ReactDOM.createRoot(termsContainer);
            //     root.render(<ChakraProvider value={system}><InvoiceTerms /></ChakraProvider>);
            // }

            // // Wait for rendering to complete
            // await new Promise(resolve => setTimeout(resolve, 600));

            // // Generate canvas for terms page
            // const termsCanvas = await html2canvas(termsContainer, {
            //     scale: 600 / 96,
            //     useCORS: true,
            //     logging: false,
            //     allowTaint: true,
            //     backgroundColor: '#ffffff'
            // });

            // Add a new page for terms
            // pdf.addPage();

            // Add header to terms page
            pdf.addImage(PdfHeader, "PNG", 0, 0, pdfWidth, headerHeight);

            // // Scale terms canvas to fit PDF
            // const termsWidth = termsCanvas.width;
            // const termsScaleFactor = pdfWidth / termsWidth;
            // const scaledTermsHeight = Math.min(termsCanvas.height * termsScaleFactor, contentHeight);

            // // Add terms to PDF
            // pdf.addImage(termsCanvas, "JPEG", 0, yPosition, pdfWidth, scaledTermsHeight);

            // Add footer to terms page
            pdf.addImage(pdfFooter, "PNG", 0, pdfHeight - footerHeight, pdfWidth, footerHeight);

            // Save the PDF
            pdf.save(`receipt-${receiptId}.pdf`);

            // Clean up
            document.body.removeChild(tempDiv);
            // document.body.removeChild(termsContainer);

            setReceiptDownload({});
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setReceiptDownload({});
        }
    };


    return (
        <Flex flexDir={"column"} alignItems={"center"} flexGrow={1}>
            <Box justifyContent={"center"} alignItems={"center"} overflow={"hidden"} >
                <Flex
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    ref={receiptRef}
                    width="794px"
                    height="1123px"
                    transform="scale(0)"
                    transformOrigin="top left"
                    position="absolute"  // Ensure it's positioned correctly inside the parent
                >
                    <ChakraImage className='remove' src={PdfHeader} />
                    <Flex className='pd' p={"20px"} pb={0} justifyContent={"space-between"} >
                        <Flex flexDirection={"column"} gap={1} w={"45%"} >
                            <Text fontWeight={"600"} color={"blackAlpha.700"} fontSize={13} >Receipt #: {receiptCode}</Text>
                        </Flex>
                        <Flex flexDirection={"column"} gap={0} w={"45%"} >
                            <Text fontWeight={"600"} color={"blackAlpha.700"} fontSize={13} >Receipt Date: {receiptCreatedAt}</Text>
                        </Flex>
                    </Flex>
                    <Flex className='pd' p={"20px"} pt={"10px"} justifyContent={"space-between"} >
                        <Flex flexDir={"column"} w={"45%"} >
                            <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={15} >Recevied From:</Text>
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
                            <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={15} >Recevied To:</Text>
                            <Flex flexDir={"column"} gap={0} >
                                <Text fontWeight={"bold"} color={"blackAlpha.800"} fontSize={13} >{company?.name}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >{company?.address}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >GSTIN No : {company?.GSTIN}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex gap={5} flexGrow={1} className='pd' p={"20px"} flexDir={"column"}>
                        <Flex w={"100%"} justifyContent={"space-between"} justifyItems={"center"} gap={2}>
                            <Text fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >Description</Text>
                            <Text textAlign={"end"} w={150} fontWeight={"700"} color={"blackAlpha.800"} fontSize={16} >Amount</Text>

                        </Flex>
                        <Separator />

                        <Flex w={"100%"} justifyContent={"space-between"} justifyItems={"center"} gap={"10px"} >
                            <Text fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >{receiptDescription}</Text>
                            <Text textAlign={"end"} w={150} fontWeight={"500"} color={"blackAlpha.800"} fontSize={16} >₹{receiptAmount}</Text>
                        </Flex>
                        <Separator />
                        <Flex flexDir={"column"} gap={3}>
                            <Flex w={"100%"} justifyContent={"space-between"} color={"secondary"}>
                                <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={"md"} >Total Recevied</Text>
                                <Flex alignItems={"center"} >
                                    <Text fontWeight={"600"} fontSize={"xmdl"} >₹{receiptAmount}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex mt={250} justifyContent={"space-between"}>
                        <Flex flexDir={"column"}>
                            <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={15} >Account Details:</Text>
                            <Flex mt={2} flexDir={"column"} gap={0} >
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Account Holder : {accountDetails?.accountHolder}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Account Number : {accountDetails?.accountNumber}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >IFSC : {accountDetails?.IFSC}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Branch : {accountDetails?.Branch}</Text>
                                <Text fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Account Type : {accountDetails?.accountType}</Text>
                                <Text mt={30} fontWeight={"500"} color={"blackAlpha.700"} fontSize={13} >Virtual Payment Address : {accountDetails?.virtualPaymentAddress}</Text>

                            </Flex>
                        </Flex>
                        <Flex flexDir={"column"} justifyContent={"end"} alignSelf={"end"} mt={10} p={5} >
                            <ChakraImage alignSelf={"center"} w={92} src={Signature} />
                            <Separator />
                            <Text fontWeight={"600"} color={"blackAlpha.800"} fontSize={"small"}>Authorised Signature</Text>
                        </Flex>
                    </Flex>
                    <ChakraImage className='remove' src={pdfFooter} />
                </Flex>
            </Box >
            <Button p={0} onClick={() => downloadPdf(receiptRef)} h={type === "TOTAL" ? 7 : 8}
                minW={type === "TOTAL" ? 7 : 8} bg={"support"} variant={"ghost"} borderRadius={type === "TOTAL" ? "50%" : "auto"}>

                {receiptDownload?.id === receiptId && receiptDownload.loading === true ?
                    <Spinner color={"white"} />
                    : type === "TOTAL" ? Download("25", "20", "white") : Download("25", "25", "white")
                }</Button>
        </Flex >
    );
};

export default Receipt;