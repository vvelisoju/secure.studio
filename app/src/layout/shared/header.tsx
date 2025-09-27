import { Flex, Image, Button, Link, Box, Span, Text } from "@chakra-ui/react";

// Add CSS for pulse animation
const pulseKeyframes = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);
}
import logo from "../../assets/logo-lg.png";
import useAuthStore from "../../stores/auth";
import { useLocation } from "react-router-dom";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu";
import MenuIcon from "../../assets/menu";
import { useEffect, useState } from "react";
import { ContactModal } from "../../components/ui/modal";

const Header = () => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1)); // Remove `#`
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]); // Runs whenever location changes

    const handleContactClick = () => {
        setIsContactModalOpen(true);
    };

    return (
        <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            py={[3, 4]}
            px={[4, 8, 12]}
            bg="white"
            boxShadow="0 2px 10px rgba(0,0,0,0.1)"
            position="sticky"
            top={0}
            zIndex={1000}
            borderBottom="1px solid"
            borderColor="gray.200"
        >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Link
                    href="/"
                    outline={"none"}
                    _hover={{ transform: "scale(1.02)" }}
                    transition="all 0.2s"
                >
                    <Image src={logo} h={[10, 12]} />
                </Link>
            </Flex>

            <Flex
                display={{ base: "none", lg: "flex" }}
                gap={6}
                alignItems={"center"}
                fontSize={"sm"}
                fontWeight="500"
            >
                {location.pathname === "/auth" && (
                    <Link
                        href="/"
                        color="gray.700"
                        _hover={{
                            color: "blue.600",
                            transform: "translateY(-1px)",
                        }}
                        transition="all 0.2s"
                        outline={"none"}
                        _focus={{ outlineColor: "transparent" }}
                    >
                        Home
                    </Link>
                )}

                <Link
                    href="/#services"
                    color="gray.700"
                    _hover={{
                        color: "blue.600",
                        transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    outline={"none"}
                    _focus={{ outlineColor: "transparent" }}
                >
                    Services
                </Link>
                <Box position="relative">
                    <Link
                        href="/#hourly-packages"
                        color="gray.700"
                        _hover={{
                            color: "blue.600",
                            transform: "translateY(-1px)",
                        }}
                        transition="all 0.2s"
                        outline={"none"}
                        _focus={{ outlineColor: "transparent" }}
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        Special Plans
                        <Box
                            bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                            color="white"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="bold"
                            animation="pulse 2s infinite"
                        >
                            NEW
                        </Box>
                    </Link>
                </Box>
                <Box position="relative">
                    <Link
                        href="/#ondemand-packages"
                        color="gray.700"
                        _hover={{
                            color: "blue.600",
                            transform: "translateY(-1px)",
                        }}
                        transition="all 0.2s"
                        outline={"none"}
                        _focus={{ outlineColor: "transparent" }}
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        On-Demand Meetings
                        <Box
                            bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            color="white"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="bold"
                            animation="pulse 2s infinite"
                        >
                            HOT
                        </Box>
                    </Link>
                </Box>
                <Link
                    href="/#plans"
                    color="gray.700"
                    _hover={{
                        color: "blue.600",
                        transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    outline={"none"}
                    _focus={{ outlineColor: "transparent" }}
                >
                    Plans
                </Link>
                <Link
                    href="/#amenities"
                    color="gray.700"
                    _hover={{
                        color: "blue.600",
                        transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    outline={"none"}
                    _focus={{ outlineColor: "transparent" }}
                >
                    Amenities
                </Link>
                <Link
                    href="/#getinTouch"
                    color="gray.700"
                    _hover={{
                        color: "blue.600",
                        transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                    outline={"none"}
                    _focus={{ outlineColor: "transparent" }}
                >
                    Contact Us
                </Link>
            </Flex>

            <Flex gap={{ base: 2, sm: 3, md: 4 }} alignItems={"center"}>
                {/* Call Now Button */}
                <Link href="tel:+919494644848">
                    <Button
                        size={{ base: "sm", md: "md" }}
                        bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        color="white"
                        borderRadius="full"
                        px={{ base: 4, md: 6 }}
                        py={{ base: 2, md: 3 }}
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="bold"
                        
                        _hover={{
                            bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                        }}
                        transition="all 0.3s"
                        boxShadow="0 2px 8px rgba(16, 185, 129, 0.3)"
                    >
                        <Flex align="center" gap={2}>
                            <Box fontSize={{ base: "14px", md: "16px" }}>📞</Box>
                            <Text>Call Now: 9494 64 4848</Text>
                        </Flex>
                    </Button>
                </Link>

                {isAuthenticated && (
                    <Link href="/dashboard">
                        <Button
                            size="sm"
                            borderRadius="full"
                            bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                            color="white"
                            px={{ base: 3, md: 5 }}
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
                            Dashboard
                        </Button>
                    </Link>
                )}

                {/* Mobile Menu */}
                <Box display={{ lg: "none" }}>
                    <MenuRoot>
                        <MenuTrigger
                            display={"flex"}
                            justifyContent={"center"}
                            asChild
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                p={2}
                                _hover={{ bg: "gray.100" }}
                                borderRadius="md"
                            >
                                {MenuIcon("20", "20")}
                            </Button>
                        </MenuTrigger>
                        <MenuContent
                            bg="white"
                            boxShadow="xl"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            py={2}
                        >
                            {isAuthenticated && (
                                <MenuItem value="Dashboard">
                                    <Link
                                        fontWeight={"500"}
                                        href="/dashboard"
                                        color="gray.700"
                                        _hover={{ color: "blue.600" }}
                                        outline={"none"}
                                        _focus={{ outlineColor: "transparent" }}
                                    >
                                        Dashboard
                                    </Link>
                                </MenuItem>
                            )}
                            {location.pathname === "/auth" && (
                                <MenuItem value="Home">
                                    <Link
                                        fontWeight={"500"}
                                        href="/"
                                        color="gray.700"
                                        _hover={{ color: "blue.600" }}
                                        outline={"none"}
                                        _focus={{ outlineColor: "transparent" }}
                                    >
                                        Home
                                    </Link>
                                </MenuItem>
                            )}
                            <MenuItem value="Services">
                                <Link
                                    fontWeight={"500"}
                                    href="/#services"
                                    color="gray.700"
                                    _hover={{ color: "blue.600" }}
                                    outline={"none"}
                                    _focus={{ outlineColor: "transparent" }}
                                >
                                    Services
                                </Link>
                            </MenuItem>
                            <MenuItem value="Special Plans">
                                <Flex align="center" gap={2} w="100%">
                                    <Link
                                        fontWeight={"500"}
                                        href="/#hourly-packages"
                                        color="gray.700"
                                        _hover={{ color: "blue.600" }}
                                        outline={"none"}
                                        _focus={{ outlineColor: "transparent" }}
                                        flex={1}
                                    >
                                        Special Plans
                                    </Link>
                                    <Box
                                        bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                                        color="white"
                                        px={2}
                                        py={0.5}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="bold"
                                    >
                                        NEW
                                    </Box>
                                </Flex>
                            </MenuItem>
                            <MenuItem value="On-Demand Meetings">
                                <Flex align="center" gap={2} w="100%">
                                    <Link
                                        fontWeight={"500"}
                                        href="/#hourly-packages"
                                        color="gray.700"
                                        _hover={{ color: "blue.600" }}
                                        outline={"none"}
                                        _focus={{ outlineColor: "transparent" }}
                                        flex={1}
                                    >
                                        On-Demand Meetings
                                    </Link>
                                    <Box
                                        bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                        color="white"
                                        px={2}
                                        py={0.5}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="bold"
                                    >
                                        HOT
                                    </Box>
                                </Flex>
                            </MenuItem>
                            <MenuItem value="Plans">
                                <Link
                                    fontWeight={"500"}
                                    href="/#hourly-packages"
                                    color="gray.700"
                                    _hover={{ color: "blue.600" }}
                                    outline={"none"}
                                    _focus={{ outlineColor: "transparent" }}
                                >
                                    Plans
                                </Link>
                            </MenuItem>
                            <MenuItem value="Amenities">
                                <Link
                                    fontWeight={"500"}
                                    href="/#amenities"
                                    color="gray.700"
                                    _hover={{ color: "blue.600" }}
                                    outline={"none"}
                                    _focus={{ outlineColor: "transparent" }}
                                >
                                    Amenities
                                </Link>
                            </MenuItem>
                            <MenuItem value="Contact Us">
                                <Link
                                    fontWeight={"500"}
                                    href="/#getinTouch"
                                    color="gray.700"
                                    _hover={{ color: "blue.600" }}
                                    outline={"none"}
                                    _focus={{ outlineColor: "transparent" }}
                                >
                                    Contact Us
                                </Link>
                            </MenuItem>
                            <MenuItem value="Contact Now">
                                <Button
                                    onClick={handleContactClick}
                                    variant="ghost"
                                    fontWeight={"500"}
                                    color="green.600"
                                    _hover={{
                                        color: "green.700",
                                        bg: "green.50",
                                    }}
                                    outline={"none"}
                                    _focus={{ outlineColor: "transparent" }}
                                    w="100%"
                                    fontSize="sm"
                                    justifyContent="flex-start"
                                    
                                >
                                    <Flex align="center" gap={2}>
                                        <Box fontSize="14px">📞</Box>
                                        <Text>Contact Now</Text>
                                    </Flex>
                                </Button>
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
                </Box>
            </Flex>

            {/* Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </Flex>
    );
};

export default Header;
