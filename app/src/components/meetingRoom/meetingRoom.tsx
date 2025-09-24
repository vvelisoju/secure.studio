import { Flex, Breadcrumb, Text, Span, Table, Spinner, Heading } from "@chakra-ui/react"
import useAuthStore from "../../stores/auth";
import { NavLink } from "react-router-dom";
import { useSubscriptionsStore } from "../../stores/subscription";
import NewMeetingRoomBooking from "./newMeetingBooking";
import { useTimeSlotStore } from "../../stores/timeSlots";
import { useEffect, useState } from "react";
import { convertDateSecondaryStyle } from "../../utils/date";
import { useUserStore } from "../../stores/users";
import { useAppSettingState } from "../../stores/appSetting";

const MeetingRoom = () => {
    const { role } = useAuthStore();
    const { fetchUser } = useUserStore();
    const { bookedSlotsOfUser, fetchBookedSlotsOfUser } = useTimeSlotStore();
    const { fetchAppSetting } = useAppSettingState();
    const home = location.pathname === '/';
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        fetchAppSetting();
        fetchBookedSlotsOfUser();
        setLoading(false);
    }, []);

    if (["USER", "USER_ADMIN"].includes(role) && !home)
        return (
            <Flex containerType={"inline-size"} flexDir={"column"} fontSize={18} gap={5} flexGrow={1} overflowY={"auto"} bg={home ? "transparent" : "white"} borderRadius={10} p={5}  >
                <Flex justifyContent={"space-between"} alignItems={"center"} >
                    <Heading size="xl">Meeting Room</Heading>
                    <NewMeetingRoomBooking />
                </Flex>
                <Flex gap={5} flexGrow={1} overflowY={"auto"}>
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : bookedSlotsOfUser.length > 0 ? (
                            <Table.ScrollArea borderWidth="1px" rounded="md" >
                                <Table.Root size="sm" rounded={"md"} stickyHeader={true} >
                                    <Table.Header >
                                        <Table.Row bg={"gray.100"}>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>startTime</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Endtime</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {bookedSlotsOfUser.map((item, index) => (
                                            <Table.Row key={index} h={14} >
                                                <Table.Cell py={3} px={2} textAlign={"center"} w={5}  >{index + 1}&#41;</Table.Cell>
                                                <Table.Cell py={3} px={5}>{convertDateSecondaryStyle(item?.startTime)}</Table.Cell>
                                                <Table.Cell py={3} px={5}>{convertDateSecondaryStyle(item?.endTime)}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>

                        ) : <Flex color={"blackAlpha.800"} fontSize={"md"} fontWeight={"bold"} justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Slots Booked yet</Flex>
                        }
                    </Flex>
                </Flex>
            </Flex>
        )
}

export default MeetingRoom;