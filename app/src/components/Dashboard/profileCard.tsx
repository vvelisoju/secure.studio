import { Flex, Text, Editable, Separator, Span } from "@chakra-ui/react"
import { Avatar } from "@chakra-ui/react"
import { toaster } from "../ui/toaster";
import Profile from "../../assets/demo-profile.png"
import { useSettingsStore, } from "../../stores/settings"
import { useEffect } from "react"
import QrCode from "./qrCode"
import MaleIcon from "../../assets/male";
import FemaleIcon from "../../assets/female";
import LocationIcon from "../../assets/location";
import CallIcon from "../../assets/call";
import MailIcon from "../../assets/mail";
const ProfileCard = () => {
    const { fetchProfileDetails, profileDetails: user } = useSettingsStore();

    useEffect(() => {
        fetchProfileDetails().catch(error => { toaster.create({ description: error?.data?.message || "Failed to fetch useDetails", type: "error" }) });
    }, []);

    return (
        <Flex h={"100%"} bg={"white"} p={"4cqw"} borderRadius={10} boxShadow={"md"}
            justifyContent={"space-between"} alignItems={"center"}
            gap={"2cqw"}
        >

            <Flex flexDir={"column"} gap={"2cqw"} >
                <Flex justifyContent={"center"} alignItems={"center"} gap={"3cqw"}>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Avatar.Root flexGrow={1} w={"17cqw"} h={"17cqw"} border={"1cqw solid"} borderColor={"blue.100"}   >
                            <Avatar.Image src={user?.imageUrl || Profile} />
                            <Avatar.Fallback />
                        </Avatar.Root>
                    </Flex>
                    <Flex direction={"column"} flexGrow={1}  >
                        <Text ml={"1cqw"} fontSize={"4cqw"} fontWeight={"bold"} color={"blackAlpha.800"} textAlign="start">{user?.name}</Text>
                        <Flex gap={1}>
                            {user?.gender === "MALE" && MaleIcon("4.5cqw", "4.5cqw", "#2986cc")}
                            {user?.gender === "FEMALE" && FemaleIcon("4.5cqw", "4.5cqw", "#c90076")}
                            <Text fontSize={"3.5cqw"} fontWeight={"500"} color={"blackAlpha.700"} textAlign="start">
                                {user?.gender ? user.gender[0].toUpperCase() + user.gender.slice(1).toLowerCase() : ''}
                            </Text>
                        </Flex>

                    </Flex >
                </Flex>
                <Flex fontSize={"3cqw"} flexDir={"column"} gap={"1.5cqw"} color={"blackAlpha.700"} fontWeight={"500"}>
                    <Flex alignItems={"center"} gap={"1.5cqw"} >
                        <Span>{MailIcon("4.5cqw", "4.5cqw", "var(--chakra-colors-gray-400)")}</Span>
                        <Text >{user?.email}</Text>
                    </Flex>
                    {user?.phone && <Flex alignItems={"center"} gap={"1.5cqw"} >
                        <Span>{CallIcon("4.5cqw", "4.5cqw", "var(--chakra-colors-gray-400)")}</Span>
                        <Text >+91 {user?.phone}</Text>
                    </Flex>}
                </Flex>
            </Flex>
            <Flex h={"100%"} gap={"2cqw"}>
                <Separator h={"100%"} border={"1px solid var(--chakra-colors-gray-300)"} />
                <Flex>
                    <QrCode />
                </Flex>
            </Flex>
        </Flex >
    )
}

export default ProfileCard