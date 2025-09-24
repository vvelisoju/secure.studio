import { Badge, FormatNumber, HStack, Stat, Flex, Image, Spinner } from "@chakra-ui/react"
import walletImage from "../../assets/wallet.png"
import { useDashboardStore } from "../../stores/dashboard";
const TotalRevenueCollectedCard = () => {

    const { details, loading } = useDashboardStore();

    const TotalRevenueCollected = details?.totalRevenueCollected;

    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} gap={"2cqw"} alignItems={"center"} >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                <Stat.Root>
                    <Stat.Label>Total Revenue Collected</Stat.Label>
                    <HStack>
                        <Stat.ValueText>
                            {loading ? <Spinner /> : <FormatNumber value={TotalRevenueCollected} style="currency" currency="INR" />}
                        </Stat.ValueText>
                    </HStack>
                </Stat.Root>
                <Flex justifyContent={"center"} alignItems={"center"} w={"25cqw"} h={"25cqw"} borderRadius={"4cqw"}>
                    {<Image w={"100%"} src={walletImage} />}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default TotalRevenueCollectedCard;
