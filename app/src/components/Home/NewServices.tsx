import { Flex, Text, Card, Grid, Box } from "@chakra-ui/react";
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
      description:
        "Flexible seating in a shared space. Great for freelancers, students, and digital nomads.",
      link: "/services#hotdesk",
    },
    {
      id: "2",
      name: "Shared Office spaces",
      imageUrl: PrivateCabin,
      description:
        "Secure, fully furnished cabins for startups and teams looking for privacy and consistency.",
      link: "/services#privatecabin",
    },
    {
      id: "3",
      name: "Customised Office Space",
      imageUrl: CustomOffice,
      description:
        "Tailor-made office layouts to fit your team's needs, branding, and workflow.",
      link: "/services#customised",
    },
    {
      id: "4",
      name: "Virtual Office",
      imageUrl: VirtualOffice,
      description:
        "Get a professional business address, mail handling, and optional reception services.",
      link: "/services#virtualoffice",
    },
    {
      id: "5",
      name: "Meeting Room",
      imageUrl: MeetingRoom,
      description:
        "Well-equipped meeting rooms with A/V support, available by the hour or day.",
      link: "/services#meetingroom",
    },
    {
      id: "6",
      name: "Event & Workshop Space",
      imageUrl: EventSpace,
      description:
        "Host talks, product launches, or team workshops in our versatile event area.",
      link: "/services#eventspace",
    },
  ];

  return (
    <Flex
      id="services"
      px={{ base: 4, md: 8, lg: 16 }}
      py={{ base: 8, md: 12, lg: 16 }}
      gap={{ base: 6, md: 8, lg: 10 }}
      color={"gray.800"}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      flexGrow={1}
      bg="white"
    >
      {/* Header Section */}
      <Box textAlign="center" maxW="4xl">
        <Text
          fontWeight={"bold"}
          fontSize={{ base: 28, md: 36, lg: 42 }}
          mb={{ base: 3, md: 4 }}
          lineHeight="1.2"
          color="gray.800"
        >
          Our Services
        </Text>
        <Text
          fontWeight={"500"}
          fontSize={{ base: 14, md: 16, lg: 18 }}
          color="gray.600"
          lineHeight="1.6"
          maxW="3xl"
          mx="auto"
        >
          Whether you're a freelancer, entrepreneur, or enterprise team, Secure
          Studio offers the perfect environment to focus, collaborate, and grow.
        </Text>
      </Box>

      {/* Services Grid */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={{ base: 4, md: 5, lg: 6 }}
        w="100%"
        maxW="6xl"
      >
        {services.map((service) => (
          <Card.Root
            key={service.id}
            py={{ base: 4, md: 5 }}
            px={{ base: 4, md: 5 }}
            borderRadius={16}
            boxShadow={"md"}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            transition="all 0.3s ease"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "lg",
              bg: "gray.100",
              borderColor: "gray.300",
            }}
            cursor="pointer"
            h="auto"
          >
            <Card.Body gap={3} p={0}>
              {/* Icon and Title Row */}
              <Flex gap={3} alignItems={"flex-start"}>
                <Avatar
                  bg={"transparent"}
                  src={service.imageUrl}
                  name={service.name}
                  size={{ base: "md", md: "lg" }}
                  shape="square"
                  flexShrink={0}
                />
                <Box flex={1}>
                  <Card.Title
                    fontSize={{ base: 14, md: 16 }}
                    fontWeight="600"
                    color="gray.800"
                    lineHeight="1.3"
                  >
                    {service.name}
                  </Card.Title>
                </Box>
              </Flex>

              {/* Description */}
              <Card.Description
                fontSize={{ base: 12, md: 13 }}
                color="gray.600"
                lineHeight="1.5"
              >
                {service.description}
              </Card.Description>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>
    </Flex>
  );
};

export default NewServices;