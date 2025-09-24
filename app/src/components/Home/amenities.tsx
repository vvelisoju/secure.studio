import { useEffect } from "react";
import { useHomeStore } from "../../stores/home";
import { Flex, Text, Image } from "@chakra-ui/react";
import TwoWheelerParking from "../../assets/amenities/two-wheeler-parking.png"
import FourWheelerParking from "../../assets/amenities/four-wheeler-parking.png"
import Wifi from "../../assets/amenities/wifi.png"
import Tea from "../../assets/amenities/tea.png"
import Coffee from "../../assets/amenities/coffee.png"
import Water from "../../assets/amenities/water.png"
import ChairsAndDesks from "../../assets/amenities/workplace.png"
import SeperateWashroom from "../../assets/amenities/separate-washroom.png"
import PantryArea from "../../assets/amenities/pantry-area.png"
import MeetingRooms from "../../assets/amenities/meeting-rooms.png"
import AirConditioners from "../../assets/amenities/air-conditioner.png"
import ChargingPoints from "../../assets/amenities/charging.png"
import PowerSupplyAndBackUp from "../../assets/amenities/charge.png"
import FireExtinguishers from "../../assets/amenities/fire-extinguisher.png"
import FirstAidKit from "../../assets/amenities/first-aid-kit.png"

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
]

const Amenities = () => {
    return (
        <Flex id="amenities" direction={"column"} p={[5, 10]} bg={"gray.100"} gap={[5, 10]} flexGrow={1} justifyContent={"center"} alignItems={'center'} textAlign={"center"} >
            <Text fontSize={{ base: 20, md: 40 }} fontWeight={"bold"} >Our Amenities</Text>

            <Flex w={"90%"} gap={5} flexGrow={1} justifyContent={"center"} alignItems={'center'} flexWrap={"wrap"} >
                {amenities?.map((amenity: any, index) => {
                    return <Flex key={index} bg={"white"} flexWrap={"wrap"} p={5} gap={5} direction={"column"} justifyContent={"center"}
                        alignItems={"center"} borderRadius={10} boxShadow={"md"} w={260} h={180} transition="all 0.3s ease-in-out"
                        _hover={{
                            transform: "scale(1.05)",
                            boxShadow: "2xl",
                        }} >
                        <Image src={amenity.iconUrl} w={24} h={24} />
                        <Text fontSize={15} fontWeight={"bold"} color={"dark"} >{amenity.name}</Text>
                    </Flex>
                })}
            </Flex>
        </Flex>
    )
}

export default Amenities