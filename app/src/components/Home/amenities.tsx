import { useEffect } from "react";
import { useHomeStore } from "../../stores/home";
import { Flex, Text, Image } from "@chakra-ui/react";
import TwoWheelerParking from "../../assets/amenities/two-wheeler-parking.png";
import FourWheelerParking from "../../assets/amenities/four-wheeler-parking.png";
import Wifi from "../../assets/amenities/wifi.png";
import Tea from "../../assets/amenities/tea.png";
import Coffee from "../../assets/amenities/coffee.png";
import Water from "../../assets/amenities/water.png";
import ChairsAndDesks from "../../assets/amenities/workplace.png";
import SeperateWashroom from "../../assets/amenities/separate-washroom.png";
import PantryArea from "../../assets/amenities/pantry-area.png";
import MeetingRooms from "../../assets/amenities/meeting-rooms.png";
import AirConditioners from "../../assets/amenities/air-conditioner.png";
import ChargingPoints from "../../assets/amenities/charging.png";
import PowerSupplyAndBackUp from "../../assets/amenities/charge.png";
import FireExtinguishers from "../../assets/amenities/fire-extinguisher.png";
import FirstAidKit from "../../assets/amenities/first-aid-kit.png";

const amenities = [
    { name: "Two-Wheeler Parking", iconUrl: TwoWheelerParking },
    { name: "Four-Wheeler Parking", iconUrl: FourWheelerParking },
    { name: "Meeting Rooms", iconUrl: MeetingRooms },
    { name: "Chairs & Desks", iconUrl: ChairsAndDesks },
    { name: "Pantry Area", iconUrl: PantryArea },
    { name: "Air Conditioners", iconUrl: AirConditioners },
    { name: "Separate Washroom", iconUrl: SeperateWashroom },
    { name: "Charging Points", iconUrl: ChargingPoints },
    { name: "Power Supply and Backup", iconUrl: PowerSupplyAndBackUp },
    { name: "First Aid Kit", iconUrl: FirstAidKit },
    { name: "Wifi", iconUrl: Wifi },
    { name: "Tea", iconUrl: Tea },
    { name: "Coffee", iconUrl: Coffee },
    { name: "Water", iconUrl: Water },
    { name: "Fire Extinguishers", iconUrl: FireExtinguishers },
];

const Amenities = () => {
    return (
        <Flex
            id="amenities"
            direction={"column"}
            p={[6, 8, 10]}
            bgGradient="linear(135deg, #f093fb 0%, #f5576c 25%, #f093fb 50%, #f5576c 75%, #f093fb 100%)"
            gap={[4, 6, 8]}
            flexGrow={1}
            justifyContent={"center"}
            alignItems={"center"}
            textAlign={"center"}
            color="white"
            position="relative"
            overflow="hidden"
        >
            {/* Enhanced Background Pattern */}
            <Flex
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.08}
                backgroundImage="radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 2px, transparent 0), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.4) 2px, transparent 0)"
                backgroundSize="120px 120px"
                pointerEvents="none"
            />

            {/* Mobile-Optimized Header */}
            <Flex direction="column" align="center" maxW="800px" zIndex={1} mb={{ base: 2, md: 4 }}>
                <Text
                    fontSize={{ base: 22, sm: 26, md: 30, lg: 36 }}
                    fontWeight={"bold"}
                    mb={{ base: 1, md: 2 }}
                    color="white"
                    textShadow="0 4px 8px rgba(0,0,0,0.5)"
                    lineHeight="1.2"
                    textAlign="center"
                    px={4}
                >
                    🏢 Premium Amenities
                </Text>
                <Text
                    fontSize={{ base: 13, sm: 14, md: 16, lg: 18 }}
                    color="black"
                    fontWeight="600"
                    maxW={{ base: "90%", md: "600px" }}
                    textShadow="0 2px 6px rgba(0,0,0,0.4)"
                    lineHeight="1.4"
                    opacity={0.9}
                    textAlign="center"
                    px={4}
                >
                    Everything you need for a productive workspace
                </Text>
            </Flex>

            {/* Improved Mobile-First Amenities Grid */}
            <Flex
                w={"100%"}
                gap={{ base: 3, md: 4, lg: 5 }}
                flexGrow={1}
                justifyContent={"center"}
                alignItems={"center"}
                flexWrap={"wrap"}
                maxW="1400px"
                zIndex={1}
                px={{ base: 2, md: 4 }}
            >
                {amenities?.map((amenity: any, index) => {
                    return (
                        <Flex
                            key={index}
                            bg={"white"}
                            flexWrap={"wrap"}
                            p={{ base: 3, sm: 4, md: 5 }}
                            gap={{ base: 2, md: 3 }}
                            direction={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            borderRadius={{ base: 12, md: 16 }}
                            boxShadow={"0 8px 30px rgba(0,0,0,0.2)"}
                            w={{ 
                                base: "calc(50% - 6px)", 
                                sm: "150px", 
                                md: "170px", 
                                lg: "180px" 
                            }}
                            minH={{ base: "130px", sm: "140px", md: "160px" }}
                            transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                            backdropFilter="blur(10px)"
                            position="relative"
                            _hover={{
                                transform: { base: "translateY(-3px)", md: "translateY(-6px) scale(1.03)" },
                                boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
                                bg: "linear-gradient(135deg, #ffffff, #f0f7ff)",
                                borderColor: "primary",
                            }}
                        >
                            <Flex
                                bg="primary"
                                borderRadius="full"
                                p={{ base: 2.5, md: 3 }}
                                mb={{ base: 1, md: 2 }}
                                boxShadow="0 4px 15px rgba(76, 141, 255, 0.3)"
                                transition="all 0.3s ease"
                            >
                                <Image
                                    src={amenity.iconUrl}
                                    w={{ base: 6, sm: 8, md: 10, lg: 12 }}
                                    h={{ base: 6, sm: 8, md: 10, lg: 12 }}
                                    filter="brightness(0) invert(1)"
                                    transition="all 0.3s ease"
                                />
                            </Flex>
                            <Text
                                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                                fontWeight={"bold"}
                                color={"gray.800"}
                                textAlign="center"
                                lineHeight="1.2"
                                transition="all 0.3s ease"
                                px={{ base: 1, md: 2 }}
                                wordBreak="break-word"
                            >
                                {amenity.name}
                            </Text>
                        </Flex>
                    );
                })}
            </Flex>

            {/* Enhanced Floating Elements */}
            <Flex
                position="absolute"
                top="10%"
                right="5%"
                w="60px"
                h="60px"
                bg="rgba(255,255,255,0.1)"
                borderRadius="full"
                animation="float 6s ease-in-out infinite"
                opacity={0.6}
            />
            <Flex
                position="absolute"
                bottom="15%"
                left="8%"
                w="40px"
                h="40px"
                bg="rgba(255,255,255,0.15)"
                borderRadius="full"
                animation="float 4s ease-in-out infinite reverse"
                opacity={0.5}
            />

            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                `}
            </style>
        </Flex>
    );
};

export default Amenities;