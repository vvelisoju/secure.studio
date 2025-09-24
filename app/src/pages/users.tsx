import {
    HStack, Heading, Stack, Table, Spinner, Flex, Button, Icon, Text,
    ActionBar, Checkbox, Kbd, Input, Portal, Box, useBreakpointValue,
    Span, Menu, Collapsible,
    Group,
    SkeletonText
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../components/ui/pagination";
import { useEffect, useState } from "react";
import { Tooltip } from "../components/ui/tooltip";
import { convertDatePrimaryStyle, convertDateSecondaryStyle, getDaysBetweenUTC } from "../utils/date";
import { useUserStore } from "../stores/users";
import Eye from "../assets/eye";
import { Link, useLocation } from "react-router-dom";
import AddUser from "../components/users/addUser";
import CalenderIcon from "../assets/calender";
import { useNavigate } from "react-router-dom";
import UserIcon from "../assets/users";
import { InputGroup } from "../components/ui/input-group";
import { createListCollection } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../components/ui/select";
import AddUserIcon from "../assets/addUser";
import Filter from "../assets/filter";
import { Badge, } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Profile from "../assets/demo-profile.png";
import { getUserType } from "../utils/misc";
import Star from "../assets/star";
import Circle from "../assets/circle";
import Dangerous from "../assets/dangerous";
import Notification from "../assets/notification";
import ArrowForward from "../assets/arrowForward";
import { Field } from "../components/ui/field";
import Search from "../assets/search";
import TickIcon from "../assets/tick";
import FiltersDialog from "../components/users/filtersDialog";
import WrongIcon from "../assets/wrong";
import DeleteIcon from "../assets/DeleteIcon";
import MailIcon from "../assets/mailIcon";
import { toaster } from "../components/ui/toaster";
import DeleteUserAlert from "../components/users/deleteAlert";
import Renew from "../assets/renew";
import { updateUserStatus } from "../api/users";
import { useSettingsStore } from "../stores/settings";
const Users = () => {

    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';
    const isUsers = location.pathname === '/users';
    const { users, page, pageSize, totalPages, loading,
        fetchUsers, setPage, setSelectedUser, search,
        setSearch, filters, removeFilter, clearFilters, clearSearch,
        sendSubscriptionStatusMail, sendSubscriptionStatusMails,
    } = useUserStore();
    const { reset } = useSettingsStore();
    useEffect(() => {
        if (loading) {
            return;
        }
        fetchUsers(page, isDashboard ? "DASHBOARD" : "USERS")
        // reset();
    }, [page]);

    useEffect(() => {
        return () => {
            clearFilters(); // ← Cleanup logic
        };
    }, []);

    console.log("count", totalPages);

    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const navigate = useNavigate();
    const [selection, setSelection] = useState<string[]>([])
    const hasSelection = selection.length > 0;
    const indeterminate = hasSelection && selection.length < users.length;


    const onSendMail = async (id: any) => {
        let toastId: any = toaster.create({ description: "sending.....", type: "loading" });
        try {
            const response: any = await sendSubscriptionStatusMail(id);
            toaster.update(toastId, { description: response.message || "Mail sent successfully", type: "success" });
        } catch (error: any) {
            toaster.update(toastId, { description: error?.data?.message || "Mail sent Failed", type: "error" });
        } finally {
        }
    }

    const onSendMails = async (ids: any) => {
        let toastId: any = toaster.create({ description: "sending.....", type: "loading" });
        try {
            const response: any = await sendSubscriptionStatusMails(ids);
            toaster.update(toastId, { description: response.message || "Mails sent successfully", type: "success" });
        } catch (error: any) {
            toaster.update(toastId, { description: error?.data?.message || "Mails sent Failed", type: "error" });
        }
    }


    const onEditStatus = async (id: string, data: any) => {
        let toastId: any = toaster.create({ description: "Reviving.....", type: "loading" });
        try {
            const response: any = await updateUserStatus({ id, ...data });
            toaster.update(toastId, { description: response.message || "Revived user successfully", type: "success" });
        } catch (error: any) {
            toaster.update(toastId, { description: error?.data?.message || "User Revive Failed", type: "error" });
        } finally {
            fetchUsers(page, isDashboard ? "DASHBOARD" : "USERS")
        }
    }


    const card = (details: any, index: any) => {
        return (
            <Flex key={index} alignItems={"center"} justifyContent={"space-between"} color={"blackAlpha.700"} py={"2cqw"} px={"3cqw"}
                border={"2px solid"} borderColor={"blackAlpha.200"} borderLeft={"5px solid"} borderLeftColor={"blackAlpha.600"} borderRadius={10}>
                <Flex flexDir={"column"}>
                    <Text fontWeight={"bold"} fontSize={"3.5cqw"}>{details?.name}</Text>
                    <Flex alignItems={"center"} gap={"1cqw"} >
                        <Icon h={"3cqw"} w={"3cqw"} color={"blackAlpha.600"} >{CalenderIcon()}</Icon>
                        <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"} color={"blackAlpha.600"} >{convertDateSecondaryStyle(details?.createdAt)}</Text>
                    </Flex>
                </Flex>
                <Link to={`/users/${details?.name.replace(/\s+/g, '')}`}>
                    <Button onClick={() => setSelectedUser(details)} bg={"blackAlpha.700"} minH={"auto"} minW={"auto"} p={2} borderRadius={5}>
                        <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="View Details">
                            <Icon h={"20px"} w={"20px"} color={"White"} >{Eye()}</Icon>
                        </Tooltip>
                    </Button>
                </Link>
            </Flex>
        )
    }
    const rows = users.map((item, index) => (
        <Table.Row key={index}
            data-selected={selection.includes(item.id) ? "" : undefined}
            h={14}
        >
            <Table.Cell>
                <Checkbox.Root
                    size="sm"
                    top="0.5"
                    aria-label="Select row"
                    checked={selection.includes(item.id)}
                    onCheckedChange={(changes) => {
                        setSelection((prev) =>
                            changes.checked
                                ? [...prev, item.id]
                                : selection.filter((id) => id !== item.id),
                        )
                    }}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                </Checkbox.Root>
            </Table.Cell>
            <Table.Cell _hover={{ bg: "gray.100", cursor: "pointer" }} onClick={() => { navigate(`/users/${item?.name}`); setSelectedUser(item) }} py={3} px={5}>
                <Flex gap={2}>
                    <Avatar.Root>
                        <Avatar.Fallback name={item?.name || "-"} />
                        <Avatar.Image src={item?.imageUrl || Profile} />
                    </Avatar.Root>
                    <Flex flexDirection={"column"}>
                        <Text>{item?.name || "-"}</Text>
                        <Text fontWeight={500} fontSize={"xs"} color={"blackAlpha.600"} >{item?.email || "-"}</Text>
                    </Flex>
                </Flex>
            </Table.Cell>
            <Table.Cell py={3} px={5}>{item?.company?.name || "-"}</Table.Cell>
            <Table.Cell py={3} px={5}>{getUserType(item?.userType) || "-"}</Table.Cell>
            <Table.Cell py={3} px={5}>
                <Flex flexDir={"column"} gap={1}>
                    {
                        item?.UserSubscriptions.length >= 1 &&
                        item?.UserSubscriptions.map((item: any, index: any) => {

                            if (item?.subscription?.status === "ACTIVE" && getDaysBetweenUTC(item?.subscription?.endTime) > 3) {
                                return <Flex key={index} w={"100%"} alignItems={"center"} justifyContent={"space-between"} bg={"green.100"} borderRadius={5} p={1} px={3} >
                                    <Text fontSize={"xs"} color={"blackAlpha.800"} fontWeight={"500"}   >{item.subscription?.service?.name || "-"}</Text>
                                    <Span  ><Badge fontSize={"xs"} fontWeight={600} colorPalette={"green"} py={1} px={2}><Box h={3.5} w={3.5}>{Circle()}</Box > Active</Badge></Span>
                                </Flex>
                            } else if (item?.subscription?.status === "ACTIVE" && getDaysBetweenUTC(item?.subscription?.endTime) <= 3) {
                                return <Flex key={index} w={"100%"} alignItems={"center"} justifyContent={"space-between"} bg={"orange.100"} borderRadius={5} p={1} px={3} >
                                    <Text fontSize={"xs"} color={"blackAlpha.800"} fontWeight={"500"}   >{item.subscription?.service?.name || "-"}</Text>
                                    <Span ><Badge fontSize={"xs"} fontWeight={600} color={"orange.600"} py={1} px={2}><Box h={3.5} w={3.5}>{Notification()}</Box> Expires soon</Badge></Span>
                                </Flex>
                            } else if (item?.subscription?.status === "INACTIVE") {
                                return <Flex key={index} w={"100%"} alignItems={"center"} justifyContent={"space-between"} bg={"red.100"} borderRadius={5} p={1} px={3} >
                                    <Text fontSize={"xs"} color={"blackAlpha.800"} fontWeight={"500"}   >{item.subscription?.service?.name || "-"}</Text>
                                    <Span ><Badge fontSize={"xs"} fontWeight={600} colorPalette={"red"} py={1} px={2}><Box h={3.5} w={3.5}>{Dangerous()}</Box> Expired</Badge></Span>
                                </Flex>
                            }
                        })
                    }
                    {item?.UserSubscriptions.length == 0 && "-"}
                </Flex>
            </Table.Cell>
            <Table.Cell py={3} px={5}>{
                <Flex flexDir={"column"} gap={1}>
                    {item?.UserSubscriptions.length === 0 && "-"}
                    {item?.UserSubscriptions.length >= 1 &&
                        item?.UserSubscriptions.map((item: any, index: any) => {
                            const days = getDaysBetweenUTC(item?.subscription?.endTime);
                            if (days > 3) {
                                return <Text key={index} >{days} days</Text>

                            } else if (days <= 3 && days > 0) {
                                return <Flex key={index} gap={1} alignItems={"center"} color={"orange.600"}>
                                    <Text >{days} days</Text>
                                </Flex>

                            } else if (days === 0) {
                                return <Text key={index} color={"red"} >{days} days</Text>
                            }
                        })
                    }
                </Flex>

            }</Table.Cell>
            <Table.Cell py={3} px={5}>
                <Flex flexDir={"column"} gap={1}>
                    {item?.status === "ACTIVE" && <Span key={index} ><Badge fontSize={"xs"} fontWeight={600} colorPalette={"green"} py={1} px={2}> Active</Badge></Span>}
                    {item?.status === "INACTIVE" && <Span key={index}><Badge fontSize={"xs"} fontWeight={600} colorPalette={"red"} py={1} px={2}> In Active</Badge></Span>}
                </Flex>

            </Table.Cell>
            <Table.Cell py={3} px={5}>
                <Flex justifyContent={"end"} gap={3}>
                    {
                        item?.UserSubscriptions.length > 0 &&
                        <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Send Email">
                            <Button onClick={() => { onSendMail(item.id) }} variant={"ghost"} p={0} h={"auto"} minW={"auto"} w={"auto"} >
                                <Box color={"secondary"} >{MailIcon()}</Box>
                            </Button>
                        </Tooltip>

                    }
                    {
                        item.status === "ACTIVE" ?
                            <DeleteUserAlert mode="single" id={item.id} userName={item.name} />
                            :
                            <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Revive user">
                                <Button onClick={() => { onEditStatus(item.id, { status: "ACTIVE" }) }} variant={"ghost"} p={0} h={"auto"} minW={"auto"} w={"auto"} >
                                    <Box color={"secondary"} >{Renew()}</Box>
                                </Button>
                            </Tooltip>
                    }
                </Flex>
            </Table.Cell>
        </Table.Row>
    ))



    return (
        <Stack minH={400} width="full" gap="5" flexGrow={1} bg={'white'} p={[5]} borderRadius={{ base: 10, md: 10 }} >
            <Flex justifyContent={"space-between"} alignItems={"center"} >
                <Flex alignItems={"center"} gap={2}>
                    <Box color={"primary"} h={6} w={6} >{UserIcon()}</Box>
                    {
                        isUsers && <Heading size="xl">User Management ({totalPages})</Heading>
                    }
                    {
                        isDashboard && <Heading size="xl">Upcoming Renewals</Heading>
                    }
                </Flex>
                {
                    isUsers && <AddUser />
                }
            </Flex>
            {
                isUsers && <Flex alignItems={"center"} gap={3} border={"1px solid"} borderColor={"gray.200"} rounded={"xl"} p={2} >
                    <Box w={"100%"} flexGrow={1}>
                        <Group width={"100%"} display={"flex"} alignItems={"center"} >
                            <Flex h={8} w={8} alignItems={"center"} justifyContent={"center"} >{loading ? <Spinner size="sm" alignSelf="center" /> : Search()}</Flex>
                            <Input border={0} placeholder="Search by name or email" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                            {search.length > 0 &&
                                <Button onClick={() => clearSearch("")} p={0} bg={0} h={"auto"} minW={"auto"} >
                                    <Box >{WrongIcon()}</Box>
                                </Button>
                            }
                            <FiltersDialog />
                        </Group>
                    </Box>
                </Flex>
            }

            {filters.length > 0 && isUsers &&
                <Flex gap={3} flexWrap={"wrap"} >
                    {
                        filters.map((item: any, index: any) => {
                            return <Flex key={index} gap={2} alignItems={"center"} rounded={"2xl"} px={4} py={1} border={"1px solid"} borderColor={"gray.200"}>
                                <Text fontWeight={500} fontSize={"sm"} color={"blackAlpha.800"} >{item.label}</Text>
                                <Button onClick={() => { removeFilter(item) }} p={0} bg={0} h={"auto"} minW={"auto"} >
                                    <Box >{WrongIcon()}</Box>
                                </Button>
                            </Flex>
                        })
                    }
                </Flex>
            }
            <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"} padding={1}>
                {loading ? (<Flex justifyContent={"center"} alignItems={"start"} flexGrow={1} >
                    <SkeletonText noOfLines={8} gap="4" height="10" />
                </Flex>)
                    : users?.length > 0 ? (
                        <Table.ScrollArea boxShadow={"md"} rounded="xl" >
                            <Table.Root size="md" rounded={"md"} stickyHeader={true} >
                                <Table.Header >
                                    <Table.Row bg={"gray.100"} fontSize={"sm"}>
                                        <Table.ColumnHeader w="6" >
                                            <Checkbox.Root
                                                size="sm"
                                                top="0.5"
                                                aria-label="Select all rows"
                                                checked={indeterminate ? "indeterminate" : selection.length > 0}
                                                onCheckedChange={(changes) => {
                                                    setSelection(
                                                        changes.checked ? users.map((item) => item.id) : [],
                                                    )
                                                }}
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                            </Checkbox.Root>
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5}>User</Table.ColumnHeader>
                                        <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5}>Company</Table.ColumnHeader>
                                        <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5}>Usertype</Table.ColumnHeader>
                                        <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5}>Subscription</Table.ColumnHeader>
                                        <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5}>Expires</Table.ColumnHeader>
                                        <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5}>Status</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign={"end"} color={"dark"} fontWeight={"bold"} p={5}>Actions</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>{rows}</Table.Body>
                            </Table.Root>

                            <ActionBar.Root open={hasSelection}  >
                                <Portal>
                                    <ActionBar.Positioner>
                                        <ActionBar.Content boxShadow={"md"}  >
                                            <ActionBar.SelectionTrigger bg={"white"} >
                                                {selection.length} selected
                                            </ActionBar.SelectionTrigger>
                                            <ActionBar.Separator />
                                            <DeleteUserAlert mode="multiple" ids={selection} reset={setSelection} />
                                            <Button onClick={(() => { onSendMails(selection), setSelection([]) })} variant="outline" size="sm">
                                                Send Email <Kbd>{MailIcon()}</Kbd>
                                            </Button>
                                        </ActionBar.Content>
                                    </ActionBar.Positioner>
                                </Portal>
                            </ActionBar.Root>
                        </Table.ScrollArea>)
                        : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>}
                <PaginationRoot size={"xs"}
                    alignSelf={"end"}
                    count={totalPages}
                    pageSize={pageSize}
                    defaultPage={page}
                    variant="solid"
                    colorPalette={"blue"}
                    onPageChange={(e) => {
                        setPage(e.page)
                    }}
                >
                    <HStack opacity={loading ? 0.5 : 1} pointerEvents={loading ? "none" : "all"} wrap="wrap">
                        <PaginationPrevTrigger />
                        <PaginationItems />
                        <PaginationNextTrigger />
                    </HStack>
                </PaginationRoot>
            </Flex>

            {/* {!isSmallScreen && (
               
            )}
            {
                isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : users.length > 0 ? (
                            <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1} >
                                {users && users.length > 0 && users?.map((item: any, index: any) => {
                                    return card(item, index);
                                })}
                            </Flex>

                        ) : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>
                        }
                        <PaginationRoot
                            alignSelf={"end"}
                            count={totalPages}
                            pageSize={pageSize}
                            defaultPage={page}
                            variant="solid"
                            onPageChange={(e) => {
                                setPage(e.page)
                            }}
                        >
                            <HStack wrap="wrap">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </HStack>
                        </PaginationRoot>
                    </Flex>
                )
            } */}
        </Stack >
    );
};

export default Users;
