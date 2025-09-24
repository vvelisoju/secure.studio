import { Flex, Button, Text, Box } from "@chakra-ui/react"
import ProfileCard from "../components/settings/profileCard";
import CompanyCard from "../components/settings/companyCard";
import MeetingRoom from "../components/settings/meetingRoom";
import AppSetting from "../components/settings/appSetting";
import InvoiceSetting from "../components/settings/invoice";
import { useSettingsStore } from "../stores/settings";
import { Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import useAuthStore from "../stores/auth";
import { useCompanyStore } from "../stores/company";
import { UserSingleIcon } from "../assets/users";
import MeetingRoomIcon from "../assets/meetingRoom";
import Office from "../assets/office";
import InvoiceIcon from "../assets/invoice";
import SettingsIcon from "../assets/settings";
const Settings = () => {
    const { logout, role } = useAuthStore();
    const { profileDetails, fetchProfileDetails, tab, setTab } = useSettingsStore();
    const { fetchCompanyDetails } = useCompanyStore();
    useEffect(() => { fetchProfileDetails(), fetchCompanyDetails() }, []);
    return (
        <Flex p={5} gap={5} bg={"white"} flexDir={"column"} alignItems={"center"} flexGrow={1} borderRadius={{ base: 10, md: 10 }}>

            <Tabs.Root gap={10} w={"100%"} variant={"outline"} value={tab} onValueChange={(e) => setTab(e.value)} >
                <Tabs.List alignItems={"center"} justifyContent={"space-between"} className="settings-tab">
                    <Flex>
                        <Tabs.Trigger bg={tab === "personal" ? "white" : "transparent"} opacity={tab === "personal" ? 1 : 0.7} borderTopRadius={10} justifyContent={"center"} value="personal">
                            <Box color={"primary"} h={5} w={5} ><UserSingleIcon /></Box>
                            <Text display={{ base: "none", lg: "flex" }} > Personal</Text>
                        </Tabs.Trigger>

                        {
                            ["USER_ADMIN", "SUPER_ADMIN"].includes(profileDetails?.userType) &&
                            <Tabs.Trigger bg={tab === "company" ? "white" : "transparent"} opacity={tab === "company" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="company">
                                <Box color={"primary"} h={5} w={5} ><Office /></Box>
                                <Text display={{ base: "none", lg: "flex" }} > Company</Text>
                            </Tabs.Trigger>
                        }
                        {
                            ["SUPER_ADMIN"].includes(profileDetails?.userType) &&
                            <Tabs.Trigger bg={tab === "meetingRoom" ? "white" : "transparent"} opacity={tab === "meetingRoom" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="meetingRoom">
                                <Box color={"primary"} h={5} w={5} ><MeetingRoomIcon /></Box>
                                <Text display={{ base: "none", lg: "flex" }} > Meeting </Text>
                            </Tabs.Trigger>
                        }
                        {
                            ["SUPER_ADMIN"].includes(profileDetails?.userType) &&
                            <Tabs.Trigger bg={tab === "invoice" ? "white" : "transparent"} opacity={tab === "invoice" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="invoice">
                                <Box color={"primary"} h={5} w={5} ><InvoiceIcon /></Box>
                                <Text display={{ base: "none", lg: "flex" }} > Invoice</Text>
                            </Tabs.Trigger>
                        }
                        {
                            ["SUPER_ADMIN"].includes(profileDetails?.userType) &&
                            <Tabs.Trigger bg={tab === "core" ? "white" : "transparent"} opacity={tab === "core" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="core">
                                <Box color={"primary"} h={5} w={5} ><SettingsIcon /></Box>
                                <Text display={{ base: "none", lg: "flex" }} > Core</Text>
                            </Tabs.Trigger>
                        }
                    </Flex>
                </Tabs.List>
                <Tabs.Content pt={0} value="personal">
                    <ProfileCard />
                </Tabs.Content>
                {
                    ["USER_ADMIN", "SUPER_ADMIN"].includes(profileDetails?.userType) &&
                    <Tabs.Content pt={0} value="company">
                        <CompanyCard />
                    </Tabs.Content>
                }
                {
                    ["SUPER_ADMIN"].includes(profileDetails?.userType) &&
                    <Tabs.Content pt={0} value="meetingRoom">
                        <MeetingRoom />
                    </Tabs.Content>
                }
                {
                    ["SUPER_ADMIN"].includes(profileDetails?.userType) &&
                    <Tabs.Content pt={0} value="invoice">
                        <InvoiceSetting />
                    </Tabs.Content>
                }
                {
                    ["SUPER_ADMIN"].includes(profileDetails?.userType) &&
                    <Tabs.Content pt={0} value="core">
                        <AppSetting />

                    </Tabs.Content>
                }
            </Tabs.Root>
            <Flex w={"100%"} justifyContent={"end"}>
                <Button h={"34px"} p={3} bg={"red.600"} borderRadius={10} variant={"solid"} onClick={logout} >Logout</Button>
            </Flex>
        </Flex>
    )
}

export default Settings



