import { useEffect } from "react";
import { useHomeStore } from "../../stores/home";
import { Flex, Text, Card, Button, Span } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import BookServices from "../../components/booking"
const Services = () => {

    return (
        <Flex id="pricing" direction={"column"} p={[5, 7, 10]} bg={"rgb(237 233 254)"} gap={[5, 10]} alignItems={"center"} >
            <Text fontSize={[15, 20, 40]} fontWeight={"bold"} color={"dark"} >Our Premium Services</Text>
            <Text w={["100%", "80%", "60%", "40%"]} textAlign={"center"} fontSize={["sm", "lg"]} fontWeight={"500"} color={"blackAlpha.700"} >
                Choose from our carefully curated service packages designed to meet your specific needs
            </Text>
            <Flex w={"100%"} >
                <BookServices />
            </Flex>
        </Flex>
    )
}

export default Services