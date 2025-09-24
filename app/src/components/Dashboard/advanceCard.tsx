import { Flex, Span, Stat, Image, Link, } from "@chakra-ui/react"
import AdvanceImg from "../../assets/securityDeposit.png"
import CurrencyIcon from "../../assets/currency"
import { useDashboardStore } from "../../stores/dashboard"
import { Tooltip } from "../ui/tooltip"
const AdvanceCard = () => {
    const { details } = useDashboardStore();
    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} gap={"2cqw"} alignItems={"center"} >
            <Link w={"100%"} _hover={{ textDecoration: "none" }} href="/dashboard/advanceHistory" outlineColor={"none"} _focus={{ outlineColor: "transparent" }} >
                <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Show Deposits History">
                    <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"} >
                        <Stat.Root gap="4cqw">
                            <Stat.Label ml={"2cqw"} color={"blackAlpha.700"} fontWeight={"600"} fontSize={"4.5cqw"}>Security Deposit</Stat.Label>
                            <Stat.ValueText color={"blackAlpha.700"} fontWeight={"bold"} fontSize={"6cqw"} >
                                <Span w={"6cqw"} h={"6cqw"}>{CurrencyIcon("100%", "100%", "var(--chakra-colors-black-alpha-700)")}</Span>
                                {details?.advanceAmount ? details?.advanceAmount.totalAdvance.toFixed(2) : 0.00.toFixed(2)}
                            </Stat.ValueText>
                        </Stat.Root>
                        <Flex justifyContent={"center"} alignItems={"center"} w={"25cqw"} h={"25cqw"} borderRadius={"4cqw"}>
                            {<Image w={"100%"} src={AdvanceImg} />}
                        </Flex>
                    </Flex>
                </Tooltip>
            </Link>

        </Flex>

    )
}

export default AdvanceCard