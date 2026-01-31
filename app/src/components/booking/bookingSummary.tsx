import { useEffect, useState } from "react";
import {
    Heading, Text, Input, Button, VStack, HStack, Flex,
    Box, CloseButton, Drawer, Portal, Collapsible, Spinner, Span,
    Separator, Checkbox, Tabs
} from "@chakra-ui/react";
import RazorpayPayment from "../bookService/razerpayment";
import { getCouponDetails } from "../../api/coupon";
import WrongIcon from "../../assets/wrong";
import useServiceStore from "../../stores/services";
import MonthForm from "../bookService/monthForm"
import YearForm from "../bookService/yearForm"
import HourForm from "../bookService/hourForm"
import DayForm from "../bookService/dayForm"
import { Field } from "../ui/field";
import { payOffline } from "../../api/payment";
import useAuthStore from "../../stores/auth";
import { toaster } from "../ui/toaster";
import { useUserStore } from "../../stores/users";
import { convertDateTimeFormat, convertToUTC } from "../../utils/date";
import { useSubscriptionsStore } from "../../stores/subscription";
import { useAppSettingState } from "../../stores/appSetting";
import TickIcon from "../../assets/tick";
import ArrowForward from "../../assets/arrowForward";
import { useBookingSummaryStore } from "../../stores/bookingSummary";
import { getDaysUntilEndOfMonthLocalMidnight, getFullDaysBetween, getTotalDaysInMonth } from "../../utils/date";

let couponData: any;

const BookingSummary: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { userId, userRole, setSubscriptionTab } = useUserStore();
    const { selectedSubscription } = useSubscriptionsStore();
    const { role } = useAuthStore();
    const [open, setOpen] = useState(false);

    const { continutedDurations, selectedPlan,
        previousSubscription,
        scheduleCount, openBookingDrawer,
        invoiceDate, setInvoiceDate,
        setBookingDetails, setBookingDrawer,
        startTimeError, serviceQuantity,
        setServiceQuantity, durationDates,
        advanceByAdmin, setAdvanceByAdmin,
        discountByAdmin, setDiscountByAdmin,
        discount, setDiscount,
        extendValidity, isQuoted,
    } = useServiceStore();
    const { price, prorata, setProrata, bookingTab, setBookingTab, } = useBookingSummaryStore();
    const { fetchAppSetting, appSetting } = useAppSettingState();

    useEffect(() => { fetchAppSetting() }, []);
    
    // Prevent rendering if appSetting is not loaded
    if (!appSetting) {
        return (
            <Flex justify="center" align="center" h="200px">
                <Spinner size="lg" />
            </Flex>
        );
    }
    
    const duration = selectedPlan?.duration;
    let bookingType = "NEW_SUBSCRIPTION";

    if (extendValidity) {
        bookingType = selectedSubscription?.status === "INACTIVE" ? "RENEW_SUBSCRIPTION" : "EXTEND_SUBSCRIPTION"
    }

    let advance: number;
    switch (selectedPlan?.advanceType) {
        case "MONTHS":
            advance = price * selectedPlan?.advanceValue as number
            break;
        case "AMOUNT":
            advance = selectedPlan?.advanceValue as number
            break;
        default:
            advance = 0
            break;
    }
    const [coupon, setCoupon] = useState<string>("");
    const [advanceDiscount, setAdvanceDiscount] = useState<number>(0);



    let planPrice = 0;
    if (["INACTIVE", "ACTIVE"].includes(bookingType)) {
        planPrice = previousSubscription?.amount
    } else {
        planPrice = (selectedPlan?.price) || 0;
    }
    const discountPrice = discount || 0;
    const finalPlanPrice = planPrice - discountPrice;
    let subscriptionPrice = 0;

    if (prorata) {
        if (["INACTIVE", "ACTIVE"].includes(bookingType)) {
            const diffDays = getFullDaysBetween(durationDates.startTime, durationDates.endTime);
            const thisMonthDays = getTotalDaysInMonth(durationDates.startTime);
            const newPrice = ((finalPlanPrice / thisMonthDays) * (diffDays + 1));
            subscriptionPrice = parseFloat(newPrice.toFixed(2))
        } else {
            const diffDays = getFullDaysBetween(durationDates.startTime, durationDates.endTime);
            const thisMonthDays = getTotalDaysInMonth(durationDates.startTime);
            const newPrice = ((finalPlanPrice / thisMonthDays) * (diffDays + 1));
            subscriptionPrice = parseFloat(newPrice.toFixed(2))
        }
    } else {
        // if (["INACTIVE", "ACTIVE"].includes(bookingType)) {
        //     // const diffDays = getFullDaysBetween(durationDates.startTime, durationDates.endTime);
        //     // const thisMonthDays = getTotalDaysInMonth(durationDates.startTime);
        //     // let newPrice = ((finalPlanPrice / (thisMonthDays)) * (diffDays + 1));
        //     // if (duration === "DAY") {
        //     //     newPrice = ((finalPlanPrice) * (diffDays));
        //     // }
        //     let newPrice = (finalPlanPrice * selectedPlan?.defaultValue * serviceQuantity) || 0;
        //     subscriptionPrice = parseFloat(newPrice.toFixed(2))
        // } else {
        //     // const diffDays = getFullDaysBetween(durationDates.startTime, durationDates.endTime);
        //     // const thisMonthDays = getTotalDaysInMonth(durationDates.startTime);
        //     // let newPrice = ((finalPlanPrice / thisMonthDays) * (diffDays + 1));
        //     // console.log("new-price", finalPlanPrice, newPrice)
        //     // if (duration === "DAY") {
        //     //     newPrice = ((finalPlanPrice) * (diffDays));
        //     // }
        // }
        let newPrice = (finalPlanPrice * selectedPlan?.defaultValue * serviceQuantity) || 0;
        subscriptionPrice = parseFloat(newPrice.toFixed(2))
    }

    let taxAmount: any = parseFloat(((((subscriptionPrice * appSetting.cgst) / 100) || 0) + ((subscriptionPrice * appSetting.sgst) / 100) || 0).toFixed(2));
    const securityDeposit = advance - advanceDiscount + advanceByAdmin;
    let total = ((subscriptionPrice + taxAmount + securityDeposit || 0)).toFixed(2);

    // Handle coupon code
    const applyCoupon = async () => {
        try {
            const response = await getCouponDetails(coupon, price);
            couponData = response?.data;
            const discountFor = couponData?.discountFor;

            if (discountFor === "ADVANCE") {
                const value = couponData?.value;
                const valueType = couponData?.valueType;
                const discount = (valueType === "PERCENTAGE" ? (advance * value) / 100 : value * serviceQuantity);
                setAdvanceDiscount(discount)
            } else {
                const value = couponData?.value;
                const valueType = couponData?.valueType;
                const discount = (valueType === "PERCENTAGE" ? (price * value) / 100 : value * serviceQuantity);
                setDiscount(discount);
            }

        } catch (error: any) {
            console.log(error?.data)
        }
    };

    useEffect(() => {
        if (couponData?.discountFor) {
            const discountFor = couponData?.discountFor;
            if (discountFor === "ADVANCE") {
                const value = couponData?.value;
                const valueType = couponData?.valueType;
                const discount = (valueType === "PERCENTAGE" ? (advance * value) / 100 : value * serviceQuantity);
                setAdvanceDiscount(discount)
            } else {
                const value = couponData?.value;
                const valueType = couponData?.valueType;
                const discount = (valueType === "PERCENTAGE" ? (price * value) / 100 : value * serviceQuantity);
                setDiscount(discount);
            }
        }

    }, [serviceQuantity])

    const subscripitionType = userId ? userRole === "USER" ? "INDIVIDUAL" : "COMPANY" : userRole === "USER" ? "INDIVIDUAL" : "COMPANY";

    const handleOfflinePayment = async () => {
        setLoading(true)
        let toastId: any = toaster.create({ description: "Booking Service....", type: "loading" });
        try {
            let utcInvoiceDate;
            if (invoiceDate) {
                utcInvoiceDate = convertToUTC(invoiceDate);
            }
            const data = {
                planId: selectedPlan?.id,
                serviceQuantity,
                durationDates,
                invoiceDate: utcInvoiceDate,
                subscripitionType,
                advanceByAdmin,
                discountByAdmin,
                prorata,
                bookingType,
                baseAmount: subscriptionPrice,
                previousSubscriptionId: selectedSubscription?.id,
                bookingTab,
                isQuoted
            }
            const response = await payOffline(userId, data);
            setBookingDetails(response.data);
            toaster.update(toastId, { description: response.message || "Booked Service Successfully", type: "success" });
            setLoading(false);
            setSubscriptionTab("CONFIRMATION")
        } catch (error: any) {
            if (error.status === 500) toaster.update(toastId, { description: error.data.message || "Booking Service failed", type: "error" });
            setLoading(false);
        }
    }

    // useEffect(() => {

    //     console.log("duration-dates", durationDates);

    //     if (selectedSubscription.status === "INACTIVE") {
    //         setInvoiceDate(durationDates?.startTime)
    //     }
    // }, [durationDates?.startTime]);

    const bookingCard = () => {
        return <VStack p={5} pointerEvents={(selectedPlan?.id && !startTimeError) ? "all" : "none"} opacity={(selectedPlan?.id && !startTimeError) ? 1 : 0.8}
            border={"2px solid"} borderColor={"gray.200"}
            flexGrow={1} borderRadius={10} gap={6} align="stretch" >
            <Flex>
                <Heading size="lg" textAlign="center" color="dark" mb={4}>
                    Booking Summary
                </Heading>
            </Flex>
            <Box>
                <HStack justify="space-between" mb={2}>
                    <Text fontSize="md" color="gray.600">Plan Price:</Text>
                    <Text fontSize="md" fontWeight="bold">₹{(planPrice)?.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between" mb={2}>
                    <Text fontSize="md" color="gray.600">Discount:</Text>
                    <Text fontSize="md" fontWeight="bold" color="green.500">-₹{discount?.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between" mb={2}>
                    <Text fontSize="md" color="gray.600">Final Plan Price:</Text>
                    <Text fontSize="md" fontWeight="bold">₹{finalPlanPrice?.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between" mb={2}>
                    <Text fontSize="md" color="gray.600">Subscription Price:</Text>
                    <Text fontSize="md" fontWeight="bold">₹{subscriptionPrice?.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between" mb={2}>
                    <Text fontSize="md" color="gray.600">GST ({`${appSetting?.cgst + appSetting?.sgst}%` || "0%"}) :</Text>
                    <Text fontSize="md" fontWeight="bold">₹{taxAmount}</Text>
                </HStack>
                {!extendValidity && <HStack justify="space-between" mb={4}>
                    <Text fontSize="md" color="gray.600">Security Deposit :</Text>
                    <Text fontSize="md" fontWeight="bold">₹{securityDeposit?.toFixed(2)}</Text>
                </HStack>
                }
                <Box borderTopWidth="1px" borderColor="gray.200" pt={4}>
                    <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">Total:</Text>
                        <Text fontSize="lg" fontWeight="bold">₹{total}</Text>
                    </HStack>
                </Box>
            </Box>
            {/* <Flex display={role !== "SUPER_ADMIN" ? "flex" : "none"} gap={2} mt={4}>
                <Input disabled={discount > 0 || advanceDiscount > 0 ? true : false} pointerEvents={discount > 0 || advanceDiscount > 0 ? "none" : ""} flex={4} placeholder="Enter coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} _focus={{ borderColor: "primary" }} borderRadius="md" />
                <Button flex={1} bg={discount > 0 || advanceDiscount > 0 ? "green" : ""} disabled={discount > 0 || advanceDiscount > 0 ? true : false} pointerEvents={discount > 0 || advanceDiscount > 0 ? "none" : ""} onClick={applyCoupon} borderRadius="md" _hover={{ transform: "scale(1.05)" }} transition="all 0.2s">
                    {discount > 0 || advanceDiscount > 0 ? "Applied" : "Apply"}
                </Button>
                {discount > 0 || advanceDiscount > 0 && <Button variant={"ghost"} onClick={() => {
                    setDiscount(0)
                    setAdvanceDiscount(0)
                    setCoupon("")
                }} >
                    {WrongIcon()}
                </Button>}
            </Flex> */}
            <Flex gap={2} justifyContent={"space-between"}>
                {bookingTab === "Booking" && <RazorpayPayment totalAmount={total} coupon={discount > 0 || advanceDiscount > 0 ? coupon : null} />}
                {role === "SUPER_ADMIN" && <Button w={bookingTab === "Quotation" ? "100%" : "50%"} disabled={loading ? true : false} opacity={loading ? 0.8 : 1} onClick={() => { setBookingDrawer(false); handleOfflinePayment() }} size="lg" mt={4}>
                    {loading ? <Spinner /> : bookingTab === "Quotation" ? "Save Quote" : "Pay Offline"}
                </Button>}

            </Flex>

        </VStack>
    }


    const adminEntryCard = () => {
        return <VStack p={3} flexGrow={1} borderRadius={10} gap={6} align="stretch">
            <VStack alignItems={"start"}>
                <Flex w={"100%"} pointerEvents={continutedDurations ? "none" : "auto"} opacity={continutedDurations ? 0.5 : 1} cursor={continutedDurations ? "disabled" : "auto"}>
                    {duration === "HOUR" && <HourForm />}
                    {duration === "DAY" && <DayForm />}
                    {duration === "MONTH" && <MonthForm />}
                    {duration === "YEAR" && <YearForm />}
                </Flex>
                {duration !== "DAY" && <Checkbox.Root
                    checked={prorata}
                    onCheckedChange={(e) => setProrata(!!e.checked)}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                        {TickIcon()}
                    </Checkbox.Control>
                    <Checkbox.Label color={"blackAlpha.700"} >Pro Rata</Checkbox.Label>
                </Checkbox.Root>}

                {["SUPER_ADMIN"].includes(role) && <Field color={"blackAlpha.700"} label="Invoice DateTime" required flexGrow={1} justifyContent="center">
                    <Input width={"100%"}
                        outlineColor={"primary"}
                        _focus={{ borderColor: "primary" }}
                        type="datetime-local"
                        value={invoiceDate}
                        onChange={(e: any) => setInvoiceDate(e.target.value)}
                    />
                </Field>}

                {!continutedDurations && <Field color={"blackAlpha.700"} label="Service Quantity" required flexGrow={1} w="100%" justifyContent="center" >
                    <Input type="number" min={1} value={serviceQuantity} onChange={(e: any) => { setServiceQuantity(e.target.value) }}
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }} />
                </Field>}
                <Field color={"blackAlpha.700"} label="Discount" required flexGrow={1} w="100%" justifyContent="center" >
                    <Input type="number" min={0} value={discountByAdmin} onChange={(e: any) => {
                        if (e.target.value) {
                            setDiscountByAdmin(parseFloat(e.target.value));
                            setDiscount(parseFloat(e.target.value));
                        } else {
                            setDiscountByAdmin(0.00);
                            setDiscount(0.00);
                        }
                    }}
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }} />
                </Field>
                <Field color={"blackAlpha.700"} label="Security Deposit" required flexGrow={1} w="100%" justifyContent="center" >
                    <Input type="number" min={0} value={advanceByAdmin} onChange={(e: any) => { !e.target.value ? setAdvanceByAdmin(0.00) : setAdvanceByAdmin(parseFloat(e.target.value)) }}
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }} />
                </Field>
            </VStack>

        </VStack>
    }
    const userEntryCard = () => {
        return <VStack p={3} flexGrow={1} borderRadius={10} gap={6} align="stretch">
            <VStack alignItems={"start"}>
                <Flex w={"100%"} pointerEvents={continutedDurations ? "none" : "auto"} opacity={continutedDurations ? 0.5 : 1} cursor={continutedDurations ? "disabled" : "auto"}>
                    {duration === "HOUR" && <HourForm />}
                    {duration === "DAY" && <DayForm />}
                    {duration === "MONTH" && <MonthForm />}
                    {duration === "YEAR" && <YearForm />}
                </Flex>

                {!continutedDurations && ["USER_ADMIN", "SUPER_ADMIN"].includes(role) && <Field color={"blackAlpha.700"} label="Service Quantity" required flexGrow={1} w="100%" justifyContent="center" >
                    <Input type="number" min={1} value={serviceQuantity} onChange={(e: any) => { setServiceQuantity(e.target.value); }}
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }} />
                </Field>}
            </VStack>
        </VStack >
    }

    const ExtendOrRenewEntryCard = () => {
        const bookingDetails = selectedSubscription?.booking;
        const planDetails = bookingDetails?.plan;
        const plan = planDetails.defaultValue + " " + (planDetails.defaultValue > 1 ? planDetails.duration[0] + planDetails.duration.slice(1).toLowerCase() + "s" : planDetails.duration[0] + planDetails.duration.slice(1).toLowerCase());

        return <VStack px={10} py={5}
            border={"2px solid"} borderColor={"gray.200"}
            flexGrow={1} borderRadius={10} gap={6} align="stretch"
        >
            <VStack alignItems={"start"}>
                < Text fontWeight={"600"} fontSize={"18px"} textAlign="center" color="dark" >
                    {selectedSubscription.status === "INACTIVE" ? "Renew Details" : "Extend Details"}
                </Text>

                < Text mt={5} fontWeight={"500"} fontSize={"14px"} textAlign="center" color="blackAlpha.700" >
                    Plan : <Span fontSize={"12px"}  >{plan}</Span>
                </Text>

                {
                    !extendValidity &&
                    <>
                        {["USER_ADMIN"].includes(role) && !continutedDurations &&
                            <Field color={"blackAlpha.700"} label="Service Quantity" required flexGrow={1} w="100%" justifyContent="center" >
                                <Input type="number" min={1} value={serviceQuantity} onChange={(e: any) => {
                                    if (extendValidity && role === "USER_ADMIN") {
                                        const employeesFilled = selectedSubscription.employeesFilled;
                                        if (e.target.value < employeesFilled) {
                                            toaster.create({ description: "Please remove the filled Employees to decrease the quantity.", type: "error" });
                                        } else {
                                            setServiceQuantity(e.target.value)
                                        }
                                    } else {
                                        setServiceQuantity(e.target.value)
                                    }
                                }}
                                    outlineColor="primary"
                                    _focus={{ borderColor: "primary" }} />
                            </Field>
                        }

                        {["SUPER_ADMIN"].includes(role) && <>
                            <Field color={"blackAlpha.700"} label="Invoice DateTime" required flexGrow={1} justifyContent="center">
                                <Input width={"100%"}
                                    outlineColor={"primary"}
                                    _focus={{ borderColor: "primary" }}
                                    type="datetime-local"
                                    value={invoiceDate}
                                    onChange={(e: any) => setInvoiceDate(e.target.value)}
                                />
                            </Field>
                            <Field color={"blackAlpha.700"} label="Discount Amount" required flexGrow={1} w="100%" justifyContent="center" >
                                <Input type="number" min={0} value={discountByAdmin} onChange={(e: any) => {
                                    if (e.target.value) {
                                        setDiscountByAdmin(parseFloat(e.target.value));
                                        setDiscount(parseFloat(e.target.value));
                                    } else {
                                        setDiscountByAdmin(0.00);
                                        setDiscount(0.00);
                                    }
                                }}
                                    outlineColor="primary"
                                    _focus={{ borderColor: "primary" }} />
                            </Field>
                            <Field color={"blackAlpha.700"} label="Security Deposit Amount" required flexGrow={1} w="100%" justifyContent="center" >
                                <Input type="number" min={0} value={advanceByAdmin} onChange={(e: any) => { !e.target.value ? setAdvanceByAdmin(0.00) : setAdvanceByAdmin(parseFloat(e.target.value)) }}
                                    outlineColor="primary"
                                    _focus={{ borderColor: "primary" }} />
                            </Field>
                        </>}
                    </>
                }


            </VStack>
        </VStack>
    }


    const ExtendOrRenewEntryCardAdmin = () => {
        return <VStack p={3} flexGrow={1} borderRadius={10} gap={6} align="stretch">
            <VStack alignItems={"start"}>
                <Flex w={"100%"} pointerEvents={continutedDurations ? "none" : "auto"} opacity={continutedDurations ? 0.5 : 1} cursor={continutedDurations ? "disabled" : "auto"}>
                    {duration === "HOUR" && <HourForm />}
                    {duration === "DAY" && <DayForm />}
                    {duration === "MONTH" && <MonthForm />}
                    {duration === "YEAR" && <YearForm />}
                </Flex>
                {duration !== "DAY" && <Checkbox.Root
                    checked={prorata}
                    onCheckedChange={(e) => setProrata(!!e.checked)}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                        {TickIcon()}
                    </Checkbox.Control>
                    <Checkbox.Label color={"blackAlpha.700"} >Pro Rata</Checkbox.Label>
                </Checkbox.Root>}
                <Field color={"blackAlpha.700"} label="Discount" required flexGrow={1} w="100%" justifyContent="center" >
                    <Input type="number" min={0} value={discountByAdmin} onChange={(e: any) => {
                        if (e.target.value) {
                            setDiscountByAdmin(parseFloat(e.target.value));
                            setDiscount(parseFloat(e.target.value));
                        } else {
                            setDiscountByAdmin(0.00);
                            setDiscount(0.00);
                        }
                    }}
                        outlineColor="primary"
                        _focus={{ borderColor: "primary" }} />
                </Field>

            </VStack>
            {/* setProrata({ prorata, newDurationDates: { startTime: data.startTime } }); */}
        </VStack>
    }

    return (
        <Drawer.Root size={"sm"} open={openBookingDrawer} onOpenChange={(e) => { setBookingDrawer(e.open); }}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.CloseTrigger alignSelf={"start"} py={5} asChild>
                                <CloseButton size="xl" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        {
                            extendValidity ?
                                <Drawer.Body >
                                    {["SUPER_ADMIN"].includes(role) &&
                                        <Flex flexDir={"column"} gap={5}>
                                            {ExtendOrRenewEntryCardAdmin()}
                                            {bookingCard()}
                                        </Flex>
                                    }
                                    {["USER", "USER_ADMIN"].includes(role) &&
                                        <Flex gap={5} display={"flex"} flexDir={"column"}>
                                            {ExtendOrRenewEntryCard()}
                                            {bookingCard()}
                                        </Flex>
                                    }
                                </Drawer.Body> :
                                <Drawer.Body >
                                    {["SUPER_ADMIN"].includes(role) &&
                                        <Flex flexDir={"column"} gap={5}>
                                            {!isQuoted &&
                                                <Tabs.Root w={"100%"} value={bookingTab} onValueChange={(e) => setBookingTab(e.value)} variant={"enclosed"}>
                                                    <Tabs.List w={"100%"}>
                                                        <Tabs.Trigger flexGrow={1} value="Booking">
                                                            Booking
                                                        </Tabs.Trigger>
                                                        <Tabs.Trigger flexGrow={1} value="Quotation">
                                                            Quotation
                                                        </Tabs.Trigger>
                                                    </Tabs.List>
                                                </Tabs.Root>
                                            }
                                            <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)} borderRadius={10}
                                                border={"2px solid"} borderColor={"gray.200"} >
                                                <Collapsible.Trigger w={"100%"}  >
                                                    <Flex p={5} justifyContent={"space-between"} >
                                                        <Text fontSize={"md"} fontWeight={"bold"} >Customize Details</Text>
                                                        <Box transform={open ? "rotate(90deg)" : "rotate(0deg)"}
                                                            transition="transform 0.2s ease" h={5} w={5} color={"blackAlpha.800"} >{ArrowForward()}</Box>
                                                    </Flex>
                                                </Collapsible.Trigger>
                                                <Collapsible.Content>
                                                    <Separator />
                                                    {adminEntryCard()}
                                                </Collapsible.Content>
                                            </Collapsible.Root>
                                            {bookingCard()}
                                        </Flex>
                                    }
                                    {["USER", "USER_ADMIN"].includes(role) &&
                                        <Flex flexDir={"column"} gap={5}>
                                            <Collapsible.Root open={open} onOpenChange={(e) => setOpen(e.open)} borderRadius={10}
                                                border={"2px solid"} borderColor={"gray.200"} >
                                                <Collapsible.Trigger w={"100%"}  >
                                                    <Flex p={5} justifyContent={"space-between"} >
                                                        <Text fontSize={"md"} fontWeight={"bold"} >Customize Details</Text>
                                                        <Box transform={open ? "rotate(90deg)" : "rotate(0deg)"}
                                                            transition="transform 0.2s ease" h={5} w={5} color={"blackAlpha.800"} >{ArrowForward()}</Box>
                                                    </Flex>
                                                </Collapsible.Trigger>
                                                <Collapsible.Content>
                                                    <Separator />
                                                    {userEntryCard()}
                                                </Collapsible.Content>
                                            </Collapsible.Root>
                                            {bookingCard()}
                                        </Flex>
                                    }
                                </Drawer.Body>
                        }

                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
};

export default BookingSummary;