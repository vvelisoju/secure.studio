import { Flex, Span, Text, Icon, Stat, Image } from "@chakra-ui/react";
import WalletIcon from "../../assets/wallet";
import WalletImg from "../../assets/wallet.png";
import CurrencyIcon from "../../assets/currency";
import { useDashboardStore } from "../../stores/dashboard";
const WalletCard = () => {
    const { details } = useDashboardStore();

    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} gap={"2cqw"} alignItems={"center"} >
            <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                <Stat.Root gap="4cqw">
                    <Stat.Label ml={"2cqw"} color={"blackAlpha.700"} fontWeight={"600"} fontSize={"4.5cqw"}>Wallet Balance</Stat.Label>
                    <Stat.ValueText color={"blackAlpha.700"} fontWeight={"bold"} fontSize={"6cqw"} >
                        <Span w={"6cqw"} h={"6cqw"}>{CurrencyIcon("100%", "100%", "var(--chakra-colors-black-alpha-700)")}</Span>
                        {details?.walletAmount ? details?.walletAmount.totalWallet.toFixed(2) : 0.00.toFixed(2)}
                    </Stat.ValueText>
                    {/* <Badge colorPalette="red" variant="plain" px="0">
                        <Stat.DownIndicator />
                        1.9% from last month
                    </Badge> */}
                </Stat.Root>
                <Flex justifyContent={"center"} alignItems={"center"} w={"25cqw"} h={"25cqw"} borderRadius={"4cqw"}>
                    {<Image w={"100%"} src={WalletImg} />}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default WalletCard


