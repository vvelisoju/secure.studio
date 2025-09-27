import { Flex, Text, Link, Image, Button } from "@chakra-ui/react";
import LinkdenIcon from "../../assets/linkden.png";
import InstagramIcon from "../../assets/instagram.png";
import FacebookIcon from "../../assets/facebook.png";
import useAuthStore from "../../stores/auth";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    return (
        <Flex
            gap={10}
            flexWrap={"wrap"}
            color={"gray"}
            py={8}
            px={12}
            bg={"#263142"}
            justifyContent={"space-around"}
        >
            <Flex direction={"column"} gap={3} w={300}>
                <Text fontWeight={"500"} fontSize={"md"} color={"light"}>
                    About Us
                </Text>
                <Text fontWeight={"400"} fontSize={"sm"}>
                    Professional workspace solutions for businesses of all
                    sizes.
                </Text>
            </Flex>
            <Flex direction={"column"} gap={3}>
                <Text fontWeight={"500"} fontSize={"md"} color={"light"}>
                    Quick Links
                </Text>
                <Flex direction={"column"} gap={1}>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/"
                    >
                        Services
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/pricing-policy"
                    >
                        Pricing Policy
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/shipping-policy"
                    >
                        Shipping Policy
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/contact"
                    >
                        Contact
                    </Link>
                </Flex>
            </Flex>
            <Flex direction={"column"} gap={3}>
                <Text fontWeight={"500"} fontSize={"md"} color={"light"}>
                    Support
                </Text>
                <Flex direction={"column"} gap={1}>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/help-center"
                    >
                        Help Center
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/faqs"
                    >
                        FAQs
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/terms-and-conditions"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/privacy-policy"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        color={"gray"}
                        fontWeight={"400"}
                        fontSize={"sm"}
                        href="/cancellation-refund-policy"
                    >
                        Refund Policy
                    </Link>
                </Flex>
            </Flex>
            <Flex direction={"column"} gap={3}>
                <Text fontWeight={"500"} fontSize={"md"} color={"light"}>
                    Connect
                </Text>
                <Flex gap={3} alignItems={"center"}>
                    <Link
                        href="https://www.instagram.com/securestudioofficial/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button p={0} variant={"plain"}>
                            <Image src={InstagramIcon} h={9} />
                        </Button>
                    </Link>
                    <Link
                        href="https://www.facebook.com/people/SStudio/61572187624570/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button p={0} variant={"plain"}>
                            <Image src={FacebookIcon} h={9} />
                        </Button>
                    </Link>
                    <Link
                        href="https://www.linkedin.com/company/securestudio2/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button p={0} variant={"plain"}>
                            <Image src={LinkdenIcon} h={9} />
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            {!isAuthenticated && location.pathname !== "/auth" && (
                <Flex direction={"column"} gap={3}>
                    <Text fontWeight={"500"} fontSize={"md"} color={"light"}>
                        Account
                    </Text>
                    <Link href="/auth">
                        <Button
                            size="sm"
                            borderRadius="full"
                            bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                            color="white"
                            px={5}
                            py={2}
                            fontSize="sm"
                            fontWeight="bold"
                            _hover={{
                                bg: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                            }}
                            transition="all 0.3s"
                            boxShadow="0 2px 8px rgba(59, 130, 246, 0.3)"
                        >
                            Sign In
                        </Button>
                    </Link>
                </Flex>
            )}
        </Flex>
    );
};

export default Footer;
