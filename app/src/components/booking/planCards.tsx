import { Flex, Card, Button, Separator, Image, Text, Span, Box, Badge, Tabs, Link } from "@chakra-ui/react"
import useServiceStore from "../../stores/services"
import CheckCircle from "../../assets/checkCircle.svg"
import CurrencyIcon from "../../assets/currency"
import { useSubscriptionsStore } from "../../stores/subscription"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../stores/auth"

const PlanCard = () => {
    const { selectedServices, duration, setSelectedPlan, selectedPlan, setBookingDrawer, getServiceCategories } = useServiceStore();
    const { subscriptionIds, fetchSubscriptions } = useSubscriptionsStore();
    const { setAfterLoginGotTo } = useAuthStore();
    const home = location.pathname;
    const auth = location.pathname;
    const navigate = useNavigate();
    if (![home, auth].includes(location.pathname)) useEffect(() => { fetchSubscriptions(); getServiceCategories(); }, []);

    return (
        <Flex w={"100%"} flexDir={"column"} gap={10}>
            <Flex w={"100%"} justifyContent={"center"} flexWrap={"wrap"} gap={{ base: 3, md: 5 }}>
                {selectedServices.length > 0 &&
                    selectedServices?.map((service: any) => {
                        const recommended = service?.plan?.recommended;
                        const defaultPlan = selectedServices.find((plan: any) => plan?.defaultSelect === true) || selectedServices[0];
                        const plan = service?.plan;
                        const save = plan?.defaultPrice !== plan?.price;
                        const priceDifference = plan.defaultPrice - plan.price;
                        const percentageDifference = (priceDifference / plan.defaultPrice) * 100;
                        return (
                            <Card.Root key={duration + service.id} opacity={subscriptionIds.includes(service?.id) ? 0.5 : 1}
                                pointerEvents={subscriptionIds.includes(service?.id) ? "none" : "all"} pos={"relative"}
                                borderRadius={25} borderColor={recommended ? "dark" : "gray.400"}
                                borderWidth={recommended ? 2 : 1} defaultValue={defaultPlan?.id} containerType={"inline-size"} width={{ base: "100%", sm: "320px" }}
                                flexDir={"column"} display={"flex"}  >
                                {
                                    recommended && <Span h={8} display={"flex"} justifyContent={"center"} alignItems={"center"} fontSize={"0.8em"} color={"white"} p={1} px={5} textAlign={"center"}
                                        borderRadius={15} fontWeight={"400"} bg={"dark"} pos={"absolute"} top={0}
                                        left={"50%"}
                                        transform={"translate(-50%, -50%)"}
                                    >Recommended</Span>
                                }
                                <Card.Header p={"8cqw"} pb={0}>
                                    <Card.Title fontSize={"6cqw"}>{service?.name}</Card.Title>
                                    <Flex flexDir={"column"}>
                                        <Flex alignItems={"center"} gap={1}>
                                            <Flex alignItems={"center"}  >
                                                <Span display={{ base: "none", md: "flex" }} >{CurrencyIcon("25", "25")}</Span>
                                                <Span display={{ md: "none" }} >{CurrencyIcon("18", "18")}</Span>
                                                <Text fontWeight={"bold"} fontSize={"8cqw"} color={"darkLight"} >{plan?.price}</Text>
                                            </Flex>
                                            <Text fontWeight={"500"} fontSize={"4cqw"} color={"gray"} mt={2}>
                                                / 1 {plan?.duration[0] + plan?.duration.slice(1).toLowerCase()}
                                            </Text>
                                        </Flex>
                                        {save && <Flex justifyContent={"space-between"} alignItems={"center"}>
                                            <Flex pos={"relative"} alignItems={"center"} color={"gray"}>
                                                <Box right={-0.5} pos={"absolute"} bg={"gray"} h={0.3} w={"100%"} ></Box>
                                                {CurrencyIcon("16", "16", "gray")}
                                                <Text fontSize={"5cqw"} fontWeight={"500"} >{plan?.defaultPrice.toFixed(2)}</Text>
                                            </Flex>
                                            <Badge colorPalette="green">Save {percentageDifference.toFixed(2)}%</Badge>
                                        </Flex>}
                                    </Flex>
                                    <Separator />
                                </Card.Header>
                                <Card.Body flexDir={"column"} gap={3}>
                                    {
                                        plan?.features.map((feature: any, index: any) => {
                                            return <Flex key={index} gap={3} alignItems={"center"}>
                                                <Image src={CheckCircle} h={23} />
                                                <Text fontSize={"5cqw"}>{feature}</Text>
                                            </Flex>
                                        })
                                    }
                                </Card.Body>
                                <Card.Footer display={"flex"}  >
                                    {home === "/" && <Button onClick={() => { setAfterLoginGotTo(`/subscriptions/book`); setSelectedPlan(plan,"NEW"); navigate("/auth") }} alignSelf={"end"} w={"100%"}>Book Now</Button>}
                                    {home !== "/" && <Button onClick={() => { setSelectedPlan(plan, "NEW"); setBookingDrawer(true); }} alignSelf={"end"} w={"100%"}>{subscriptionIds.includes(service?.id) ? "Service already Exist" : selectedPlan?.id === plan?.id ? "Selected" : "Select Plan"}</Button>}
                                </Card.Footer>
                            </Card.Root>
                        )
                    })
                }
            </Flex >
        </Flex >
    )
}

export default PlanCard