import { Flex, Text, Image, Box, Link, Icon } from "@chakra-ui/react"
import { NavLink } from "react-router-dom"
import DashboardIcon from "../../assets/dashboard"
import UserIcon from "../../assets/users"
import InvoiceIcon from "../../assets/invoice"
import SettingIcon from "../../assets/settings"
import logo from "../../assets/logo-lg.png"
import MeetingRoom from "../../assets/meetingRoom"
import SubscriptionIcon from "../../assets/subscriptions"
import NotificationAdd from "../../assets/notificationAss"
import useAuthStore from "../../stores/auth"
import { useUserStore } from "../../stores/users"
interface sidebarProps {
    screen: string
}

const Sidebar = ({ screen }: sidebarProps) => {
    const { setOpenSideBar, role } = useAuthStore()
    const { setSelectedUser } = useUserStore();
    const sections = [
        { name: "Dashboard", path: "/dashboard", icon: DashboardIcon, roles: ["SUPER_ADMIN", "USER", "USER_ADMIN", "EMPLOYEE"] },
        { name: "Subscriptions", path: "/subscriptions", icon: SubscriptionIcon, roles: ["USER", "USER_ADMIN", "EMPLOYEE"] },
        // { name: "Documents", path: "/documents", icon: SubscriptionIcon, roles: ["USER", "USER_ADMIN"] },
        // { name: "Bookings", path: "/bookings", icon: BookingIcon },
        { name: "Meeting Room", path: "/meetingRoom", icon: MeetingRoom, roles: ["USER", "USER_ADMIN"] },
        { name: "Users", path: "/employees", icon: UserIcon, roles: ["USER_ADMIN"] },
        { name: "Invoices", path: "/invoices", icon: InvoiceIcon, roles: ["USER", "USER_ADMIN"] },
        { name: "Invoice Generator", path: "/invoice-generator", icon: InvoiceIcon, roles: ["SUPER_ADMIN"] },
        { name: "Users", path: "/users", icon: UserIcon, roles: ["SUPER_ADMIN"] },
        { name: "Reminders", path: "/reminders", icon: NotificationAdd, roles: ["SUPER_ADMIN"] },
        { name: "Settings", path: "/settings", icon: SettingIcon, roles: ["SUPER_ADMIN", "USER", "USER_ADMIN", "EMPLOYEE"] },
    ]

    const filteredSections = sections.filter(section => section.roles.includes(role))


    const renderSection = (data: any) => {
        return (
            <NavLink key={data.path} to={data.path} onClick={() => {
                if (screen !== "big") setOpenSideBar(false)
            }} >
                {({ isActive }) => (
                    <Flex onClick={() => {
                        setSelectedUser({} as any)
                    }} alignItems={"center"} gap={3} position={"relative"} m={screen === "big" ? 2 : 0} my={2} p={2} opacity={isActive ? 1 : 0.7} 
                        borderRadius={10} borderRightRadius={screen === "big" ? 10 : 10} bgGradient={isActive ? "to-r" : ""} gradientFrom="blue.400" gradientTo="blue.200" >
                        {/* {(isActive && screen === "big") && <>
                            <Box position={"absolute"} h={5} w={5} right={0} top={-5} zIndex={100} bg={"blue.200"} >
                                <Box w={"100%"} h={"100%"} borderBottomRightRadius={10} bg={"white"}></Box>
                            </Box>
                            <Box position={"absolute"} h={5} w={5} bg={"blue.200"} right={0} bottom={-5} zIndex={100}  >
                                <Box w={"100%"} h={"100%"} borderTopRightRadius={10} bg={"white"}></Box>
                            </Box>
                        </>} */}
                        <Flex bg={"white"} borderRadius={"50%"} h={"30px"} w={"30px"} alignItems={"center"} justifyContent={"center"} >
                            <Icon h={"60%"} w={"60%"} color={"blackAlpha.800"} >{data.icon()}</Icon>
                        </Flex>
                        <Text color={isActive ? "white" : "blackAlpha.800"}
                            transition="transform 0.5s ease" transform={isActive ? `translateX(5px)` : `translateX(0px)`}
                            fontSize={"md"} fontWeight="bold">
                            {data.name}
                        </Text>
                    </Flex>
                )}
            </NavLink>
        )
    }


    return (
        <Flex flexGrow={1} gap={3} direction={"column"} w={{ base: "auto", md: "15cqw" }} minW={"240px"} flexShrink={0} >
            <Flex bg={"white"} borderRightRadius={10} direction={"column"} flexGrow={1}>
                <Flex px={[2, 5]} py={[5, 8]} justifyContent={"center"} >
                    <Link href="/" outline={"none"} >
                        <Image src={logo} h={{ base: "12cqw", sm: "8cqw", md: "100%" }} />
                    </Link>
                </Flex>
                <Flex direction={"column"} flexGrow={1} justifyContent={"space-between"}  >

                    <Flex direction={"column"} p={screen === "big" ? 0 : 2}>
                        {filteredSections.map(item => {
                            return renderSection(item)
                        })}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )

}

export default Sidebar