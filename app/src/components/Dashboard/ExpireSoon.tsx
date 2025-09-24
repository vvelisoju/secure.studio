import { Flex, Text, Button, Icon } from "@chakra-ui/react"
import WarningIcon from "../../assets/warning";
import ClockIcon from "../../assets/clock";
import { useDashboardStore } from "../../stores/dashboard";
import { getExpirationColor } from "../../utils/colors";

const ExpireSoonServices = () => {

    const { details } = useDashboardStore();
    const data = details?.expiringSubscriptions;
    const card = (details: any, index: any) => {
        const daysLeft = details?.remainingDays;
        const color = getExpirationColor(daysLeft);
        return (
            <Flex key={index}  flexDir={"column"} justifyContent={"space-between"} color={"blackAlpha.700"} p={"3cqw"} bg={`${color}.50`} border={"2px solid"} borderColor={`${color}.100`} borderRadius={{ base: 5, }}>
                <Flex flexDir={"column"}>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                        <Text color={"blackAlpha.800"} fontWeight={"600"} fontSize={"3.7cqw"}>{details?.service?.name}</Text>
                        {daysLeft < 3 ? <Icon h={"5cqw"} w={"5cqw"} color={`${color}.600`} >{WarningIcon()}</Icon> : <Icon h={"5cqw"} w={"5cqw"} color={`${color}.600`} >{ClockIcon()}</Icon>}
                    </Flex>
                    <Text color={`${color}.500`} fontWeight={"600"} fontSize={"3cqw"}>Expires in {daysLeft} days</Text>
                </Flex>
                {/* <Button fontSize={"3cqw"} bg={`${color}.500`} p={"2cqw"} h={"auto"} > Renew Now</Button> */}
            </Flex>
        )
    }


    return (
        <Flex h={"100%"} gap={"4.5cqw"} flexDir={"column"} p={{ base: "4cqw" }} borderRadius={10} bg={"white"} >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text color={"blackAlpha.800"} fontWeight={"600"} fontSize={"4.5cqw"}>Expiring Soon</Text>
            </Flex>
            <Flex flexGrow={1} gap={"2cqw"} flexDir={"column"}>
                {data && data.length > 0 && data?.map((item: any, index: any) => {
                    return card(item, index);
                })}
                {data?.length === 0 && <Flex fontWeight={"bold"} color={"gray.300"} fontSize={"5cqw"} flexGrow={1} alignItems={"center"} justifyContent={"center"} >No Expiring Soon</Flex>}
            </Flex>
        </Flex>
    )
}

export default ExpireSoonServices