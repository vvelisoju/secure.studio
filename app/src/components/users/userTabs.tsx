import { Flex, } from "@chakra-ui/react"
import ProfileCard from "../settings/profileCard";
import AdvanceHistory from "../settings/securityDepositHistory";
import CompanyCard from "../settings/companyCard";
import { Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import Subscriptions from "../../pages/subscriptions";
import Invoices from "../../pages/invoices";
import BookSubscription from "../booking";
import { useUserStore } from "../../stores/users";
import { useSettingsStore } from "../../stores/settings";
import PaymentConfirmation from "../booking/paymentConfirmation";
import Documents from "../../pages/documents";
import { useSubscriptionsStore } from "../../stores/subscription";
import { useInvoicesStore } from "../../stores/invoice";

const UserTabs = () => {
    const { subscriptionTab, setSubscriptionTab } = useUserStore();
    const { profileDetails } = useSettingsStore();
    const { fetchSubscriptions } = useSubscriptionsStore();
    const { fetchInvoices } = useInvoicesStore();
    const [value, setValue] = useState<string | null>("profile");
    const { fetchProfileDetails } = useSettingsStore();

    useEffect(() => { fetchProfileDetails(); }, []);

    return (
        <Flex maxW={"100%"} gap={5} bg={"white"} flexDir={"column"} alignItems={"center"} flexGrow={1} borderRadius={{ base: 10, md: 10 }}>
            <Tabs.Root gap={10} w={"100%"} variant={"line"} value={value} onValueChange={(e) => setValue(e.value)} >
                <Tabs.List className="settings-tab" >
                    <Tabs.Trigger bg={value === "profile" ? "white" : "transparent"} opacity={value === "profile" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="profile">
                        Profile
                    </Tabs.Trigger>
                    <Tabs.Trigger onClick={() => { setSubscriptionTab("SUBSCRIPTIONS"), fetchSubscriptions() }} bg={value === "subscriptions" ? "white" : "transparent"} opacity={value === "subscriptions" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="subscriptions">
                        Subscriptions
                    </Tabs.Trigger>
                    <Tabs.Trigger onClick={() => { fetchInvoices() }} bg={value === "invoices" ? "white" : "transparent"} opacity={value === "invoices" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="invoices">
                        Invoices
                    </Tabs.Trigger>
                    {/* <Tabs.Trigger bg={value === "documents" ? "white" : "transparent"} opacity={value === "documents" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="documents">
                        Documents
                    </Tabs.Trigger> */}
                    {profileDetails?.userType === "USER_ADMIN" && profileDetails?.company?.id &&
                        (<Tabs.Trigger bg={value === "company" ? "white" : "transparent"} opacity={value === "company" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="company">
                            Company
                        </Tabs.Trigger>)
                    }
                    <Tabs.Trigger bg={value === "advanceHistory" ? "white" : "transparent"} opacity={value === "advanceHistory" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="advanceHistory">
                        Security Deposit History
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content h={"100%"} value="subscriptions">
                    <Flex h={"100%"} >
                        {subscriptionTab === "SUBSCRIPTIONS" && <Subscriptions />}
                        {subscriptionTab === "BOOK_SUBSCRIPTION" && <BookSubscription />}
                        {subscriptionTab === "CONFIRMATION" && <PaymentConfirmation />}
                    </Flex>
                </Tabs.Content>
                <Tabs.Content h={"100%"} value="invoices">
                    <Flex h={"100%"}  >
                        <Invoices />
                    </Flex>
                </Tabs.Content>
                <Tabs.Content h={"100%"} value="documents">
                    <Flex h={"100%"}  >
                        <Documents />
                    </Flex>
                </Tabs.Content>
                <Tabs.Content h={"100%"} value="profile">
                    <Flex h={"100%"} flexDirection={"column"} gap={5}>
                        <ProfileCard />
                    </Flex>
                </Tabs.Content>
                <Tabs.Content h={"100%"} value="company">
                    <Flex h={"100%"} >
                        <CompanyCard />
                    </Flex>
                </Tabs.Content>
                <Tabs.Content h={"100%"} value="advanceHistory">
                    <Flex h={"100%"} flexDirection={"column"} gap={5}>
                        <AdvanceHistory />
                    </Flex>
                </Tabs.Content>
            </Tabs.Root>

        </Flex>
    )
}

export default UserTabs



