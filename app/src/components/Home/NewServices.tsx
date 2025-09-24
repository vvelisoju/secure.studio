import { Flex, Text, Card, Link } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import HotDesk from "../../assets/desk.png";
import PrivateCabin from "../../assets/office.png";
import CustomOffice from "../../assets/customs.png";
import VirtualOffice from "../../assets/virtual-office.png";
import MeetingRoom from "../../assets/office (1).png";
import EventSpace from "../../assets/event (1).png";

const NewServices = () => {
  const services = [
    {
      id: "1",
      name: "Hot Desk",
      imageUrl: HotDesk,
      description: "Flexible seating in a shared space. Great for freelancers, students, and digital nomads.",
      link: "/services#hotdesk"
    },
    {
      id: "2",
      name: "Shared Office spaces",
      imageUrl: PrivateCabin,
      description: "Secure, fully furnished cabins for startups and teams looking for privacy and consistency.",
      link: "/services#privatecabin"
    },
    {
      id: "3",
      name: "Customised Office Space",
      imageUrl: CustomOffice,
      description: "Tailor-made office layouts to fit your team’s needs, branding, and workflow.",
      link: "/services#customised"
    },
    {
      id: "4",
      name: "Virtual Office",
      imageUrl: VirtualOffice,
      description: "Get a professional business address, mail handling, and optional reception services.",
      link: "/services#virtualoffice"
    },
    {
      id: "5",
      name: "Meeting Room",
      imageUrl: MeetingRoom,
      description: "Well-equipped meeting rooms with A/V support, available by the hour or day.",
      link: "/services#meetingroom"
    },
    {
      id: "6",
      name: "Event & Workshop Space",
      imageUrl: EventSpace,
      description: "Host talks, product launches, or team workshops in our versatile event area.",
      link: "/services#eventspace"
    }
  ];

  return (
    <Flex
      id="services"
      px={{ base: 5, md: 10, lg: 20 }}
      py={{ base: 3, md: 7, lg: 10 }}
      gap={{ base: 3, md: 7, lg: 10 }}
      color={"white"}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      minH={100}
      flexGrow={1}
      bgGradient="to-t"
      gradientFrom="primary"
      gradientTo="secondary"
    >
      <Text fontWeight={"bold"} fontSize={{ base: 25, md: 30, lg: 40 }}>
        Our Services
      </Text>
      <Text textAlign={"center"} fontWeight={"bold"} fontSize={{ base: 13, md: 17 }} w={"80%"}>
        Whether you're a freelancer, entrepreneur, or enterprise team, Secure Studio offers the perfect environment to focus, collaborate, and grow.
      </Text>

      <Flex wrap="wrap" justify="center" gap={{ base: 5, md: 10 }}>
        {services.map(service => (
          <Card.Root
            key={service.id}
            py={{ base: 2, md: 4 }}
            px={{ base: 3, md: 6 }}
            borderRadius={20}
            boxShadow={"xl"}
            flexBasis={{ base: "100%", md: "45%", lg: "30%" }}
            maxW="400px"
          >
            <Card.Body gap={5}>
              <Flex gap={5} alignItems={"center"}>
                <Avatar
                  bg={"transparent"}
                  src={service.imageUrl}
                  name={service.name}
                  size={{ base: "lg", sm: "xl", md: "2xl" }}
                  shape="square"
                />
                <Card.Title mt="2" fontSize={{ base: 15, lg: 17 }}>
                  {service.name}
                </Card.Title>
              </Flex>
              <Card.Description fontSize={{ base: 12, lg: 16 }}>
                {service.description}
              </Card.Description>
            </Card.Body>
            <Card.Footer>
              {/* <Link href={service.link} color="blue.200">
                Learn more
              </Link> */}
            </Card.Footer>
          </Card.Root>
        ))}
      </Flex>
    </Flex>
  );
};

export default NewServices;
