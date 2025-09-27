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
    {
      id: "7",
      name: "Private Cabin",
      imageUrl: PrivateCabin,
      description:
        "Dedicated private cabins for focused work with complete privacy and personalization.",
      link: "/services#privatecabin",
    },
    {
      id: "8",
      name: "Dedicated Desk",
      imageUrl: HotDesk,
      description:
        "Your own assigned desk in a shared workspace with personal storage space.",
      link: "/services#dedicateddesk",
    },
    {
      id: "9",
      name: "Conference Room",
      imageUrl: MeetingRoom,
      description:
        "Large conference rooms for important meetings, presentations, and corporate events.",
      link: "/services#conferenceroom",
    },
  ];

  return (
    <Box
      id="services"
      bg="white"
      position="relative"
      overflow="hidden"
      w="100%"
    >
      <Flex
        px={{ base: 4, md: 8, lg: 16 }}
        py={{ base: 8, md: 12, lg: 16 }}
        gap={{ base: 6, md: 8, lg: 10 }}
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        flexGrow={1}
        position="relative"
      >
        {/* Header Section */}
        <Box textAlign="center" maxW="4xl">
          <Box
            bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            color="white"
            px={4}
            py={2}
            borderRadius="full"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="bold"
            whiteSpace="nowrap"
            boxShadow="0 6px 20px rgba(59, 130, 246, 0.3)"
            display="inline-flex"
            alignItems="center"
            gap={2}
            mb={6}
          >
            🏢 Premium Workspace Services
          </Box>

          <Text
            fontWeight={"900"}
            fontSize={{ base: 32, md: 42, lg: 48 }}
            mb={{ base: 4, md: 6 }}
            lineHeight="1.1"
            color="gray.800"
            letterSpacing="-1px"
          >
            Our Services
          </Text>

          <Text
            fontWeight={"600"}
            fontSize={{ base: 16, md: 18, lg: 20 }}
            color="gray.600"
            lineHeight="1.5"
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
          gap={{ base: 5, md: 6, lg: 8 }}
          w="100%"
          maxW="6xl"
        >
          {services.map((service, index) => (
            <Card.Root
              key={service.id}
              py={{ base: 6, md: 7 }}
              px={{ base: 6, md: 7 }}
              borderRadius="2xl"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-8px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                borderColor: "blue.300",
              }}
              cursor="pointer"
              h="auto"
              position="relative"
            >
              {/* Highlight for popular services */}
              {(index === 1 || index === 4) && (
                <Box
                  position="absolute"
                  top={-2}
                  right={-2}
                  bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                  boxShadow="0 4px 12px rgba(245, 158, 11, 0.3)"
                >
                  POPULAR
                </Box>
              )}

              <Card.Body gap={4} p={0}>
                {/* Icon and Title Row */}
                <Flex gap={4} alignItems={"flex-start"}>
                  <Avatar
                    bg={"gray.50"}
                    src={service.imageUrl}
                    name={service.name}
                    size={{ base: "lg", md: "xl" }}
                    shape="square"
                    flexShrink={0}
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    boxShadow="0 4px 15px rgba(0,0,0,0.1)"
                  />
                  <Box flex={1}>
                    <Card.Title
                      fontSize={{ base: 16, md: 18 }}
                      fontWeight="700"
                      color="gray.800"
                      lineHeight="1.3"
                      mb={2}
                    >
                      {service.name}
                    </Card.Title>
                  </Box>
                </Flex>

                {/* Description */}
                <Card.Description
                  fontSize={{ base: 13, md: 14 }}
                  color="gray.600"
                  lineHeight="1.6"
                  fontWeight="500"
                >
                  {service.description}
                </Card.Description>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          bg="gray.50"
          p={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.200"
          textAlign="center"
          maxW="4xl"
          boxShadow="0 4px 20px rgba(0,0,0,0.05)"
        >
          <Text
            fontSize={{ base: 18, md: 20 }}
            fontWeight="bold"
            color="gray.800"
            mb={3}
          >
            Ready to boost your productivity?
          </Text>
          <Text
            fontSize="16px"
            color="gray.600"
            fontWeight="500"
          >
            Choose from our flexible workspace solutions and join 500+ professionals in Warangal's premier co-working space.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default NewServices;