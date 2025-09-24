import { Flex, Link, Button, Text, CloseButton, Drawer, Portal, Image, Avatar } from "@chakra-ui/react"
import HomeIcon from "../../assets/home"
import useAuthStore from "../../stores/auth";
import MenuIcon from "../../assets/menu";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { useSettingsStore } from "../../stores/settings";
import { getUserType } from "../../utils/misc";
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};


const DashBoardHeader = () => {
    const greeting = getGreeting();
    const { openSideBar, setOpenSideBar } = useAuthStore();
    const { adminProfileDetails } = useSettingsStore();
    const SideBar = () => {
        return (
            <Drawer.Root placement={"start"} open={openSideBar} onOpenChange={(e) => setOpenSideBar(e.open)}>
                <Drawer.Trigger asChild>
                    <Button display={{ md: "none" }} p={0} m={0} minW={"auto"} variant={"plain"}>
                        {MenuIcon("10px", "10px", 'dark')}
                    </Button>
                </Drawer.Trigger>
                <Portal >
                    <Drawer.Backdrop />
                    <Drawer.Positioner w={"70%"}>
                        <Drawer.Content bg={"transparent"} boxShadow={"none"} >
                            <Sidebar screen="small" />
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        )
    }


    return (
        <Flex m={2} mb={{ base: 0, sm: 0, md: 0 }} >
            <Flex py={{ base: 2, sm: 3, md: 4 }} px={{ base: 4 }} boxShadow={"2xl"} bg={'white'} w={"100%"} borderRadius={10} justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={3} alignItems={"center"}>
                    {SideBar()}
                    <Text fontSize={{ base: 15, md: 20 }} fontWeight={"bold"}>{greeting}</Text>
                </Flex>
                <Flex alignItems={"center"}>
                    {
                        adminProfileDetails?.name && <Link href="/settings" >
                            <Flex gap={3}>
                                <Flex flexDir={"column"}>
                                    <Text color={"blackAlpha.900"} fontSize={"sm"} fontWeight={500}>{adminProfileDetails?.name || "User"}</Text>
                                    <Text color={"blackAlpha.700"} textAlign={"end"} fontSize={"xs"} fontWeight={500}>{getUserType(adminProfileDetails?.userType || "USER")}</Text>
                                </Flex>
                                <Avatar.Root>
                                    <Avatar.Fallback name={adminProfileDetails?.name} />
                                    <Avatar.Image src={adminProfileDetails?.imageUrl}/>
                                </Avatar.Root>
                            </Flex>
                        </Link>
                    }

                </Flex>
            </Flex>
        </Flex>
    )
}

export default DashBoardHeader