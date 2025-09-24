import { Button, Card, Flex, Text, Span, Separator, StepsRootProvider, useSteps  ,Icon, Box} from "@chakra-ui/react"
import { Avatar } from "../ui/avatar"
import { useEffect } from "react"
import { StepsCompletedContent, StepsContent, StepsItem, StepsList, StepsNextTrigger } from "../ui/steps"
import useServiceCategory from "../../stores/serviceCategory"
import CurrencyIcon from "../../assets/currency"
import TickIcon from "../../assets/tick"
import PaymentSummary from "./paymentSummary"
import PaymentConfirmation from "./paymentConfirmation"
import Schedule from "./schedule"

const Steps = () => {
    const { selectedServiceCategoryId, serviceCategories, selectedServiceId, setSelectedServiceId, selectedPlanId, setSelectedPlanId, setNextStep } = useServiceCategory();

    const selectedCategory = serviceCategories.find((category: any) => category.id === selectedServiceCategoryId);
    const services = (selectedCategory as any)?.services || [];

    const selectedService = services.find((service: any) => service.id === selectedServiceId);
    const plans = (selectedService as any)?.plans || [];


    const renderServices = (service: any) => {
        return (
            <Card.Root key={service.id} width={[340]} boxShadow={"lg"} borderRadius={25} >
                <Card.Body gap={5}>
                    <Flex justifyContent={"space-between"}>
                        <Card.Title mt="2">{service.name}</Card.Title>
                        <Avatar
                            src="https://picsum.photos/200/300"
                            name="Nue Camp"
                            size="lg"
                            shape="rounded"
                        />
                    </Flex>
                    <Card.Description>
                        {service.description || "Description"}
                    </Card.Description>
                </Card.Body>
                <Card.Footer>
                    <StepsNextTrigger asChild>
                        <Button onClick={() => { setSelectedServiceId(service.id) }} flexGrow={1}>view plans</Button>
                    </StepsNextTrigger>
                </Card.Footer>
            </Card.Root>)
    }

    const renderPlans = (plan: any) => {
        return (
            <Card.Root borderRadius={20} key={plan?.id} width={[340]} boxShadow={"lg"}  >
                <Card.Body gap={5}>
                    <Flex gap={2} direction={"column"} alignItems={"center"} justifyContent={"center"}>
                        <Flex alignItems={"center"} >
                            {CurrencyIcon("20", "20")}
                            <Text fontSize={"xs"} fontWeight={"bold"} >
                                {
                                    plan.durationValueSelect === "USER_SELECTED" &&
                                    <>
                                        <Span fontSize={"2xl"} >{plan?.price}</Span>
                                        <Span fontSize={"md"}> / {plan?.duration}</Span>
                                    </>
                                }
                                {
                                    plan.durationValueSelect === "DEFAULT_VALUE" && plan?.defaultValue > 1 &&
                                    <>
                                        <Span fontSize={"2xl"} >{plan?.price}</Span>
                                        <Span fontSize={"md"}> / {plan?.defaultValue + " " + plan?.duration + "S"}</Span>
                                    </>
                                }
                                {
                                    plan.durationValueSelect === "DEFAULT_VALUE" && plan?.defaultValue === 1 &&
                                    <>
                                        <Span fontSize={"2xl"} >{plan?.price}</Span>
                                        <Span fontSize={"md"}> / {plan?.defaultValue + " " + plan?.duration}</Span>
                                    </>
                                }
                            </Text>

                        </Flex>
                        <Separator w={"100%"} size={"md"} />
                        {
                            plan.features.map((feature: string, index: number) => {
                                return (<Flex key={index} alignItems={"center"} justifyContent={"center"} alignSelf={"start"} >
                                    <Box h={10} w={10}> {TickIcon()}</Box>
                                    <Text>  {feature}</Text>
                                </Flex>)
                            })
                        }
                    </Flex>
                </Card.Body>
                <Card.Footer>
                    <StepsNextTrigger asChild>
                        <Button onClick={() => { setSelectedPlanId(plan.id ) }} flexGrow={1}>Choose Plan </Button>
                    </StepsNextTrigger>
                </Card.Footer>
            </Card.Root>)
    }

    const steps = useSteps({ defaultStep: 0, count: 4 });
    const { setStep } = steps;
    useEffect(() => { setNextStep(setStep) }, [])

    return (
        <StepsRootProvider flexGrow={1} id="steps" value={steps} size={"sm"} gap={10} minH={300} minW={"300"}>
            <StepsList p={5} borderRadius={40} bg={"white"} alignSelf={"center"} w={{ base: "100%", md: "90%", lg: "75%", xl: "50%" }} >
                <StepsItem index={0} title="Services" />
                <StepsItem index={1} title="Plans" />
                <StepsItem index={2} title="Schedule" />
                <StepsItem index={3} title="Payment" />
            </StepsList>

            <StepsContent display={"flex"} gap={10} index={0} justifyContent={"center"}  >
                {services.map((service: any) => {
                    return renderServices(service)
                })}
            </StepsContent>
            <StepsContent index={1} display={"flex"} gap={10} justifyContent={"center"} flexWrap={"wrap"}  >
                {selectedServiceId &&
                    plans.map((plan: any) => {
                        return renderPlans(plan)
                    })
                }
            </StepsContent>
            <StepsContent index={2} display={"flex"} gap={10} flexGrow={1} justifyContent={"center"} >
                {selectedPlanId &&
                    <Schedule />
                }
            </StepsContent>
            <StepsContent index={3} display={"flex"} justifyContent={"center"} >
                {selectedPlanId && <PaymentSummary />}
            </StepsContent>
            <StepsCompletedContent flexGrow={1} display={"flex"} justifyContent={"center"}>
                <PaymentConfirmation />
            </StepsCompletedContent>

        </StepsRootProvider>
    )
}


export default Steps