import { HStack, Heading, Stack, Table, Spinner, Badge, Flex, Button, useBreakpointValue, Box, Text, Icon, Image } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../components/ui/pagination";
import { useEffect } from "react";
import { useInvoicesStore } from "../stores/invoice";
import { Tooltip } from "../components/ui/tooltip";
import Invoice from "../components/invoice";
import { convertDatePrimaryStyle, convertDateSecondaryStyle } from "../utils/date";
import useAuthStore from "../stores/auth";
import { useCompanyStore } from "../stores/company";
import CalenderIcon from "../assets/calender";
import BannerNew from "../assets/banner/new.png";
import ReNew from "../assets/banner/renew.png";
import Extend from "../assets/banner/extend.png";
import ManageInvoice from "../components/invoice/editInvoice";
import InvoiceDemo from "../components/invoice/invoiceDemo";
import { useSettingsStore } from "../stores/settings";
import { useInvoiceEditStore } from "../stores/invoiceEdit";
import { useAppSettingState } from "../stores/appSetting";
const getBadgeColor = (status: string): string => {
    switch (status) {
        case "COMPLETED":
            return "green";
        case "CANCELLED":
            return "red";
        case "PENDING":
            return "yellow";
        case "FAILED":
            return "red";
        case "QUOTED":
            return "gray";
        default:
            return "blue";
    }
};

const Invoices = () => {
    const { invoices, page, pageSize, totalPages, loading, fetchInvoices, setPage } = useInvoicesStore();
    const { role } = useAuthStore();
    const { fetchCompanyDetails } = useCompanyStore();
    const { fetchProfileDetails } = useSettingsStore();
    const { billFrom } = useInvoiceEditStore();
    const { fetchAppSetting } = useAppSettingState();
    useEffect(() => {
        fetchInvoices(page);
    }, [page]);

    useEffect(() => {
        fetchAppSetting();
        fetchProfileDetails();
        fetchCompanyDetails();
    }, [])

    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const card = (details: any, index: any) => {
        return (
            <Flex key={index} alignItems={"center"} justifyContent={"space-between"} color={"blackAlpha.700"} py={"2cqw"} px={"3cqw"}
                border={"2px solid"} borderColor={"orange.200"} borderLeft={"5px solid"} borderLeftColor={"orange.400"} borderRadius={10}>
                <Flex flexDir={"column"}>
                    <Text fontWeight={"bold"} fontSize={"3.5cqw"}>{details.booking.bookingType === "MEETING_ROOM" ? "Meeting Room" : details.booking?.service?.name}</Text>

                    <Flex alignItems={"center"} gap={"1cqw"} >
                        <Icon h={"3cqw"} w={"3cqw"} color={"blackAlpha.600"} >{CalenderIcon()}</Icon>
                        <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"} color={"blackAlpha.600"} >{convertDateSecondaryStyle(details?.createdAt)}</Text>
                    </Flex>
                </Flex>

                <Box>
                    {
                        ["COMPLETED", "QUOTED"].includes(details.booking.payment.status) ?
                            <Invoice invoiceDetails={details} buttonContent="INVOICES" status={details.booking.payment.status} />
                            : "-"
                    }
                </Box>

            </Flex>
        )
    }

    return (
        <Stack width="full" gap="5" flexGrow={1} bg={'white'} p={role !== "SUPER_ADMIN" ? 5 : 0} borderRadius={{ base: 10, md: 10 }} overflowY={"auto"} >
            {role !== "SUPER_ADMIN" && <Heading size="xl">Invoices</Heading>}
            {
                !isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : invoices.length > 0 ? (
                            <Table.ScrollArea borderWidth="1px" rounded="md"  >
                                <Table.Root size="sm" rounded={"md"} stickyHeader={true}  >
                                    <Table.Header >
                                        <Table.Row bg={"gray.100"}>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Service</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Qty</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Sub Total</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Discount</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>CGST</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>SGST</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Final Amount</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"} >Payment Satus</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"} >Created At</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"} >Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {invoices.map((item, index) => (
                                            <Table.Row key={index} h={14} >
                                                <Table.Cell py={3} px={2} textAlign={"center"} w={5} position={"relative"}>{index + 1}&#41;</Table.Cell>
                                                <Table.Cell py={3} px={5} position={"relative"} borderLeft={"2px solid"} borderColor={"gray.100"} >
                                                    {item?.booking?.bookingType === "NEW_SUBSCRIPTION" && <Image w={12} src={BannerNew} position={"absolute"} top={-3} left={-4.5} rotate={"-5"} />}
                                                    {item?.booking?.bookingType === "RENEW_SUBSCRIPTION" && <Image w={12} src={ReNew} position={"absolute"} top={-3} left={-4.5} rotate={"-5"} />}
                                                    {item?.booking?.bookingType === "EXTEND_SUBSCRIPTION" && <Image w={12} src={Extend} position={"absolute"} top={-3} left={-4.5} rotate={"-5"} />}
                                                    {item?.booking?.bookingType === "MEETING_ROOM" ? "Meeting Room" : item.description}
                                                </Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} >{item.quantity}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>₹{item.totalAmount.toFixed(2)}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>₹{item.discount || "0"}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>₹{item.cgstAmount.toFixed(2)}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>₹{item.sgstAmount.toFixed(2)}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>₹{item.finalAmount.toFixed(2)}</Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} textAlign={"center"}><Badge colorPalette={getBadgeColor(item?.booking?.payment?.status)}>{item?.booking?.payment?.status}</Badge></Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} textAlign={"center"}><Badge colorPalette={"blue"}>{convertDatePrimaryStyle(item.createdAt)}</Badge></Table.Cell>
                                                <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} textAlign={"center"} >
                                                    <Flex justifyItems={"center"} >
                                                        {/* {
                                                            ["COMPLETED", "QUOTED"].includes(item.booking.payment.status) ? <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Download Invoice">
                                                                <Invoice invoiceDetails={item} buttonContent="INVOICES" status={item.booking.payment.status} />
                                                            </Tooltip> : "-"
                                                        } */}
                                                        <ManageInvoice item={item} />
                                                        <InvoiceDemo details={item} />
                                                    </Flex>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>

                        ) : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>
                        }
                        <PaginationRoot
                            alignSelf={"end"}
                            count={totalPages}
                            pageSize={pageSize}
                            defaultPage={page}
                            variant="solid"
                            onPageChange={(e) => {
                                setPage(e.page)
                            }}
                        >
                            <HStack wrap="wrap">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </HStack>
                        </PaginationRoot>
                    </Flex>
                )
            }
            {
                isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : invoices.length > 0 ? (
                            <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1} >
                                {invoices && invoices.length > 0 && invoices?.map((item: any, index: any) => {
                                    return card(item, index);
                                })}
                            </Flex>

                        ) : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>
                        }
                        <PaginationRoot
                            alignSelf={"end"}
                            count={totalPages}
                            pageSize={pageSize}
                            defaultPage={page}
                            variant="solid"
                            onPageChange={(e) => {
                                setPage(e.page)
                            }}
                        >
                            <HStack wrap="wrap">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </HStack>
                        </PaginationRoot>
                    </Flex>
                )
            }
        </Stack >
    );
};

export default Invoices;
