import { 
    Breadcrumb, Stack, Table, Spinner, Badge, Flex, Button, Text, useBreakpointValue, Icon 
} from "@chakra-ui/react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { useDocumentsStore } from "../stores/documents"
import { convertDatePrimaryStyle } from "../utils/date";
import { useUserStore } from "../stores/users";
import CalenderIcon from "../assets/calender";

const Documents = () => {
    const { documents, loading, fetchDocuments } = useDocumentsStore();
    const { role } = useAuthStore();
    const { setDocumentTab } = useUserStore();


    useEffect(() => {
        fetchDocuments();
    }, []);

    const isSmallScreen = useBreakpointValue({ base: true, sm: false });

    const card = (document: any, index: number) => {
        return (
            <Flex key={index} justifyContent={"space-between"} color={"blackAlpha.700"} 
                py={{ base: "2cqw", md: "1cqw" }} 
                px={{ base: "6cqw", md: "3cqw" }} 
                border={"2px solid"} borderLeft={"5px solid"} 
                borderColor={"blue.100"} borderLeftColor={"blue.400"} borderRadius={10}
            >
                <Flex width={"100%"} flexDir={"column"} gap={{ base: "1cqw", md: "0.5cqw" }}>
                    <Flex width={"100%"} gap={{ base: "4cqw", md: "2cqw" }} alignItems={"center"} justifyContent={"space-between"}>
                        <Text fontSize={{ base: "4cqw", md: "2cqw" }} fontWeight={"600"} >
                            {document?.title}
                        </Text>
                        <Badge fontSize={{ base: "3cqw" }} colorScheme={document.status === "SIGNED" ? "green" : "orange"} >
                            {document?.status}
                        </Badge>
                    </Flex>
                    <Flex width={"100%"} gap={"1cqw"} alignItems={"center"} justifyContent={"space-between"}>
                        <Flex alignItems={"center"} gap={"1cqw"} >
                            <Icon h={"3cqw"} w={"3cqw"} color={"blackAlpha.600"} >
                                {CalenderIcon()}
                            </Icon>
                            <Text fontSize={{ base: "3cqw", md: "1.5cqw" }} fontWeight={"600"} color={"blackAlpha.600"} >
                                {convertDatePrimaryStyle(document?.createdAt)}
                            </Text>
                        </Flex>
                        <NavLink  to={`/documents/${document.id}`} >
                            View
                        </NavLink>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    return (
        <Stack width="full" gap="5" bg={'white'} p={role !== "SUPER_ADMIN" ? 5 : 0} borderRadius={10} flexGrow={1} overflowY={"auto"} >
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                {role !== "SUPER_ADMIN" && (
                    <Breadcrumb.Root size={"lg"}>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <NavLink to={"/documents"} end>
                                    {({ isActive }) => (
                                        <Text fontSize={{ base: 18, md: 20 }} fontWeight={isActive ? "bold" : ""} color={isActive ? "dark" : ""} >
                                            Documents
                                        </Text>
                                    )}
                                </NavLink>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                )}
                <Flex alignSelf={"end"} flexGrow={1} justifyContent={"end"}>
                    {role !== "SUPER_ADMIN" ? (
                        <NavLink to={"/documents/upload"}>
                            <Button px={4} fontSize={{ base: 11, md: 14 }} borderRadius={{ base: 10 }} bg={"blackAlpha.900"}>
                                Upload Document
                            </Button>
                        </NavLink>
                    ) : (
                        <Button onClick={() => setDocumentTab("UPLOAD_DOCUMENT")} px={4} fontSize={{ base: 11, md: 14 }} borderRadius={{ base: 10 }} bg={"blackAlpha.900"}>
                            Upload Document
                        </Button>
                    )}
                </Flex>
            </Flex>

            {!isSmallScreen && (
                <Flex gap={2} flexGrow={1} overflowY={"auto"} flexDir={"column"} justifyContent={"space-between"}>
                    {loading ? (
                        <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1}>
                            <Spinner size="lg" alignSelf="center" />
                        </Flex>
                    ) : documents.length > 0 ? (
                        <Table.ScrollArea borderWidth="1px" rounded="md">
                            <Table.Root size="sm" rounded={"md"} stickyHeader={true}>
                                <Table.Header>
                                    <Table.Row bg={"gray.100"}>
                                        <Table.ColumnHeader p={5} fontSize={"md"} textAlign={"center"}>S.No.</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Title</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Assigned To</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Status</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Created At</Table.ColumnHeader>
                                        <Table.ColumnHeader p={5} fontSize={"md"}>Actions</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {documents.map((doc: any, index: number) => (
                                        <Table.Row bg={index % 2 === 0 ? "" : "gray.100"} key={doc.id} h={1}>
                                            <Table.Cell py={3} px={2} textAlign={"center"}>{index + 1}&#41;</Table.Cell>
                                            <Table.Cell py={3} px={5}>{doc.title}</Table.Cell>
                                            <Table.Cell py={3} px={5}>{doc.assignedTo?.name}</Table.Cell>
                                            <Table.Cell py={3} px={5}>
                                                <Badge colorScheme={doc.status === "SIGNED" ? "green" : "orange"}>{doc.status}</Badge>
                                            </Table.Cell>
                                            <Table.Cell py={3} px={5}>
                                                <Badge>{convertDatePrimaryStyle(doc.createdAt)}</Badge>
                                            </Table.Cell>
                                            <Table.Cell py={3} px={5}>

                                                <NavLink  to={`/documents/${doc.id}`} >
                                                    View
                                                </NavLink>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Table.ScrollArea>
                    ) : (
                        <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1}>No Data Found</Flex>
                    )}
                </Flex>
            )}

            {isSmallScreen && (
                <Flex gap={"2cqw"} flexDir={"column"} flexGrow={1}>
                    {documents && documents.length > 0 && documents.map((doc: any, index: number) => card(doc, index))}
                </Flex>
            )}
        </Stack>
    );
};

export default Documents;
