
import { Badge, FormatNumber, HStack, Stat, Flex, Image, Spinner } from "@chakra-ui/react"
import ActiveUsersIcon from "../../assets/activeUser.png";
import { useDashboardStore } from "../../stores/dashboard";
import { Skeleton } from "@chakra-ui/react";
const TotalActiveUsersCard = () => {
    const { details, loading } = useDashboardStore();

    const totalActiveUsers = details?.totalActiveUsers;

    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} gap={"2cqw"} alignItems={"center"} >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                <Stat.Root>
                    <Stat.Label>Total Active Users </Stat.Label>
                    <HStack>
                        <Stat.ValueText>
                            {loading ? <Spinner /> : <FormatNumber value={totalActiveUsers} />}
                        </Stat.ValueText>
                    </HStack>
                </Stat.Root>
                <Flex justifyContent={"center"} alignItems={"center"} w={"25cqw"} h={"25cqw"} borderRadius={"4cqw"}>
                    {<Image w={"100%"} src={ActiveUsersIcon} />}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default TotalActiveUsersCard;
