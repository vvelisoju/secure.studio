import {
    Flex,
    Text,
    Span,
    Button,
    Stack,
    Link,
} from "@chakra-ui/react";
import LocationIcon from "../../assets/location";
import CallIcon from "../../assets/call";
import MailIcon from "../../assets/mail";

const GetInTouch = () => {

    const businessDetails = () => {
        return (
            <Flex gap={5} flexGrow={1} flexDir={["column"]}>
                <Flex alignItems={"center"} gap={3}>
                    <Text
                        fontSize={"lg"}
                        color={"#0d6efd"}
                        fontWeight={"bold"}
                        marginLeft={"2em"}
                    >
                        Secure Studio
                    </Text>
                </Flex>

                <Flex alignItems={"center"} gap={3}>
                    <Span>{LocationIcon("25", "25", "#0d6efd")}</Span>
                    <Text fontSize={"md"}>
                        {" "}
                        3rd Floor, Jakotia Complex, Opp. Ratna Hotel, Pochamma
                        Maidan, Vasavi Colony, Kothawada, Warangal, Telangana
                        506002
                    </Text>
                </Flex>

                <Flex alignItems={"center"} gap={3}>
                    <Span>{CallIcon("25", "25", "#0d6efd")}</Span>
                    <Link
                        href="tel:+919494644848"
                        fontSize={"md"}
                        color={"white"}
                        _hover={{
                            textDecoration: "underline",
                            color: "#0d6efd",
                        }}
                    >
                        +91 9494 64 4848
                    </Link>
                </Flex>

                <Flex alignItems={"center"} gap={3}>
                    <Span>{MailIcon("25", "25", "#0d6efd")}</Span>
                    <Link
                        target="_blank"
                        href="mailto:support@secure.studio"
                        fontSize={"md"}
                        color={"white"}
                        _hover={{
                            textDecoration: "underline",
                            color: "#0d6efd",
                        }}
                    >
                        support@secure.studio
                    </Link>
                </Flex>
            </Flex>
        );
    };

    const businessHours = () => {
        return (
            <Flex
                gap={5}
                flexDir={"column"}
                flexGrow={1}
                p={5}
                bg={"whiteAlpha.100"}
                borderRadius={10}
            >
                <Text color={"#0d6efd"} fontSize={"lg"} fontWeight={"bold"}>
                    Business Hours
                </Text>
                <Flex gap={5} flexDir={"column"} flexGrow={1}>
                    <Flex flexGrow={1} justifyContent={"space-between"}>
                        <Text>Monday - Saturday</Text>
                        <Text>09:00 AM - 08:00 PM</Text>
                    </Flex>
                    <Flex flexGrow={1} justifyContent={"space-between"}>
                        <Text>Sunday</Text>
                        <Text>Closed</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    return (
        <Flex
            id="getinTouch"
            color={"white"}
            bg={"#263142"}
            p={[5, 10]}
            gap={10}
            flexGrow={1}
            flexDir={"column"}
            alignItems={"center"}
        >
            <Text fontSize={30} fontWeight={"bold"}>
                Get in Touch
            </Text>
            <Flex
                flexGrow={1}
                w={["100%", "100%", "80%", "100%"]}
                gap={[5, 5, 5, 10]}
                flexDir={["column", "column", "row"]}
                alignItems={["center"]}
            >
                {/* Map Section */}
                <Flex
                    w={["100%", "80%", "50%"]}
                    flexGrow={1}
                    h={{ base: 300, md: "100%" }}
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7740688661656!2d79.5999349!3d17.989245399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaf65e22ea733c053%3A0x4e201c248142e260!2sSecure%20Studio!5e0!3m2!1sen!2sin!4v1741600529878!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ borderRadius: 10, border: 0 }}
                        loading="lazy"
                    ></iframe>
                </Flex>

                {/* Business Details Section */}
                <Flex
                    fontWeight={"500"}
                    gap={10}
                    p={5}
                    flexDir={"column"}
                    w={["100%", "80%", "50%"]}
                    minH={300}
                >
                    {businessDetails()}
                    {businessHours()}
                </Flex>

                {/* Quick Actions Section */}
                <Flex w={["100%", "80%", "50%"]} minH={300}>
                    <Flex
                        flexGrow={{ base: 1, md: 1 }}
                        bg={"whiteAlpha.100"}
                        px={[3, 6]}
                        py={10}
                        borderRadius={10}
                        flexDir={"column"}
                        gap={6}
                        justifyContent={"center"}
                    >
                        <Text color={"#0d6efd"} fontSize={"xl"} fontWeight={"bold"} textAlign={"center"}>
                            Get Started Today!
                        </Text>
                        
                        {/* Call to Action Buttons */}
                        <Stack gap={4}>
                            <Button
                                as={Link}
                                href="tel:+919494644848"
                                bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                leftIcon={<Text fontSize="18px">📞</Text>}
                                _hover={{
                                    bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                                }}
                                transition="all 0.3s"
                                fontWeight="bold"
                                boxShadow="0 6px 20px rgba(16, 185, 129, 0.3)"
                            >
                                Call Now: +91 9494 64 4848
                            </Button>

                            <Button
                                as={Link}
                                href="https://wa.me/919494644848?text=Hi! I'm interested in booking a workspace at Secure Studio. Can you help me with the details?"
                                target="_blank"
                                bg="linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                leftIcon={<Text fontSize="18px">💬</Text>}
                                _hover={{
                                    bg: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)",
                                }}
                                transition="all 0.3s"
                                fontWeight="bold"
                                boxShadow="0 6px 20px rgba(37, 211, 102, 0.3)"
                            >
                                WhatsApp Us
                            </Button>

                            <Button
                                as={Link}
                                href="mailto:support@secure.studio"
                                bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                leftIcon={<Text fontSize="18px">✉️</Text>}
                                _hover={{
                                    bg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                                }}
                                transition="all 0.3s"
                                fontWeight="bold"
                                boxShadow="0 6px 20px rgba(59, 130, 246, 0.3)"
                            >
                                Email Us
                            </Button>
                        </Stack>

                        {/* Quick Info */}
                        <Flex
                            bg={"whiteAlpha.200"}
                            p={4}
                            borderRadius={10}
                            flexDir={"column"}
                            gap={2}
                            textAlign={"center"}
                        >
                            <Text fontSize={"md"} fontWeight={"bold"} color={"#0d6efd"}>
                                🚀 Why Choose Secure Studio?
                            </Text>
                            <Text fontSize={"sm"}>
                                ✓ First Co-working Space in Warangal
                            </Text>
                            <Text fontSize={"sm"}>
                                ✓ Premium Location & Modern Facilities
                            </Text>
                            <Text fontSize={"sm"}>
                                ✓ Flexible Plans Starting from ₹199
                            </Text>
                            <Text fontSize={"sm"}>
                                ✓ 500+ Happy Customers & Growing
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default GetInTouch;
