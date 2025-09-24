import {
    Breadcrumb, Stack, Table, Spinner, Badge, Flex, Button, Text,
    useBreakpointValue, Icon, Select, Portal, createListCollection, Box,
} from "@chakra-ui/react";
import { useEffect } from "react";
import useAuthStore from "../stores/auth";
import { convertDatePrimaryStyle } from "../utils/date";
import { NavLink } from "react-router-dom";
import { useSubscriptionsStore } from "../stores/subscription";
import { useUserStore } from "../stores/users";
import CalenderIcon from "../assets/calender";
import Renew from "../assets/renew";
import Play from "../assets/play";
import Upgrade from "../assets/upgrade";
import { Tooltip } from "../components/ui/tooltip";
import useServiceStore from "../stores/services";
import BookingSummary from "../components/booking/bookingSummary";
import DeleteIcon from "../assets/DeleteIcon";
import { EditSquareNew } from "../assets/editSquare";
import { updateQuotedSubscription } from "../api/subscription";
import { toaster } from "../components/ui/toaster";
import ManageSubscription from "../components/subscriptions/editSubscriptions";
import CancelSubscriptionAlert from "../components/subscriptions/deleteAlert";
const getBadgeColor = (status: string): string => {
    switch (status) {
        case "ACTIVE":
            return "green";
        case "INACTIVE":
            return "red";
        case "DELETED":
            return "red";
        case "HOLD":
            return "yellow";
        case "QUOTED":
            return "gray";
        default:
            return "blue";
    }
};

const Services = () => {
    const { subscriptions, loading, fetchSubscriptions, setSelectedSubscription } = useSubscriptionsStore();
    const { setBookingDrawer, setSelectedPlan, setServiceQuantity, openBookingDrawer } = useServiceStore();
    const { setSubscriptionTab, updateAdminAllowed, userRole } = useUserStore();
    const { role, user } = useAuthStore();
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });

    useEffect(() => { fetchSubscriptions() }, []);

    const onActivateSubscription = async (id: any) => {
        let toastId: any = toaster.create({ description: "saving.....", type: "loading" });
        try {
            const response: any = await updateQuotedSubscription({ id });
            toaster.update(toastId, { description: response.message || "Subscription Activated  successfully", type: "success" });
            fetchSubscriptions()
        } catch (error: any) {
            console.error(error);
            toaster.update(toastId, { description: error?.data?.message || "Subscription Activatation Failed", type: "error" });
        } finally {
        }
        return;
    }


    const card = (details: any, index: any) => {
        return (
            <Flex key={index} justifyContent={"space-between"} color={"blackAlpha.700"} py={{ base: "2cqw", md: "1cqw" }} px={{ base: "6cqw", md: "3cqw" }} border={"2px solid"} borderLeft={"5px solid"} borderColor={"purple.100"} borderLeftColor={"purple.400"} borderRadius={10}>
                <Flex width={"100%"} flexDir={"column"} gap={{ base: "1cqw", md: "0.5cqw" }}>
                    <Flex width={"100%"} gap={{ base: "4cqw", md: "2cqw" }} alignItems={"center"} justifyContent={"space-between"}>
                        <Text fontSize={{ base: "4cqw", md: "2cqw" }} fontWeight={"600"} >{details?.service?.name}</Text>
                        <Badge fontSize={{ base: "3cqw" }} colorPalette={details?.isStarted ? "red" : "blue"} >{details?.timeLeft}</Badge>
                    </Flex>
                    <Flex width={"100%"} gap={"1cqw"} alignItems={"center"} justifyContent={"space-between"}>
                        <Flex alignItems={"center"} gap={"1cqw"} >
                            <Icon h={"3cqw"} w={"3cqw"} color={"blackAlpha.600"} >{CalenderIcon()}</Icon>
                            <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"} color={"blackAlpha.600"} >{convertDatePrimaryStyle(details?.startTime)} - {convertDatePrimaryStyle(details?.endTime)}</Text>
                        </Flex>
                        <Badge fontSize={{ base: "2.5cqw" }} colorPalette={"green"} >Advance : {details?.advance}</Badge>
                    </Flex>
                </Flex>
            </Flex>
        )
    }
    return (
        <Stack width="full" gap="5" bg={'white'} p={role !== "SUPER_ADMIN" ? 5 : 0} borderRadius={10} flexGrow={1} overflowY={"auto"} >
            <Flex alignItems={"center"} justifyContent={"space-between"} >
                {
                    role !== "SUPER_ADMIN" &&
                    (
                        <Breadcrumb.Root size={"lg"}>
                            <Breadcrumb.List>
                                <Breadcrumb.Item>
                                    <NavLink to={"/subscriptions"} end >{({ isActive }) => (<Text fontSize={{ base: 18, md: 20 }} fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >Subscriptions</Text>)}</NavLink>
                                </Breadcrumb.Item>
                            </Breadcrumb.List>
                        </Breadcrumb.Root>
                    )
                }
                {role !== "EMPLOYEE" && <Flex alignSelf={"end"} flexGrow={1} justifyContent={"end"} >
                    {role !== "SUPER_ADMIN" ?
                        <NavLink to={"/subscriptions/book"} ><Button px={4} fontSize={{ base: 11, md: 14 }} borderRadius={{ base: 10 }} bg={"blackAlpha.900"} >New Subscription</Button></NavLink>
                        : <Button onClick={() => setSubscriptionTab("BOOK_SUBSCRIPTION")} px={4} fontSize={{ base: 11, md: 14 }} borderRadius={{ base: 10 }} bg={"blackAlpha.900"} >New Subscription</Button>
                    }
                </Flex>}
            </Flex>
            {!isSmallScreen && <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                {loading ? (
                    <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                ) : subscriptions.length > 0 ? (
                    <Table.ScrollArea borderWidth="1px" rounded="md" >
                        <Table.Root size="sm" rounded={"md"} stickyHeader={true}  >
                            <Table.Header >
                                <Table.Row bg={"gray.100"}  >
                                    <Table.ColumnHeader p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                    <Table.ColumnHeader p={5} fontSize={"md"}>Service</Table.ColumnHeader>
                                    <Table.ColumnHeader p={5} fontSize={"md"}>Validity Till</Table.ColumnHeader>
                                    <Table.ColumnHeader p={5} fontSize={"md"}>Amount</Table.ColumnHeader>
                                    <Table.ColumnHeader p={5} fontSize={"md"}>Discount</Table.ColumnHeader>
                                    <Table.ColumnHeader p={5} fontSize={"md"}>Status</Table.ColumnHeader>
                                    {/* <Table.ColumnHeader p={5} fontSize={"md"}>Advance Amount</Table.ColumnHeader> */}
                                    {role === "USER_ADMIN" && <>
                                        <Table.ColumnHeader p={5} fontSize={"md"}  >Allowed Employees</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}  >Employees Filled</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Membership</Table.ColumnHeader>
                                    </>}
                                    {userRole !== "EMPLOYEE" && role !== "EMPLOYEE" &&
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Actions</Table.ColumnHeader>
                                    }
                                </Table.Row>
                            </Table.Header>
                            <Table.Body >
                                {subscriptions.map((item: any, index: any) => {
                                    const isSubscriptionUsed = item?.UserSubscription.find((obj: any) => {
                                        if (obj?.user?.id === user?.id) return obj?.isSubscriptionUsed;
                                    });
                                    const value = isSubscriptionUsed ? "ALLOWED" : "NOTALLOWED";
                                    const frameworks = createListCollection({
                                        items: [
                                            { label: "Allow", value: "ALLOWED" },
                                            { label: "Not Allow", value: "NOTALLOWED" },
                                        ],
                                    })
                                    return <Table.Row opacity={item.status === "DELETED" ? 0.5 : 1} pointerEvents={item.status === "DELETED" ? "none" : "all"} key={item.id} h={1} >
                                        <Table.Cell w={5} py={3} px={2} textAlign={"center"}>{index + 1}&#41;</Table.Cell>
                                        <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>{item.service?.name}</Table.Cell>
                                        <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}  ><Badge >{convertDatePrimaryStyle(item.endTime)}</Badge></Table.Cell>

                                        {/* <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} ><Badge colorPalette={item?.isStarted ? "red" : "blue"} >
                                            {["ACTIVE", "QUOTED"].includes(item?.status) ? item?.timeLeft : "EXPIRED"}</Badge>
                                        </Table.Cell> */}
                                        <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} >
                                            ₹{item?.amount.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} >
                                            ₹{item?.discount.toFixed(2)}
                                        </Table.Cell>
                                        <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"} ><Badge colorPalette={getBadgeColor(item?.status)} >{item?.status}</Badge></Table.Cell>

                                        {/* <Table.Cell py={3} px={5}  ><Badge colorPalette={"green"} >{item?.advance > 0 ? "₹" + item?.advance : "Not-Provided"}</Badge></Table.Cell> */}
                                        {role === "USER_ADMIN" && <>
                                            <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>{item?.employeesAllowed}</Table.Cell>
                                            <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>{item?.employeesFilled}</Table.Cell>
                                            <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>
                                                <Select.Root collection={frameworks} size="sm" value={[value]}
                                                    onValueChange={async (e: any) => { await updateAdminAllowed(item?.id, e.value); await fetchSubscriptions() }}>
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder="Select" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Portal>
                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {frameworks.items.map((framework: any) => (
                                                                    <Select.Item pointerEvents={framework.value === value ? "none" : "all"} _hover={{ cursor: framework.value === value ? "disabled" : "pointer" }} item={framework} key={framework.value}>
                                                                        {framework.label}
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select.Positioner>
                                                    </Portal>
                                                </Select.Root>
                                            </Table.Cell>
                                        </>}
                                        {userRole !== "EMPLOYEE" && role !== "EMPLOYEE" &&
                                            <Table.Cell py={3} px={5} borderLeft={"2px solid"} borderColor={"gray.100"}>
                                                {
                                                    item?.status !== "DELETED" &&
                                                    <>
                                                        <Flex gap={"3"}>
                                                            {
                                                                item.status !== "QUOTED" &&
                                                                <Button p={0} m={0} minW={"auto"} h={"auto"} variant={"plain"} onClick={() => {
                                                                    setSelectedSubscription(item);
                                                                    setSelectedPlan(item?.booking?.plan, item.status, item);
                                                                    setBookingDrawer(true);
                                                                }}>
                                                                    <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content={item.status === "ACTIVE" ? "Extend Subscription" : item.status === "QUOTED" ? "Activate Subscription" : "Renew Subscription"}>
                                                                        <Flex justifyContent={"center"} alignItems={"center"} h={8} w={8} p={1} color={"white"} bg={item.status === "ACTIVE" ? "blue.600" : item.status === "QUOTED" ? "orange.600" : "red.600"} borderRadius={5} >
                                                                            {item.status === "ACTIVE" && <Upgrade />}
                                                                            {item.status === "INACTIVE" && <Renew />}
                                                                            {item.status === "QUOTED" && <Play />}
                                                                        </Flex>
                                                                    </Tooltip>
                                                                </Button>
                                                            }

                                                            {item.status === "QUOTED" &&
                                                                <Button p={0} m={0} minW={"auto"} h={"auto"} variant={"plain"} onClick={() => {
                                                                    onActivateSubscription(item?.id)
                                                                }}>
                                                                    <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content={"Activate Subscription"}>
                                                                        <Flex justifyContent={"center"} alignItems={"center"} h={8} w={8} p={1} color={"white"} bg={"orange.600"} borderRadius={5} >
                                                                            {item.status === "QUOTED" && <Play />}
                                                                        </Flex>
                                                                    </Tooltip>
                                                                </Button>
                                                            }
                                                            <ManageSubscription item={item} />
                                                            <CancelSubscriptionAlert id={item.id} subscriptionName={item.service?.name} />
                                                        </Flex>
                                                    </>
                                                }
                                            </Table.Cell>
                                        }
                                    </Table.Row>
                                })}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                ) : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Subscriptions Found</Flex>
                }
            </Flex>}
            {isSmallScreen && <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1} >
                {subscriptions && subscriptions.length > 0 && subscriptions?.map((item: any, index: any) => {
                    return card(item, index);
                })}
            </Flex>
            }
            {openBookingDrawer && <BookingSummary />}

        </Stack >
    );




};

export default Services;
