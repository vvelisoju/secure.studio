import { Flex, Text, Icon, Link, Box } from "@chakra-ui/react"
import ViewAllIcon from "../../assets/viewAll"
import { useDashboardStore } from "../../stores/dashboard"
import Invoice from "../invoice"
const RecentInvoices = () => {
    const { details } = useDashboardStore();
    const data = details?.recentInvoices;
    const card = (details: any, index: any) => {
        return (
            <Flex key={index} alignItems={"center"} justifyContent={"space-between"} color={"blackAlpha.700"} py={"2cqw"} px={"3cqw"} border={"2px solid"} borderColor={"orange.200"} borderRadius={10}>
                <Text fontWeight={"bold"} fontSize={"3.5cqw"}>#{details?.code}</Text>
                <Box><Invoice invoiceDetails={details?.booking || {}} buttonContent="INVOICES" /></Box>
            </Flex>
        )
    }
    return (
        <Flex h={"100%"} gap={"4cqw"} flexDir={"column"} p={{ base: "4cqw" }} borderRadius={10} bg={"white"} >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text color={"blackAlpha.800"} fontWeight={"600"} fontSize={"5cqw"}>Recent Invoices</Text>
                <Link _hover={{ textDecoration: "none" }} href="/invoices" outlineColor={"none"} _focus={{ outlineColor: "transparent" }} >
                    <Flex cursor={"pointer"} as={"button"} color={"blackAlpha.800"} gap={"1cqw"} alignItems={"center"}>
                        <Icon h={"20px"} w={"20px"} color={"blackAlpha.800"} >{ViewAllIcon()}</Icon>
                        <Text fontSize={"3cqw"} fontWeight={"600"}  >View All</Text>
                    </Flex>
                </Link>
            </Flex>
            <Flex flexGrow={1} gap={"2cqw"} flexDir={"column"}>
                {data && data.length > 0 && data?.map((item: any, index: any) => {
                    return card(item, index);
                })}
                {data?.length === 0 && <Flex fontWeight={"bold"} color={"gray.300"} fontSize={"5cqw"} flexGrow={1} alignItems={"center"} justifyContent={"center"} >No Recent Invoices</Flex>}
            </Flex>
        </Flex>
    )
}

export default RecentInvoices