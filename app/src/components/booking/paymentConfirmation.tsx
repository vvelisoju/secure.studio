import { Button, Flex, Image, Spinner, Text, Breadcrumb, Box, Grid, GridItem, Icon } from "@chakra-ui/react"
// import Invoice from "../../assets/invoice.png"
import TickIcon from "../../assets/tick"
import { useInvoicesStore } from "../../stores/invoice"
import { convertDatePrimaryStyle } from "../../utils/date"
import useServiceStore from "../../stores/services"
import ExitIcon from "../../assets/exit"
// import FullScreenIcon from "../../assets/fullscreen"
// import FullScreenExitIcon from "../../assets/fullscreenExit"
import { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import Invoice from "../invoice"
import useAuthStore from "../../stores/auth"
import { useUserStore } from "../../stores/users"
import { useCompanyStore } from "../../stores/company"
const PaymentConfirmation = () => {
    const [fullscreen, setFullScreen] = useState(false);
    const componentRef = useRef(null);
    const { bookingDetails } = useServiceStore();
    const { role } = useAuthStore();
    const { setSubscriptionTab } = useUserStore();
    const navigate = useNavigate();
    // const { invoicePreview, downloadPreviewInvoice } = useInvoicesStore();
    const user = bookingDetails?.user;
    const payment = bookingDetails?.payment;
    // const { fetchCompanyDetails } = useCompanyStore();
    // useEffect(() => { fetchCompanyDetails() }, []);
    // useEffect(() => {
    //     const handleFullscreenChange = () => {
    //         setFullScreen(!!document.fullscreenElement);
    //     };
    //     document.addEventListener("fullscreenchange", handleFullscreenChange);
    //     return () => {
    //         document.removeEventListener("fullscreenchange", handleFullscreenChange);
    //     };
    // }, []);

    // const enterFullScreen = () => {
    //     if ((componentRef.current as any)?.requestFullscreen) {
    //         (componentRef.current as any).requestFullscreen();
    //         setFullScreen(true);
    //     }
    // };

    // const exitFullScreen = () => {
    //     if (document.fullscreenElement) {
    //         document.exitFullscreen();
    //         setFullScreen(false);
    //     }
    // };


    const exitConfirmation = () => {
        // exitFullScreen();
        navigate("/subscriptions")
    }
    if (bookingDetails?.id) return (
        <Flex flexDir={"column"} ref={componentRef} bg={"white"} borderRadius={25} p={role === "SUPER_ADMIN" ? 0 : { base: 3, sm: 5 }} gap={5} flexGrow={1}   >
            {role !== "SUPER_ADMIN" && <Flex justifyContent={"space-between"} alignItems={"center"}>

                <Breadcrumb.Root size={"lg"}>
                    <Breadcrumb.List  >
                        <Breadcrumb.Item display={["none", "none", "flex"]} >
                            <NavLink to={"/subscriptions"} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >Subscriptions</Text>)}</NavLink>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator display={["none", "none", "flex"]} />
                        <Breadcrumb.Item display={["none", "none", "flex"]} >
                            <NavLink to={"/subscriptions/book"} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >Book subscription</Text>)}</NavLink>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator display={["none", "none", "flex"]} />
                        <Breadcrumb.Item >
                            <NavLink to={"/subscriptions/book/confirmation"} end>{({ isActive }) => (<Text fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >Confirmation</Text>)}</NavLink>
                        </Breadcrumb.Item>

                    </Breadcrumb.List>
                </Breadcrumb.Root>

            </Flex>}
            <Flex gap={5} flexGrow={1} >
                {/* Details */}
                <Flex gap={5} direction={"column"} alignItems={"center"} boxShadow={"2xl"} p={5} borderRadius={10} w={"100%"} border={"2px solid"} borderColor={"gray.200"} >
                    <Flex gap={5} direction={"column"} w={"100%"} h={"100%"}>
                        <Flex gap={5} justifyContent={"space-between"} w={"auto"} bg={"green.100"} borderRadius={5} p={5} alignItems={"center"} >
                            <Flex gap={3} alignItems={"center"}>
                                <Flex h={8} w={8} borderRadius={5} bg={"white"} alignItems={"center"} justifyContent={"center"}>
                                    <Box color={"green"} h={8} w={8}> {TickIcon()}</Box>
                                </Flex>
                                <Flex h={10} alignItems={"center"} fontSize={{ base: 11, sm: 15, md: 17 }}>
                                    <Text fontWeight={"bold"}>Your booking is confirmed</Text>
                                </Flex>
                            </Flex>
                            <Flex >
                                {/* {fullscreen && <Button onClick={exitFullScreen} p={0} variant={"plain"} >{FullScreenExitIcon()}</Button>}
                                {!fullscreen && <Button onClick={enterFullScreen} p={0} variant={"plain"} >{FullScreenIcon()}</Button>} */}
                                <Button onClick={role === "SUPER_ADMIN" ? () => setSubscriptionTab("SUBSCRIPTIONS") : exitConfirmation} borderRadius={"50%"} p={0} bg={"red.600"} variant={"solid"} > {ExitIcon("", "", "#fff")}</Button>
                            </Flex>
                        </Flex>
                        <Flex gap={5} direction={"column"} border={"2px solid"} borderColor={"gray.200"} p={10} borderRadius={10} flexGrow={1} >
                            <Flex>
                                <Grid w={"100%"}
                                    templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
                                    templateRows="repeat(1fr)"
                                    gap={5}
                                >
                                    <GridItem colSpan={1} >
                                        <Flex gap={5} minW={100} flexGrow={1} maxW={300} direction={"column"}>
                                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.500"} >Name</Text>
                                            <Text fontSize={"md"} fontWeight={"bold"} >{user?.name || "Not-Provided"}</Text>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Flex gap={5} minW={100} flexGrow={1} maxW={300} direction={"column"}>
                                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.500"}>Service From</Text>
                                            <Text fontSize={"md"} fontWeight={"bold"} >{convertDatePrimaryStyle(bookingDetails?.startTime)}</Text>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Flex gap={5} minW={100} flexGrow={1} maxW={300} direction={"column"}>
                                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.500"}>Service To</Text>
                                            <Text fontSize={"md"} fontWeight={"bold"} >{convertDatePrimaryStyle(bookingDetails?.endTime)}</Text>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Flex gap={5} minW={100} flexGrow={1} maxW={300} direction={"column"}>
                                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.500"}>Payment code</Text>
                                            <Text fontSize={"md"} fontWeight={"bold"} >{payment?.code || "Not-Provided"}</Text>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                        <Flex gap={5} minW={100} flexGrow={1} maxW={300} direction={"column"}>
                                            <Text fontSize={"sm"} fontWeight={"bold"} color={"gray.500"} >Booking code</Text>
                                            <Text fontSize={"md"} fontWeight={"bold"} >{bookingDetails?.code || "Not-Provided"}</Text>
                                        </Flex>
                                    </GridItem>
                                    <GridItem colSpan={1} >
                                    </GridItem>
                                </Grid>
                            </Flex>
                        </Flex>
                        {/* <Flex alignSelf={"end"}>
                            <Invoice invoiceDetails={bookingDetails?.invoice} buttonContent="CONFIRMATION" />
                        </Flex> */}
                    </Flex>
                </Flex>
            </Flex>
        </Flex >
    )
}

export default PaymentConfirmation