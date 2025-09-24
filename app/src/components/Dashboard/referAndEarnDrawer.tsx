import { Button, CloseButton, Drawer, Portal, Text, Flex, Box } from "@chakra-ui/react"
import PersonPlus from "../../assets/personPlus"
import GroupPersons from "../../assets/groupPersons"
import Rupee from "../../assets/rupee"
const ReferAndEarnDrawer = () => {


    const cards = [
        { id: 1, icon: PersonPlus, title: "Invite Friends", description: "Share your unique referral code with friends and family", color: "blue" },
        { id: 2, icon: GroupPersons, title: "Friends Join", description: "When they sign up using your code and make their first purchase", color: "purple" },
        { id: 3, icon: Rupee, title: "Earn Rewards", description: "You will get ₹1000 in rewards. No limits on referrals!", color: "pink" },
    ]


    const card = (data: any, index: any) => {
        return <Flex key={index} gap={2} flexDir={"column"} borderRadius={10} p={5} bg={`${data.color}.100`}  >
            <Box h={10} w={10} color={`${data?.color}.600`} >{data?.icon()}</Box>
            <Text fontSize={18} fontWeight={"600"}>{data?.title}</Text>
            <Text fontSize={15} color={"blackAlpha.700"} >{data?.description}</Text>
        </Flex>
    }


    return (
        <Drawer.Root  >
            <Drawer.Trigger asChild>
                <Text _hover={{ color: "dark" }} cursor={"pointer"} textDecor={"underline"} fontSize={{ base: 12, md: 14 }} textAlign={"center"} color={"blackAlpha.700"} fontWeight={"600"}>How it works ?</Text>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content containerType={"inline-size"}>
                        <Drawer.Header display={"flex"} flexDir={"row"} alignItems={"center"} justifyContent={"space-between"}>
                            <Drawer.Title>How it Works</Drawer.Title>
                            <Drawer.CloseTrigger asChild focusRing={"none"}  >
                                <CloseButton size="md" />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body display={"flex"} flexDir={"column"} gap={10}>
                            <Flex gap={5} flexDir={"column"}>
                                {cards.map((item: any, index: any) => { return card(item, index) })}
                            </Flex>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default ReferAndEarnDrawer