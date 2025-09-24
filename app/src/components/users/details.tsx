import { Button, Flex, Image, Spinner, Text, Breadcrumb, Box, Grid, GridItem } from "@chakra-ui/react"
import { NavLink, useNavigate } from "react-router-dom"
import { useUserStore } from "../../stores/users";
import UserTabs from "./userTabs"
const UserDetails = () => {
    const { userName } = useUserStore();
    return (
        <Flex overflow={"auto"} flexDir={"column"} bg={"white"} borderRadius={10} p={{ base: 3, sm: 5 }} gap={5} flexGrow={1}   >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Breadcrumb.Root size={"lg"}>
                    <Breadcrumb.List  >
                        <Breadcrumb.Item display={["none", "none", "flex"]} >
                            <NavLink to={"/users"} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >Users</Text>)}</NavLink>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator display={["none", "none", "flex"]} />
                        <Breadcrumb.Item display={["none", "none", "flex"]} >
                            <NavLink to={`/users/${userName}`} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >{userName}</Text>)}</NavLink>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Flex>
            <Flex gap={5} flexGrow={1}>
                {/* Details */}
                <UserTabs  />
            </Flex>
        </Flex>
    )
}

export default UserDetails