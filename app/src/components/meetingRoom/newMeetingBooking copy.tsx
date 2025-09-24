import { Box, Button, CloseButton, Drawer, Portal, Text, Flex, CheckboxCard, Center } from "@chakra-ui/react"
import BackwardIcon from "../../assets/arrowBackward";
import ForwordIcon from "../../assets/arrowForward";
import { convertDatePrimaryStyle, convertTimeSlots } from "../../utils/date";
import { useState } from "react";
import SunFilled from "../../assets/sunFilled";
import MorningSun from "../../assets/morningSun";
import Moon from "../../assets/moon";
import { io, Socket } from "socket.io-client";
import { useSubscriptionsStore } from "../../stores/subscription";
import useAuthStore from "../../stores/auth";
import { useTimeSlotStore } from "../../stores/timeSlots";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_BASE_URL;

const NewMeetingRoomBooking = () => {

    const { fetchBookedSlotsOfUser } = useTimeSlotStore();
    const { user } = useAuthStore();
    const [floatingSlots, setFloatingSlots] = useState<string[]>([]); // Initialize with Sunday selected
    const [floatingSlotsObj, setFloatingSlotsObj] = useState<any[]>([]);
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(new Date().toDateString());
    const [disableBackward, setDisableBackward] = useState(true);
    const [slots, setSlots] = useState<{
        morning: { value: string; title: string; isBooked: boolean }[];
        afternoon: { value: string; title: string; isBooked: boolean }[];
        evening: { value: string; title: string; isBooked: boolean }[];
    }>()
    const today = new Date().toISOString();

    const handleForwardClick = () => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        setDate(nextDate.toDateString());
        if (today < nextDate.toISOString()) {
            setDisableBackward(false);
        }
        if (socket) {
            socket.emit("cleanUpSlots", floatingSlotsObj);
            const today = new Date(nextDate.toDateString());
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
            const startOfDayISO = startOfDay.toISOString();
            const endOfDayISO = endOfDay.toISOString();
            socket.emit("getSlots", {
                startTime: startOfDayISO,
                endTime: endOfDayISO
            });
            setFloatingSlotsObj([]);
            setFloatingSlots([]);
        }
    };

    const handleBackwardClick = () => {
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        setDate(prevDate.toDateString());
        if (today > prevDate.toISOString()) {
            setDisableBackward(true);
        }
        if (socket) {
            socket.emit("cleanUpSlots", floatingSlotsObj);
            const today = new Date(prevDate.toDateString());
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
            const startOfDayISO = startOfDay.toISOString();
            const endOfDayISO = endOfDay.toISOString();
            socket.emit("getSlots", {
                startTime: startOfDayISO,
                endTime: endOfDayISO
            });
            setFloatingSlotsObj([]);
            setFloatingSlots([]);
        }
    };

    const [socket, setSocket] = useState<Socket | null>(null);

    const openSocketConnection = async () => {
        // Establish the socket connection
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            const today = new Date(date);
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
            const startOfDayISO = startOfDay.toISOString();
            const endOfDayISO = endOfDay.toISOString();
            newSocket.emit("getSlots", {
                startTime: startOfDayISO,
                endTime: endOfDayISO
            });
        });

        newSocket.on("slots", (slots: any) => {
            const timeSlots = convertTimeSlots(slots);
            setSlots(timeSlots)
        });
    }

    const onSelectSlot = (slotId: string) => {
        const today = new Date(date);
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const startOfDayISO = startOfDay.toISOString();
        const endOfDayISO = endOfDay.toISOString();
        if (socket) {
            const data = {
                startTime: startOfDayISO,
                endTime: endOfDayISO,
                slotDetails: {
                    id: slotId,
                    isBooked: true,
                    userId: user?.id,
                }
            }
            socket.emit("selectSlot", data);
            setFloatingSlotsObj([...floatingSlotsObj, { ...data, slotDetails: { id: data?.slotDetails?.id, isBooked: false } }]);
        }
    }

    const onDeSelectSlot = async (slotId: string) => {
        const today = new Date(date);
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const startOfDayISO = startOfDay.toISOString();
        const endOfDayISO = endOfDay.toISOString();
        if (socket) {
            socket.emit("selectSlot", {
                startTime: startOfDayISO,
                endTime: endOfDayISO,
                slotDetails: {
                    id: slotId,
                    isBooked: false,
                    userId: null,
                }
            });
        }
    }

    const cleanupEmit = async () => {
        if (socket) {
            socket.emit("cleanUpSlots", floatingSlotsObj);
        }
    }

    const closeSocketConnection = async () => {
        if (socket) {
            socket.disconnect();
            setFloatingSlotsObj([]);
            setFloatingSlots([]);
            setSocket(null); // Clear the socket from state
        }
    }

    const slot = (item: any) => {
        return <CheckboxCard.Root maxW={"-webkit-fit-content"} minW={100}
            onCheckedChange={(e) => {
                if (e.checked) {
                    onSelectSlot(item?.value);
                    const newSet = new Set([...floatingSlots, item?.value]);
                    setFloatingSlots([...newSet]);
                } else {
                    onDeSelectSlot(item?.value);
                    setFloatingSlots(floatingSlots.filter((slot) => slot !== item?.value));
                }
            }}
            borderWidth={2}
            cursor={item?.isBooked ? "not-allowed" : "pointer"}
            pointerEvents={item?.isBooked && !floatingSlots.includes(item?.value) ? "none" : "all"}
            opacity={item?.isBooked && !floatingSlots.includes(item?.value) ? 0.5 : 1}
            variant="surface"
            colorPalette="blue"
            key={item.value}
            value={item.value}>
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control py={2}>
                <CheckboxCard.Content w={"100%"} flexDir={"row"} display={"flex"} justifyContent={"center"} >
                    <CheckboxCard.Label fontWeight={"500"}  >{item.title}</CheckboxCard.Label>
                </CheckboxCard.Content>
            </CheckboxCard.Control>
        </CheckboxCard.Root>
    }

    const onConfirmSlots = () => {
        setFloatingSlots([]);
        setFloatingSlotsObj([]);
        setOpen(false);
        fetchBookedSlotsOfUser();
    }

    window.addEventListener('beforeunload', function () {
        closeSocketConnection();
    });

    return (
        <Drawer.Root size={"md"} open={open} onOpenChange={async (e) => {
            if (e.open) {
                await openSocketConnection();
            } else {
                await cleanupEmit();
                await closeSocketConnection();
            }
            setOpen(e.open);
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
                        <Drawer.Body display={"flex"} flexDir={"column"} p={2} >
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
                                    {(slots?.morning as [])?.length > 0 ? slots?.morning.map((item) => slot(item)) : <Center userSelect={"none"} color={"gray.300"} fontSize={20} fontWeight={"bold"} w={"100%"}>No Slots Available</Center>}
                                </Flex>
                            </Flex>
                            <Flex flexDirection={"column"} borderRadius={5} p={5} gap={2}>
                                <Flex gap={2} alignItems={"center"}>
                                    <Box h={5} w={5} color={"orange.600"}>{SunFilled()}</Box>
                                    <Text userSelect={"none"} fontSize={"md"} fontWeight={"500"} color={"blackAlpha.800"}>Afternoon</Text>
                                </Flex>
                                <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                    {(slots?.afternoon as [])?.length > 0 ? slots?.afternoon.map((item) => slot(item)) : <Center userSelect={"none"} color={"gray.300"} fontSize={20} fontWeight={"bold"} w={"100%"}>No Slots Available</Center>}
                                </Flex>
                            </Flex>
                            <Flex flexDirection={"column"} borderRadius={5} p={5} gap={2}>
                                <Flex gap={2} alignItems={"center"}>
                                    <Box h={5} w={5} color={"blue.500"}>{Moon()}</Box>
                                    <Text userSelect={"none"} fontSize={"md"} fontWeight={"500"} color={"blackAlpha.800"}>Evening</Text>
                                </Flex>
                                <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                    {(slots?.evening as [])?.length > 0 ? slots?.evening.map((item) => slot(item)) : <Center userSelect={"none"} color={"gray.300"} fontSize={20} fontWeight={"bold"} w={"100%"}>No Slots Available</Center>}
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
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button onClick={onConfirmSlots} bg={"orange.600"} >Confim</Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root >
    )
}


export default NewMeetingRoomBooking;