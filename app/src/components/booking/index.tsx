import { Flex, Button, Spinner, Icon, Breadcrumb, Text } from "@chakra-ui/react"
import useServiceStore from "../../stores/services"
import { useEffect } from "react";
import { toaster } from "../ui/toaster";
import BookingSummary from "./bookingSummary";
import BookingTabs from "./tabs";
import Firstpage from "../../assets/firstPage";
import { useUserStore } from "../../stores/users";
import useAuthStore from "../../stores/auth";
import { NavLink, useLocation } from "react-router-dom";
const SelectServiceStep = () => {
    const { reset, selectedServiceCategory, getServiceCategories, openBookingDrawer } = useServiceStore();
    const { setSubscriptionTab } = useUserStore();
    const { role } = useAuthStore();
    const home = location.pathname === '/';

    useEffect(() => {
        getServiceCategories()
            .catch(error => {
                toaster.create({ description: error?.data?.message || "Failed to fetch service Categories", type: "error" })
            });
        return () => reset()
    }, []);

    if (home) return (
        <Flex position={"relative"} flexDir={"column"} gap={10} flexGrow={1} >
            {<BookingTabs />}
        </Flex>
    )


    if (["USER", "USER_ADMIN"].includes(role) && !home)
        return (
            <Flex containerType={"inline-size"} flexDir={"column"} fontSize={18} gap={5} flexGrow={1} overflowY={"auto"} bg={home ? "transparent" : "white"} borderRadius={{ base: 10, md: 25 }} p={{ base: 3, md: 5 }}  >
                <Flex display={home ? "none" : "auto"} justifyContent={"space-between"} alignItems={"center"} >
                    <Breadcrumb.Root size={"lg"}>
                        <Breadcrumb.List>
                            <Breadcrumb.Item display={["none", "none", "flex"]}>
                                <NavLink to={"/subscriptions"} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >Subscriptions</Text>)}</NavLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator display={["none", "none", "flex"]} />
                            <Breadcrumb.Item >
                                <NavLink to={"/subscriptions/book"} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >New Subscription</Text>)}</NavLink>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </Flex>
                <Flex gap={5} flexGrow={1} overflowY={"auto"}>
                    <Flex position={"relative"} flexDir={"column"} gap={5} bg={"white"} flexGrow={1} p={{ base: 3, md: 5 }} border={"2px solid"} borderColor={"gray.200"} borderRadius={{ base: 8, md: 20 }} overflowY={"auto"}>
                        {selectedServiceCategory?.id ? <BookingTabs /> : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>}
                    </Flex>
                    {openBookingDrawer && <BookingSummary />}
                </Flex>
            </Flex>
        )

    if (role === "SUPER_ADMIN" && !home)
        return (
            <Flex gap={5} flexGrow={1} >
                <Flex position={"relative"} flexDir={"column"} gap={5} bg={"white"} flexGrow={1} >
                    <Button zIndex={5} position={{ base: "relative", sm: "absolute" }} onClick={() => setSubscriptionTab("SUBSCRIPTIONS")} borderRadius={"50%"} w={"auto"} p={0} alignSelf={"start"} ><Icon  >{Firstpage()}</Icon></Button>
                    {selectedServiceCategory?.id ? <BookingTabs /> : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>}
                </Flex>
                {openBookingDrawer && <BookingSummary />}
            </Flex>
        )


}

export default SelectServiceStep;