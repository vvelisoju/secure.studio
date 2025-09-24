import { Box, Button, CloseButton, Drawer, Portal, Text, Flex, CheckboxCard, Center, Separator, Image } from "@chakra-ui/react"
import BackwardIcon from "../../assets/arrowBackward";
import ForwordIcon from "../../assets/arrowForward";
import { convertDatePrimaryStyle, convertTimeSlots } from "../../utils/date";
import { useEffect, useState } from "react";
import SunFilled from "../../assets/sunFilled";
import MorningSun from "../../assets/morningSun";
import Moon from "../../assets/moon";
import { useSubscriptionsStore } from "../../stores/subscription";
import useAuthStore from "../../stores/auth";
import { useTimeSlotStore } from "../../stores/timeSlots";
import { toaster } from "../ui/toaster";
import priced from "../../assets/banner/priced.png";
import { useUserStore } from "../../stores/users";
import { getMeetingRoomSetting } from "../../api/meetingRoom";
import { useMeetingRoomStore } from "../../stores/meetingRoom";
import RazorpayPayment from "./razerpay";
import { useAppSettingState } from "../../stores/appSetting";

const NewMeetingRoomBooking = () => {

    const { fetchBookedSlotsOfUser, fetchSlotsOfDates, slots, BookSlots } = useTimeSlotStore();
    const { freeMeetingRoomSlots, setFreeMeetingRoomSlots, resetFreeMeetingRoomSlots } = useUserStore();
    const [floatingSlots, setFloatingSlots] = useState<string[]>([]);
    const [freeFloatingSlots, setFreeFloatingSlots] = useState<string[]>([]);
    const [paidFloatingSlots, setPaidFloatingSlots] = useState<string[]>([]);
    const { meetingRoomOpen, setMeetingRoomOpen } = useMeetingRoomStore();
    const [date, setDate] = useState(new Date().toDateString());
    const [disableBackward, setDisableBackward] = useState(true);
    const [meetingRoomSetting, setMeetingRoomSetting] = useState({});
    const { appSetting } = useAppSettingState();
    const todayToISOString = new Date().toISOString();

    const handleForwardClick = async () => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        setDate(nextDate.toDateString());
        if (todayToISOString < nextDate.toISOString()) setDisableBackward(false);
        const today = new Date(nextDate.toDateString());
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const startOfDayISO = startOfDay.toISOString();
        const endOfDayISO = endOfDay.toISOString();
        await fetchSlotsOfDates({ startTime: startOfDayISO, endTime: endOfDayISO });
        resetFreeMeetingRoomSlots();
    };

    const handleBackwardClick = async () => {
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        setDate(prevDate.toDateString());
        if (todayToISOString > prevDate.toISOString()) setDisableBackward(true);
        const today = new Date(prevDate.toDateString());
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const startOfDayISO = startOfDay.toISOString();
        const endOfDayISO = endOfDay.toISOString();
        await fetchSlotsOfDates({ startTime: startOfDayISO, endTime: endOfDayISO });
        resetFreeMeetingRoomSlots();
    };


    const onConfirmSlots = async () => {
        let toastId: any = toaster.create({ description: "Booking.....", type: "loading" });

        try {
            const response: any = await BookSlots({ slots: floatingSlots })
            toaster.update(toastId, { description: response.message || "Slots Booked  successfully", type: "success" });
            setMeetingRoomOpen(false);
            setFloatingSlots([]);
            fetchBookedSlotsOfUser();
            getSlots();
        } catch (error: any) {
            console.log(error);
            toaster.update(toastId, { description: error?.data?.message || "Slots Booked  Failed", type: "error" });
        }

    }

    const getSlots = async () => {
        const today = new Date(date);
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const startOfDayISO = startOfDay.toISOString();
        const endOfDayISO = endOfDay.toISOString();
        await fetchSlotsOfDates({ startTime: startOfDayISO, endTime: endOfDayISO });
        resetFreeMeetingRoomSlots();
    }

    const slot = (item: any) => {
        return <CheckboxCard.Root maxW={"-webkit-fit-content"} minW={100}
            onCheckedChange={(e) => {
                if (e.checked) {
                    const newSet = new Set([...floatingSlots, item?.value]);
                    setFloatingSlots([...newSet]);
                    if (freeMeetingRoomSlots > 0) {
                        setFreeMeetingRoomSlots(freeMeetingRoomSlots - 1);
                        setFreeFloatingSlots([...freeFloatingSlots, item?.value]);
                    } else {
                        setPaidFloatingSlots([...paidFloatingSlots, item?.value]);
                    }
                } else {
                    setFloatingSlots(floatingSlots.filter((slot) => slot !== item?.value));
                    if (freeFloatingSlots.includes(item?.value)) {
                        if (paidFloatingSlots.length > 0) {
                            const paidSlot = paidFloatingSlots[0];
                            setPaidFloatingSlots(paidFloatingSlots.filter((slot) => slot !== paidSlot));
                            setFreeFloatingSlots([
                                ...freeFloatingSlots.filter((slot) => slot !== item?.value),
                                paidSlot
                            ]);
                        } else {
                            setFreeFloatingSlots(freeFloatingSlots.filter((slot) => slot !== item?.value));
                            setFreeMeetingRoomSlots(freeMeetingRoomSlots + 1);
                        }
                    } else {
                        setPaidFloatingSlots(paidFloatingSlots.filter((slot) => slot !== item?.value));
                    }
                }
            }}
            borderWidth={2}
            _hover={{ cursor: item?.isBooked ? "not-allowed" : "pointer" }}
            pointerEvents={item?.isBooked && !floatingSlots.includes(item?.value) ? "none" : "all"
            }
            opacity={item?.isBooked && !floatingSlots.includes(item?.value) ? 0.5 : 1}
            variant="surface"
            colorPalette="blue"
            key={item.value}
            value={item.value} >
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control py={2}>
                <CheckboxCard.Content w={"100%"} flexDir={"row"} display={"flex"} justifyContent={"center"} position={"relative"} >
                    {paidFloatingSlots.includes(item.value) && <Image w={7} right={-6} top={-5} src={priced} position={"absolute"} />}
                    <CheckboxCard.Label fontWeight={"500"}  >{item.title}</CheckboxCard.Label>
                </CheckboxCard.Content>
            </CheckboxCard.Control>
        </CheckboxCard.Root >
    }


    const bookingSummary = () => {
        return (
            <Flex flexDir={"column"} px={5} gap={5}>
                <Flex w={"100%"} gap={3} flexDir={"column"} >
                    {/* <Text fontSize={"md"} fontWeight={"600"} color={"blackAlpha.800"}>Booking Summary</Text> */}
                    <Flex flexDir={"column"} gap={1}>
                        <Flex w={"100%"} gap={5} justifyContent={"space-between"} >
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>Selected</Text>
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>{floatingSlots.length} {floatingSlots.length > 1 ? "slots" : "slot"}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} justifyContent={"space-between"} >
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>Free</Text>
                            <Text fontSize={"sm"} fontWeight={"500"} color={"green.600"}>{freeFloatingSlots.length}  {freeFloatingSlots.length > 1 ? "slots" : "slot"}</Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} justifyContent={"space-between"} >
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>Paid</Text>
                            <Text fontSize={"sm"} fontWeight={"500"} color={"red.500"}>{paidFloatingSlots.length} {paidFloatingSlots.length > 1 ? "slots" : "slot"} </Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} justifyContent={"space-between"} >
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>Taxable Amount</Text>
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>₹{((meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length).toFixed(2)} </Text>
                        </Flex>
                        <Flex w={"100%"} gap={5} justifyContent={"space-between"} >
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>Tax({appSetting.cgst + appSetting.sgst}%)</Text>
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>₹{(((((meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length) * appSetting.gst) / 100) + ((((meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length) * appSetting.gst) / 100)).toFixed(2)}  </Text>
                        </Flex>
                        <Separator />
                        <Flex w={"100%"} gap={5} justifyContent={"space-between"} >
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>Total Price</Text>
                            <Text fontSize={"sm"} fontWeight={"500"} color={"blackAlpha.800"}>₹{(((meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length) + ((((meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length) * appSetting.cgst) / 100) + ((((meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length) * appSetting.sgst) / 100)).toFixed(2)} </Text>
                        </Flex>
                    </Flex>
                </Flex>
                {
                    paidFloatingSlots.length === 0 ?
                        <Button w={"100%"} onClick={onConfirmSlots} bg={"orange.600"} >Confirm</Button> :
                        <Button w={"100%"} bg={"orange.600"} >Confirm</Button>
                    // <RazorpayPayment slots={floatingSlots} totalAmount={(meetingRoomSetting as any).pricePerSlot * paidFloatingSlots.length} />
                }
            </Flex>
        )
    }

    useEffect(() => {
        const fetchMeetingRoomSetting = async () => {
            const response = await getMeetingRoomSetting();
            setMeetingRoomSetting(response.data);
        };
        fetchMeetingRoomSetting();
    }, []);


    return (
        <Drawer.Root size={"md"} open={meetingRoomOpen} onOpenChange={async (e) => {
            if (e.open) {
                getSlots();
            } else {
                setPaidFloatingSlots([]);
                setFreeFloatingSlots([]);
                setFloatingSlots([]);
            }
            setMeetingRoomOpen(e.open);
        }}>
            <Drawer.Trigger asChild>
                <Button variant="solid" size="sm">
                    Book Meeting
                </Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content >
                        <Drawer.Header bgGradient={"to-r"} gradientFrom={"blue.600"} gradientTo={"blue.400"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}  >
                            <Box userSelect={"none"}>
                                <Drawer.Title color={"whiteAlpha.900"}>Book Meeting Room</Drawer.Title>
                                <Text fontSize={"small"} fontWeight={"500"} color={"whiteAlpha.700"} >Select your preferred time slots for your meeting</Text>
                            </Box>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="xl" color={"whiteAlpha.900"} _hover={{ bg: "none" }} />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body display={"flex"} flexDir={"column"} p={2} justifyContent={"space-between"} gap={10} >
                            <Flex flexDir={"column"}>
                                <Text fontSize={"small"} textAlign={"center"} fontWeight={"500"} color={"blackAlpha.700"} >Free Slots Left : {freeMeetingRoomSlots}</Text>

                                <Flex alignItems={"center"} justifyContent={"space-between"} borderRadius={5} p={5}>
                                    <Box pointerEvents={disableBackward ? "none" : "all"} opacity={disableBackward ? 0.5 : 1}
                                        onClick={handleBackwardClick} cursor={"pointer"} h={6} w={6} color={"blackAlpha.800"} >{BackwardIcon()}</Box>
                                    <Text userSelect={"none"} color={"blackAlpha.800"} fontSize={"lg"} fontWeight={"600"} >{convertDatePrimaryStyle(date)}</Text>
                                    <Box onClick={handleForwardClick} cursor={"pointer"} h={6} w={6} color={"blackAlpha.800"}>{ForwordIcon()}</Box>
                                </Flex>
                                <Flex flexDirection={"column"} borderRadius={5} p={5} gap={2}>
                                    <Flex gap={2} alignItems={"center"} >
                                        <Box h={5} w={5} color={"orange.500"}>{MorningSun()}</Box>
                                        <Text userSelect={"none"} fontSize={"md"} fontWeight={"500"} color={"blackAlpha.800"}>Morning</Text>
                                    </Flex>
                                    <Flex w={"100%"} gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {(slots?.morning as [])?.length > 0 ? slots?.morning.map((item: any) => slot(item)) : <Center userSelect={"none"} color={"gray.300"} fontSize={20} fontWeight={"bold"} w={"100%"}>No Slots Available</Center>}
                                    </Flex>
                                </Flex>
                                <Flex flexDirection={"column"} borderRadius={5} p={5} gap={2}>
                                    <Flex gap={2} alignItems={"center"}>
                                        <Box h={5} w={5} color={"orange.600"}>{SunFilled()}</Box>
                                        <Text userSelect={"none"} fontSize={"md"} fontWeight={"500"} color={"blackAlpha.800"}>Afternoon</Text>
                                    </Flex>
                                    <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {(slots?.afternoon as [])?.length > 0 ? slots?.afternoon.map((item: any) => slot(item)) : <Center userSelect={"none"} color={"gray.300"} fontSize={20} fontWeight={"bold"} w={"100%"}>No Slots Available</Center>}
                                    </Flex>
                                </Flex>
                                <Flex flexDirection={"column"} borderRadius={5} p={5} gap={2}>
                                    <Flex gap={2} alignItems={"center"}>
                                        <Box h={5} w={5} color={"blue.500"}>{Moon()}</Box>
                                        <Text userSelect={"none"} fontSize={"md"} fontWeight={"500"} color={"blackAlpha.800"}>Evening</Text>
                                    </Flex>
                                    <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {(slots?.evening as [])?.length > 0 ? slots?.evening.map((item: any) => slot(item)) : <Center userSelect={"none"} color={"gray.300"} fontSize={20} fontWeight={"bold"} w={"100%"}>No Slots Available</Center>}
                                    </Flex>
                                </Flex>
                                <Flex gap={5} px={5}>
                                    <Flex gap={2} alignItems={"center"}>
                                        <Box h={3.5} w={3.5} border={"1px solid"} borderColor={"gray.300"} borderRadius={3} ></Box>
                                        <Text userSelect={"none"} color={"blackAlpha.700"} fontWeight={"400"} fontSize={"small"} >Available</Text>
                                    </Flex>
                                    <Flex gap={2} alignItems={"center"}>
                                        <Box h={3.5} w={3.5} border={"1px solid"} bg={"blue.100"} borderColor={"blue.400"} borderRadius={3} ></Box>
                                        <Text userSelect={"none"} color={"blackAlpha.700"} fontWeight={"400"} fontSize={"small"} >Selected</Text>
                                    </Flex>
                                    <Flex gap={2} alignItems={"center"}>
                                        <Box h={3.5} w={3.5} border={"1px solid"} bg={"gray.100"} borderColor={"gray.200"} borderRadius={3} ></Box>
                                        <Text userSelect={"none"} color={"blackAlpha.700"} fontWeight={"400"} fontSize={"small"} >Booked</Text>
                                    </Flex>
                                </Flex>
                            </Flex>

                            {bookingSummary()}
                        </Drawer.Body>

                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root >
    )
}


export default NewMeetingRoomBooking;