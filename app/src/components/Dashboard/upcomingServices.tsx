import { Flex, Text, Icon, Link } from "@chakra-ui/react"
import CalenderIcon from "../../assets/calender"
import ViewAllIcon from "../../assets/viewAll"
import { useDashboardStore } from "../../stores/dashboard"
import { convertDatePrimaryStyle } from "../../utils/date"

const UpcomingServices = () => {

    const { details } = useDashboardStore();
    const data = details?.upcomingSubscriptions;
    const card = (details: any, index: any) => {
        return (
            <Flex key={index} justifyContent={"space-between"} color={"blackAlpha.700"} py={{ base: "2cqw", md: "1cqw" }} px={{ base: "6cqw", md: "3cqw" }} border={"2px solid"} borderLeft={"5px solid"} borderColor={"purple.100"} borderLeftColor={"purple.400"} borderRadius={10}>
                <Flex flexDir={"column"} gap={{ base: "1cqw", md: "0.5cqw" }}>
                    <Flex gap={{ base: "4cqw", md: "2cqw" }}>
                        <Text fontSize={{ base: "4cqw", md: "2cqw" }} fontWeight={"600"} >{details?.service?.name}</Text>
                    </Flex>
                    <Flex gap={"1cqw"} alignItems={"center"}>
                        <Icon h={"2.5cqw"} w={"2.5cqw"} color={"blackAlpha.600"} >{CalenderIcon()}</Icon>
                        <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"} color={"blackAlpha.600"} >{convertDatePrimaryStyle(details?.startTime)} - {convertDatePrimaryStyle(details?.endTime)}</Text>
                    </Flex>
                </Flex>
            </Flex>
        )
    }

    return (
        <Flex h={"100%"} gap={"2cqw"} flexDir={"column"} p={{ base: "2cqw" }} borderRadius={10} bg={"white"} >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text color={"blackAlpha.800"} fontWeight={"600"} fontSize={{ base: "5cqw", md: "2.5cqw" }}>Upcoming</Text>
                <Link _hover={{ textDecoration: "none" }} href="/subscriptions" outlineColor={"none"} _focus={{ outlineColor: "transparent" }} >
                    <Flex cursor={"pointer"} as={"button"} color={"blackAlpha.800"} gap={"0.5cqw"} alignItems={"center"}>
                        <Icon h={"20px"} w={"20px"} color={"blackAlpha.800"} >{ViewAllIcon()}</Icon>
                        <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"}  >View All</Text>
                    </Flex>
                </Link>

            </Flex>
            <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1} >
                {data && data.length > 0 && data?.map((item: any, index: any) => {
                    return card(item, index);
                })}
                {data?.length === 0 && <Flex fontWeight={"bold"} color={"gray.300"} fontSize={{ base: "6cqw", md: "3cqw" }} flexGrow={1} alignItems={"center"} justifyContent={"center"} >No Upcoming Subscriptions</Flex>}
            </Flex>
        </Flex>
    )
}

export default UpcomingServices