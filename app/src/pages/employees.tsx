import { HStack, Heading, Stack, Table, Spinner, Flex, Button, Icon, Text, useBreakpointValue ,Badge} from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../components/ui/pagination";
import { useEffect, useState } from "react";
import { Tooltip } from "../components/ui/tooltip";
import { convertDatePrimaryStyle, convertDateSecondaryStyle } from "../utils/date";
import { useUserStore } from "../stores/users";
import Eye from "../assets/eye";
import { Link } from "react-router-dom";
import AddEmployee from "../components/employees/addEmployee";
import CalenderIcon from "../assets/calender";
import DeleteIcon from "../assets/DeleteIcon";
import { useSubscriptionsStore } from "../stores/subscription";
import { deleteEmployee } from "../api/users";
import { toaster } from "../components/ui/toaster";
const Employees = () => {
    const { employees, page, pageSize, totalPages, loading, fetchEmployees, setPage, setSelectedUser, removeEmployee } = useUserStore();
    useEffect(() => { fetchEmployees(page) }, [page]);
    const isSmallScreen = useBreakpointValue({ base: true, sm: false });
    const [deleteLoading, setLoading] = useState(false);

    const onDeleteEmployee = async (id: any, subId: any) => {
        let toastId: any = toaster.create({ description: "Deleting.....", type: "loading" });
        setLoading(true);
        try {
            const response: any = await deleteEmployee(id, subId);
            toaster.update(toastId, { description: response.message || "Employee Deleted  successfully", type: "success" });
            setLoading(false);
            await fetchEmployees(page);
        } catch (error: any) {
            console.log(error);
            toaster.update(toastId, { description: error?.data?.message || "Employee Deletion Failed", type: "error" });
            setLoading(false);
        } finally {
            setLoading(false);
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

    return (
        <Stack width="full" gap="5" flexGrow={1} bg={'white'} p={[5]} borderRadius={{ base: 10, md: 10 }} >
            <Flex justifyContent={"space-between"} alignItems={"center"} >
                <Heading size="xl">Users</Heading>
                <AddEmployee />
            </Flex>
            {!isSmallScreen && (
                <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                    {loading ? (<Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>)
                        : employees?.length > 0 ? (
                            <Table.ScrollArea borderWidth="1px" rounded="md" >
                                <Table.Root size="sm" rounded={"md"} stickyHeader={true} >
                                    <Table.Header >
                                        <Table.Row bg={"gray.100"}>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Name</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Role</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Email</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Phone</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Gender</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>DOB</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Service Assigned</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Joining Date</Table.ColumnHeader>
                                            <Table.ColumnHeader color={"dark"} fontWeight={"bold"} p={5} fontSize={"md"}>Actions</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {employees.map((item, index) => (
                                            <Table.Row key={index} h={14} >
                                                <Table.Cell py={3} px={2} textAlign={"center"} w={5}  >{item?.serialNumber}&#41;</Table.Cell>
                                                <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content={item?.name}>
                                                    <Table.Cell py={3} px={5} maxW={100} overflow={"hidden"}>
                                                        {item?.name.length > 15 ? item?.name.slice(0, 13) + "..." : item?.name || "-"}
                                                    </Table.Cell>
                                                </Tooltip>
                                                <Table.Cell py={3} px={5}> <Badge colorPalette={item?.userType === "EMPLOYEE" ? "green" : "red" }>{item?.userType ? item?.userType === "EMPLOYEE" ? "Employee" : "Admin" : "-"}</Badge></Table.Cell>
                                                <Table.Cell py={3} px={5}>{item?.email || "-"}</Table.Cell>
                                                <Table.Cell py={3} px={5}>{item?.phone || "-"}</Table.Cell>
                                                <Table.Cell py={3} px={5}>{item?.gender || "-"}</Table.Cell>
                                                <Table.Cell py={3} px={5}>{convertDatePrimaryStyle(item?.dob)}</Table.Cell>
                                                <Table.Cell py={3} px={5}>{item?.subscription?.service?.name || "-"}</Table.Cell>
                                                <Table.Cell py={3} px={5}>{convertDatePrimaryStyle(item?.joiningDate)}</Table.Cell>
                                                <Table.Cell py={3} px={5}>
                                                    <Tooltip openDelay={100} positioning={{ placement: "bottom" }} content="Delete Employee">
                                                        <Button onClick={() => { onDeleteEmployee(item?.id, item?.subscription?.id) }} h={"auto"} minW={"auto"} p={1} bg={"red.600"} >{deleteLoading ? <Spinner /> : <Icon h={5} w={5} >{DeleteIcon()}</Icon>}</Button>
                                                    </Tooltip>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>)
                            : <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} >No Data Found</Flex>}
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
            )}
            {
                isSmallScreen && (
                    <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                        {loading ? (
                            <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} ><Spinner size="lg" alignSelf="center" /></Flex>
                        ) : employees.length > 0 ? (
                            <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1} >
                                {employees && employees.length > 0 && employees?.map((item: any, index: any) => {
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
            }
        </Stack >
    );
};

export default Employees;
