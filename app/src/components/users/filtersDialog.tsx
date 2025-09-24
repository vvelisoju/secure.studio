import { Button, Input, Dialog, Portal, Box, Flex, Text, CloseButton, CheckboxCard, CheckboxGroup, Span } from "@chakra-ui/react"
import Filter from "../../assets/filter";
import { useUserStore } from "../../stores/users";
import { useEffect } from "react";

const subscriptionStatusArray = [
    { value: "ACTIVE", title: "Active" },
    { value: "INACTIVE", title: "Inactive" },
    { value: "TRIAL", title: "Trial" },
];

const userStatusArray = [
    { value: "ACTIVE", title: "Active" },
    { value: "INACTIVE", title: "Inactive" },
];

const userTypesArray = [
    { value: "USER", title: "Individual" },
    { value: "USER_ADMIN", title: "Company" },
    { value: "EMPLOYEE", title: "Employee" },
]

const invoiceArray = [
    { value: "INVOICE", title: "Invoice" },
    { value: "TAX_INVOICE", title: "Tax Invoice" },
]

const FiltersDialog = () => {

    const { userStatus, setUserStatus, setFilters, subscriptionStatus, setSubscriptionStatus,
        userTypes, setuserTypes, joiningFrom, invoiceTypes, setInvoiceTypes,
        setJoiningFrom, joiningTo, setJoiningTo, filters } = useUserStore();
    const { openFilters, setOpenFilters, clearFilters } = useUserStore();

    const onApplyFilters = () => {
        const newFilters = [];
        subscriptionStatus.forEach((val: string) => {
            const label = subscriptionStatusArray.find((f: any) => f.value === val)?.title || val;
            newFilters.push({ type: "subscriptionStatus", label: `Subscription ${label}`, value: val });
        });

        userStatus.forEach((val: string) => {
            const label = userStatusArray.find((f: any) => f.value === val)?.title || val;
            newFilters.push({ type: "userStatus", label: `User ${label}`, value: val });
        });

        userTypes.forEach((val: string) => {
            const label = userTypesArray.find((f) => f.value === val)?.title || val;
            newFilters.push({ type: "userType", label, value: val });
        });

        invoiceTypes.forEach((val: string) => {
            const label = invoiceArray.find((f) => f.value === val)?.title || val;
            newFilters.push({ type: "invoiceType", label, value: val });
        });

        if (joiningFrom) newFilters.push({ type: "joiningFrom", label: `Joining From: ${joiningFrom}`, value: joiningFrom });
        if (joiningTo) newFilters.push({ type: "joiningTo", label: `Joining To: ${joiningTo}`, value: joiningTo });
        setFilters(newFilters);
    }

    return (
        <Dialog.Root lazyMount open={openFilters} onOpenChange={(e) => setOpenFilters(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant={"ghost"} >
                    {filters.length > 0 && <Span borderRadius={"50%"} h={2} w={2} bg={"primary"} ></Span>}
                    <Box >{Filter()}</Box> Filters
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header   >
                            <Dialog.Title>Users Filter</Dialog.Title>
                            <Dialog.CloseTrigger asChild >
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body p={8} pt={0} display={"flex"} flexDir={"column"} gap={5}>
                            <Flex flexDir={"column"} fontWeight={"500"} >
                                <Text>Joining Date</Text>
                                <Flex alignItems={"center"} w={"100%"} gap={2}>
                                    <Input value={joiningFrom} onChange={(e) => { setJoiningFrom(e.target.value) }} type="Date" />
                                    <Text>To</Text>
                                    <Input value={joiningTo} onChange={(e) => { setJoiningTo(e.target.value) }} type="Date" />
                                </Flex>
                            </Flex>
                            <Flex flexDir={"column"} fontWeight={"500"} >
                                <Text>User Status</Text>
                                <CheckboxGroup value={userStatus} color="blackAlpha.700"
                                    onValueChange={(value) => { setUserStatus(value); }}
                                >
                                    <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {userStatusArray.map((item: any) => (
                                            <CheckboxCard.Root key={item.value}
                                                value={item.value}
                                                variant="surface"
                                                colorPalette="blue"
                                                maxW={"-webkit-fit-content"}
                                            >
                                                <CheckboxCard.HiddenInput />
                                                <CheckboxCard.Control py={1} px={3}>
                                                    <CheckboxCard.Content>
                                                        <CheckboxCard.Label >{item.title}</CheckboxCard.Label>
                                                    </CheckboxCard.Content>
                                                </CheckboxCard.Control>
                                            </CheckboxCard.Root>
                                        ))}
                                    </Flex>
                                </CheckboxGroup>
                            </Flex>
                            <Flex flexDir={"column"} fontWeight={"500"} >
                                <Text>Subscription Status</Text>
                                <CheckboxGroup value={subscriptionStatus} color="blackAlpha.700"
                                    onValueChange={(value) => {
                                        setSubscriptionStatus(value);
                                    }}
                                >
                                    <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {subscriptionStatusArray.map((item: any) => (
                                            <CheckboxCard.Root key={item.value}
                                                value={item.value}
                                                variant="surface"
                                                colorPalette="blue"
                                                maxW={"-webkit-fit-content"}
                                            >
                                                <CheckboxCard.HiddenInput />
                                                <CheckboxCard.Control py={1} px={3}>
                                                    <CheckboxCard.Content>
                                                        <CheckboxCard.Label >{item.title}</CheckboxCard.Label>
                                                    </CheckboxCard.Content>
                                                </CheckboxCard.Control>
                                            </CheckboxCard.Root>
                                        ))}
                                    </Flex>
                                </CheckboxGroup>
                            </Flex>
                            <Flex flexDir={"column"} fontWeight={"500"} >
                                <Text>User Type</Text>
                                <CheckboxGroup value={userTypes} color="blackAlpha.700"
                                    onValueChange={(value) => { setuserTypes(value); }}
                                >
                                    <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {userTypesArray.map((item: any) => (
                                            <CheckboxCard.Root key={item.value}
                                                value={item.value}
                                                variant="surface"
                                                colorPalette="blue"
                                                maxW={"-webkit-fit-content"}
                                            >
                                                <CheckboxCard.HiddenInput />
                                                <CheckboxCard.Control py={1} px={3}>
                                                    <CheckboxCard.Content>
                                                        <CheckboxCard.Label >{item.title}</CheckboxCard.Label>
                                                    </CheckboxCard.Content>
                                                </CheckboxCard.Control>
                                            </CheckboxCard.Root>
                                        ))}
                                    </Flex>
                                </CheckboxGroup>
                            </Flex>
                            <Flex flexDir={"column"} fontWeight={"500"} >
                                <Text>Invoice</Text>
                                <CheckboxGroup value={invoiceTypes} color="blackAlpha.700"
                                    onValueChange={(value) => { setInvoiceTypes(value); }}
                                >
                                    <Flex gap="2" mt={2} flexWrap={"wrap"} justifyContent={"start"} alignItems={"center"}>
                                        {invoiceArray.map((item: any) => (
                                            <CheckboxCard.Root key={item.value}
                                                value={item.value}
                                                variant="surface"
                                                colorPalette="blue"
                                                maxW={"-webkit-fit-content"}
                                            >
                                                <CheckboxCard.HiddenInput />
                                                <CheckboxCard.Control py={1} px={3}>
                                                    <CheckboxCard.Content>
                                                        <CheckboxCard.Label >{item.title}</CheckboxCard.Label>
                                                    </CheckboxCard.Content>
                                                </CheckboxCard.Control>
                                            </CheckboxCard.Root>
                                        ))}
                                    </Flex>
                                </CheckboxGroup>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button onClick={clearFilters} variant="outline">Clear</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={onApplyFilters} >Apply</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default FiltersDialog