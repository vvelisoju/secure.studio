import { Badge, FormatNumber, HStack, Stat, Flex, Image, Spinner } from "@chakra-ui/react"
import SecurityDepositImage from "../../assets/securityDeposit.png"
import { useDashboardStore } from "../../stores/dashboard";
const SecurityDepositsCard = () => {

    const { details, loading } = useDashboardStore();

    const TotalSecurityDeposits = details?.totalSecurityDeposits;
    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} gap={"2cqw"} alignItems={"center"} >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                <Stat.Root>
                    <Stat.Label>Total Security Deposits </Stat.Label>
                    <HStack>
                        <Stat.ValueText>
                            {loading ? <Spinner /> : <FormatNumber value={TotalSecurityDeposits} style="currency" currency="INR" />}


                        </Stat.ValueText>
                    </HStack>
                </Stat.Root>
                <Flex justifyContent={"center"} alignItems={"center"} w={"25cqw"} h={"25cqw"} borderRadius={"4cqw"}>
                    {<Image w={"100%"} src={SecurityDepositImage} />}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default SecurityDepositsCard;
