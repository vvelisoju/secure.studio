import { Flex, Text, Icon, Tabs, Box } from "@chakra-ui/react";
import CalendarIcon from "../../assets/calender";
import { useDashboardStore } from "../../stores/dashboard";
import { convertDatePrimaryStyle } from "../../utils/date";
import EventAvailable from "../../assets/eventAvailable";
import EventUpcoming from "../../assets/eventUpcoming";
import { Tooltip } from "../ui/tooltip";

type Holiday = {
    date: string; // e.g., "2025-04-08T00:00:00Z"
    [key: string]: any; // in case holidays have other props
};

const HolidayList = () => {
    const { details } = useDashboardStore();
    const data = details?.holidays || [];

    const result = {
        past: [] as Holiday[],
        future: [] as Holiday[]
    };
    const now = new Date(); // current time
    data.forEach((holiday: any) => {
        const holidayDate = new Date(holiday.date); // assuming holiday.date is in ISO or UTC format
        if (holidayDate < now) {
            result.past.push(holiday);
        } else {
            result.future.push(holiday);
        }
    });

    const card = (holiday: any, index: any) => {
        return (
            <Flex key={index} justifyContent={"space-between"} color={"blackAlpha.700"} py={{ base: "2cqw", md: "1cqw" }} px={{ base: "6cqw", md: "3cqw" }} border={"2px solid"} borderLeft={"5px solid"} borderColor={"red.100"} borderLeftColor={"red.400"} borderRadius={10}>
                <Flex flexDir={"column"} gap={{ base: "1cqw", md: "0.5cqw" }}>
                    <Flex gap={{ base: "4cqw", md: "2cqw" }}>
                        <Text fontSize={{ base: "4cqw", md: "3.5cqw" }} fontWeight={"600"} >{holiday?.name}</Text>
                    </Flex>
                    <Flex gap={"1cqw"} alignItems={"center"}>
                        <Icon h={"2.5cqw"} w={"2.5cqw"} color={"blackAlpha.600"}>{CalendarIcon()}</Icon>
                        <Text fontSize={{ base: "3cqw", md: "3cqw" }} fontWeight={"600"} color={"blackAlpha.600"}>{convertDatePrimaryStyle(holiday?.date)}</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    return (
        <Flex overflowY={"auto"} h={"100%"} gap={"2cqw"} flexDir={"column"} p={{ base: "4cqw" }} borderRadius={10} bg={"white"} >
            <Tabs.Root defaultValue="future" variant={"enclosed"}>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text color={"blackAlpha.800"} fontWeight={"600"} fontSize={"5cqw"}>Holiday List</Text>
                    <Tabs.List alignItems={"center"} >
                        <Tabs.Trigger h={6} maxW={6} p={0} value="past">
                            <Tooltip content="Past">
                                <Box h={5} w={5}>{EventAvailable()}</Box>
                            </Tooltip>
                        </Tabs.Trigger>
                        <Tabs.Trigger h={6} maxW={6} p={0} value="future">
                            <Tooltip content="Upcoming">
                                <Box h={5} w={5}>{EventUpcoming()}</Box>
                            </Tooltip>
                        </Tabs.Trigger>
                    </Tabs.List>
                </Flex>


                <Flex flexDir={"column"} flexGrow={1}>
                    {data && data.length > 0 &&
                        <>
                            <Tabs.Content display={"flex"} flexDir={"column"} value="future" gap={"2cqw"}>
                                {result?.future?.map((holiday: any, index: any) => card(holiday, index))}
                            </Tabs.Content>
                            <Tabs.Content display={"flex"} flexDir={"column"} value="past" gap={"2cqw"}>
                                {result?.past?.map((holiday: any, index: any) => card(holiday, index))}
                            </Tabs.Content>
                        </>
                    }
                    {data?.length === 0 && <Flex fontWeight={"bold"} color={"gray.300"} fontSize={{ base: "6cqw", md: "5cqw" }} flexGrow={1} alignItems={"center"} justifyContent={"center"} >No Upcoming Holidays</Flex>}
                </Flex>
            </Tabs.Root>
        </Flex>
    );
};

export default HolidayList;
