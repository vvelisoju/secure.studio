import { Flex, Tabs, Text } from "@chakra-ui/react"
import useServiceStore from "../../stores/services"
import PlanCards1 from "./planCards";
// import DateSelection from "./dateSelectDialog";

const BookingTabs = () => {
    const { duration, durations, setDuration, serviceCategories, selectedServiceCategory, setSelectedServiceCategory } = useServiceStore();
    const onChangeTab = (e: any) => {
        setSelectedServiceCategory(serviceCategories.find(category => (category as any).id === e.value))
    }

    return (
        <Flex flexDir={"column"} gap={10}>
            <Tabs.Root containerType={"inline-size"} variant="enclosed" display={"flex"} gap={5}
                flexDir={"column"} alignItems={"center"} flexGrow={1}
                onValueChange={onChangeTab}
                fitted value={(selectedServiceCategory as any)?.id}>
                <Tabs.List w={{ base: "100%", sm: "70%", md: "50%" }}>
                    {
                        serviceCategories?.map((category: any) => {
                            return <Tabs.Trigger fontSize={{ base: 12, sm: 13, md: 15 }} key={category?.id} value={category?.id}>{category?.name}</Tabs.Trigger>
                        })
                    }

                </Tabs.List>
                <Tabs.Root w={"100%"} display={"flex"} justifyContent={"center"} variant="enclosed" value={duration} onValueChange={(e: any) => setDuration(e.value)} >
                    <Tabs.List  >
                        {
                            durations?.map((item: any) => {
                                return <Tabs.Trigger fontSize={{ base: 12, sm: 13, md: 15 }} key={item} value={item}>{item}</Tabs.Trigger>
                            })
                        }
                    </Tabs.List>
                </Tabs.Root>
                {
                    serviceCategories?.map((category: any) => {
                        return (
                            <Tabs.Content as={"div"} key={category?.id}
                                display={"flex"} justifyContent={"center"}
                                value={category?.id} >
                                <PlanCards1 />
                            </Tabs.Content>
                        )
                    })
                }
            </Tabs.Root>
            <Text textAlign={"center"} fontWeight={"500"} color={"blackAlpha.700"}>
                All prices are in INR. GST of 18% will be added to the base price.
            </Text>
        </Flex>
    )
}

export default BookingTabs