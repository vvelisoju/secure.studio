import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import DashBoardHeader from "./shared/dashboardHeader";
// import DashboardFooter from "./shared/dashboardFooter";
import Sidebar from "./shared/sidebar";
import { useSettingsStore } from "../stores/settings";
import { useEffect } from "react";
const DashBoardLayout = () => {
    const { fetchAdminProfileDetails } = useSettingsStore();
    useEffect(() => {
        fetchAdminProfileDetails();
    }, [])
    return (
        <Flex direction={"column"} height={"100vh"}>

            {/* Main Content Area */}
            <Flex flexGrow={1} overflow={"hidden"} bg={"blue.200"} >
                {/* Sidebar */}
                <Flex display={{ base: "none", md: "flex" }}>
                    <Sidebar screen="big" />
                </Flex>
                <Flex containerType={"inline-size"} direction={"column"} flexGrow={1} borderRadius={10} >
                    {/* Fixed Header */}
                    <Box containerType={"inline-size"}><DashBoardHeader /></Box>
                    {/* Scrollable Content */}
                    <Flex containerType={"inline-size"} m={2} direction={"column"} flexGrow={1} overflowY={"auto"}>
                        <Outlet />
                    </Flex>
                </Flex>
            </Flex>

            {/* Fixed Footer */}
            {/* <DashboardFooter /> */}
        </Flex>
    );
};

export default DashBoardLayout;
