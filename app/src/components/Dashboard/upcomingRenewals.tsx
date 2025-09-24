import { Badge, FormatNumber, HStack, Stat, Flex, Image, Spinner } from "@chakra-ui/react"
import RenewalImage from "../../assets/renewals.png";
import { useDashboardStore } from "../../stores/dashboard";
const UpcomingRenewalsCard = () => {

    const { details, loading } = useDashboardStore();

    const upcomingRenewwals = details?.upcomingRenewwals;
    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} gap={"2cqw"} alignItems={"center"} >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                <Stat.Root>
                    <Stat.Label>Upcoming Renewals</Stat.Label>
                    <HStack>
                        <Stat.ValueText>
                            {loading ? <Spinner /> : <FormatNumber value={upcomingRenewwals} />}
                        </Stat.ValueText>
                    </HStack>
                </Stat.Root>
                <Flex justifyContent={"center"} alignItems={"center"} w={"25cqw"} h={"25cqw"} borderRadius={"4cqw"}>
                    {<Image w={"100%"} src={RenewalImage} />}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default UpcomingRenewalsCard;
