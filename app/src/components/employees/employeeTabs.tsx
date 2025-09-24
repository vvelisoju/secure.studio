import { Flex, } from "@chakra-ui/react"
import ProfileCard from "../settings/profileCard";
import CompanyCard from "../settings/companyCard";
import { Tabs } from "@chakra-ui/react"
import { useState } from "react";
import Subscriptions from "../../pages/subscriptions";
import Invoices from "../../pages/invoices";
import BookSubscription from "../booking";
import { useUserStore } from "../../stores/users";
import { useSettingsStore } from "../../stores/settings";
import PaymentConfirmation from "../booking/paymentConfirmation";
const UserTabs = () => {
    const { subscriptionTab, setSubscriptionTab } = useUserStore();
    const { profileDetails } = useSettingsStore();
    const [value, setValue] = useState<string | null>("subscriptions")
    return (
        <Flex maxW={"100%"} gap={5} bg={"white"} flexDir={"column"} alignItems={"center"} flexGrow={1} borderRadius={{ base: 10, md: 10 }}>
            <Tabs.Root gap={10} w={"100%"} variant={"line"} value={value} onValueChange={(e) => setValue(e.value)} >
                <Tabs.List className="settings-tab" >
                    <Tabs.Trigger onClick={() => setSubscriptionTab("SUBSCRIPTIONS")} bg={value === "subscriptions" ? "white" : "transparent"} opacity={value === "subscriptions" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="subscriptions">
                        Subscriptions
                    </Tabs.Trigger>
                    <Tabs.Trigger bg={value === "invoices" ? "white" : "transparent"} opacity={value === "invoices" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="invoices">
                        Invoices
                    </Tabs.Trigger>
                    <Tabs.Trigger bg={value === "profile" ? "white" : "transparent"} opacity={value === "profile" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="profile">
                        Profile
                    </Tabs.Trigger>
                    {profileDetails?.userType === "USER_ADMIN" && profileDetails?.company?.id &&
                        (<Tabs.Trigger bg={value === "company" ? "white" : "transparent"} opacity={value === "company" ? 1 : 0.6} borderTopRadius={10} justifyContent={"center"} value="company">
                            Company
                        </Tabs.Trigger>)
                    }
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
                <Tabs.Content h={"100%"} value="profile">
                    <Flex h={"100%"} >
                        <ProfileCard />
                    </Flex>
                </Tabs.Content>
                <Tabs.Content h={"100%"} value="company">
                    <Flex h={"100%"} >
                        <CompanyCard />
                    </Flex>
                </Tabs.Content>
            </Tabs.Root>

        </Flex>
    )
}

export default UserTabs



