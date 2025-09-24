import { Flex, Text, Icon, Button, Image } from "@chakra-ui/react";
import GiftIcon from "../../assets/gift"; // Replace with an appropriate gift/referral icon
import GiftImg from "../../assets/giftbox.png"; // Replace with an appropriate gift/referral icon
import { useDashboardStore } from "../../stores/dashboard";
import Copy from "../../assets/copy";
import Share from "../../assets/share";
import { Tooltip } from "../ui/tooltip";
import { toaster } from "../ui/toaster";
import { useEffect, useState } from "react";
import ReferAndEarnDrawer from "./referAndEarnDrawer";
const appUrl = import.meta.env.VITE_APP_BASE_URL
const ReferAndEarn = () => {
    const { details, } = useDashboardStore();
    const referralCode: string = details?.referralCode ?? "YOUR-CODE";
    const referralLink: string = `${appUrl}/auth?ref=${referralCode}`;
    const [color, setColor] = useState("gray")
    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode)
            .then(() => {
                toaster.create({ description: `Copied - Referral Code`, type: "success" })
                setColor("blue");
                setTimeout(() => { setColor("gray"); }, 2000);
            })
            .catch(err => console.error("Failed to copy:", err));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Join and Earn Rewards!",
                text: `Use my referral code to sign up: ${referralCode}`,
                url: referralLink
            }).catch(err => console.error("Error sharing:", err));
        } else {
            alert("Sharing not supported on this device. Copy the link instead.");
        }
    };


    return (
        <Flex h={"100%"} gap={"2cqw"} flexDir={"column"} borderRadius={10} bg={"white"}>
            <Flex borderTopRadius={10} bgGradient={"to-r"} gradientFrom={"blue.600"} gradientTo={"blue.400"} px={{ base: "4cqw" }}  justifyContent={"space-between"} alignItems={"center"}>
                <Flex flexDir={"column"}>
                    <Text color={"white"} fontWeight={"600"} fontSize={{ base: "5cqw", md: "3.5cqw" }}>Refer & Earn Rewards</Text>
                    <Text color={"whiteAlpha.700"} fontWeight={"600"} fontSize={{ base: "2.55cqw", md: "1.75cqw" }}>Share the studio, earn rewards</Text>
                </Flex>
                {<Image h={"15cqw"} w={"15cqw"} src={GiftImg} />}
            </Flex>

            <Flex gap={{ base: 3, md: 5 }} flexGrow={1} p={{ base: "2cqw" }} flexDir={"column"} borderRadius={10} justifyContent={"space-between"} >
                <Flex p={{ base: "2cqw" }} flexDir={"column"} gap={"1cqw"} border={{ base: "2px solid", md: "3px solid" }} borderStyle={{ base: "dashed", md: "dashed" }} borderColor={{ base: `${color}.300`, md: `${color}.300` }} bg={{ base: `${color}.100`, md: `${color}.100` }} borderRadius={10}>
                    <Text color={"blackAlpha.700"} fontSize={{ base: "3.5cqw", md: "1.75cqw" }} fontWeight={"600"}>Your Referral Code</Text>
                    <Flex gap={"2cqw"} justifyContent={"space-between"}>
                        <Flex alignItems={"center"} px={"2cqw"} borderRadius={8} flexGrow={1} bg={"white"} justifyContent={"space-between"}>
                            <Text fontWeight={"600"} color={"blackAlpha.700"} >{referralCode}</Text>
                            {/* <Tooltip content="Copy Code">
                                <Icon onClick={handleCopy} cursor={"pointer"} h={5} w={5} color={"blackAlpha.800"}  >{Copy()}</Icon>
                            </Tooltip> */}
                        </Flex>
                        <Button fontSize={{ base: 12, md: 15 }} p={{ base: 1, md: 2 }} h={{ base: "auto" }} borderRadius={8} onClick={handleShare} bg={"blue.500"} _hover={{ bg: "blue.600" }} ><Icon h={{ base: 3, md: 4 }} w={{ base: 3, md: 4 }} color={"white"}   >{Share()}</Icon>Share</Button>
                    </Flex>
                </Flex>
                <ReferAndEarnDrawer />
            </Flex>
        </Flex>
    );
};

export default ReferAndEarn;
