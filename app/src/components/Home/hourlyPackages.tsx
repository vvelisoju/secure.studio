import { Flex, Text, Card, Button, Box, Badge, Span } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import { useState } from "react";
import { ContactModal } from "../ui/modal";

const HourlyPackages = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const handleBookNow = () => {
        setIsContactModalOpen(true);
    };

    const hourlyOfficePlans = [
        {
            name: "Quick Meet",
            price: "₹199",
            duration: "per hour",
            timing: "1-2 people",
            description:
                "Perfect for client calls, interviews, or focused work sessions",
            popular: false,
            whoIsThisFor: "Freelancers, Consultants, Quick Meetings",
        },
        {
            name: "Team Session",
            price: "₹399",
            duration: "per hour",
            timing: "3-4 people",
            description:
                "Ideal for team meetings, brainstorming, or client presentations",
            popular: true,
            whoIsThisFor: "Small Teams, Startups, Project Meetings",
        },
        {
            name: "Extended Session",
            price: "₹2,499",
            duration: "for Full Day (8 Hours)",
            timing: "Up to 4 people",
            description:
                "Perfect for workshops, training sessions, or intensive work",
            popular: false,
            whoIsThisFor: "Workshops, Training, Deep Work Sessions",
        },
    ];

    const eveningOfficePlans = [
        {
            name: "Student Special",
            price: "₹1,500",
            duration: "/ month",
            timing: "6 PM – 8 PM (Weekdays)",
            description:
                "Dedicated evening study space for students and learners",
            popular: false,
            whoIsThisFor: "Students, Exam Preparation, Study Groups",
        },
        {
            name: "Professional Evening",
            price: "₹2,000",
            duration: "/ month",
            timing: "5 PM – 8 PM (All days)",
            description:
                "Perfect for side projects, freelancing, or US shift workers",
            popular: true,
            whoIsThisFor: "Freelancers, Side Hustlers, Remote Workers",
        },
        {
            name: "Night Owl",
            price: "₹2,500",
            duration: "/ month",
            timing: "8 PM – 11 PM (All Days)",
            description:
                "Late-night productivity space for night owls and US shifts",
            popular: false,
            whoIsThisFor: "Night Workers, US Shifts, Late-night Projects",
        },
    ];

    const flexiblePlans = [
        {
            name: "Morning Productivity Block",
            price: "₹7,000",
            timing: "Up to 8 people",
            duration: "/ month",
            details: "10 Hours (₹700/hr) - Same time daily",
            description:
                "Your dedicated morning office hours for consistent productivity",
            popular: false,
            whoIsThisFor: "Early Birds, Freelancers, Morning Routine Lovers",
        },
        {
            name: "Evening Work Sessions",
            price: "₹10,000",
            duration: "/ month",
            timing: "Up to 8 people",
            details: "25 Hours (₹400/hr) - Fixed evening slots",
            description:
                "Professional evening workspace routine - same desk, same time",
            popular: true,
            whoIsThisFor: "Professionals, Side Hustlers, Evening Workers",
        },
        {
            name: "Daily Office Hours",
            price: "₹17,500",
            duration: "/ month",
            timing: "Up to 8 people",
            details: "50 Hours (₹350/hr) - Your regular office time",
            description:
                "Treat it like your regular office, but pay only for hours you need",
            popular: false,
            whoIsThisFor: "Consultants, Small Business Owners, Regular Users",
        },
        {
            name: "Flexible Day Pass",
            price: "₹299",
            duration: "per day",
            timing: "9 AM – 6 PM",
            description:
                "Complete day access for testing our subscription model",
            popular: false,
            whoIsThisFor: "Trial Users, Occasional Visitors, One-time Needs",
        },
    ];

    const specialPackages = [
        {
            name: "Workshop Package",
            price: "₹12,000",
            duration: "for 12 sessions",
            details: "2 hours each session",
            features: "Includes projector & seating for up to 10 participants",
            description:
                "Complete workshop solution with all equipment included",
            category: "For Institutes / Trainers",
        },
        {
            name: "Virtual + Hourly Combo",
            price: "₹1,500",
            duration: "/ month",
            details: "Virtual office address + mail handling",
            features: "Discounted hourly rate: ₹500/hr (instead of ₹1,000)",
            description:
                "Professional address plus flexible meeting space access",
            category: "For Remote Professionals",
        },
        {
            name: "Custom Business Plan",
            price: "Let's Discuss",
            duration: "Tailored to your needs",
            features: "Dedicated support & flexible terms",
            description:
                "Customized solutions designed to meet your unique business requirements.",
            category: "Business Solutions",
            popular: true,
        },
    ];
    const coworkingPackages = [
        {
            name: "🪑 Open Desk",
            price: "₹3,999",
            duration: "/ month",
            details: "Flexible hot-desk in shared environment",
            features:
                "⚡ High-speed WiFi • ❄️ AC & Climate Control • 🔌 Power outlets • 🖨️ Printing facility • ☕ Complimentary beverages",
            description:
                "Perfect for freelancers and digital nomads who need a professional workspace with flexibility",
            category: "Co-working Space",
            popular: true,
            whoIsThisFor: "Freelancers, Digital Nomads, Remote Workers",
        },
        {
            name: "🏷️ Private Desk",
            price: "₹5,000",
            duration: "/ month",
            details: "Your dedicated personal workspace",
            features:
                "📦 Personal storage locker • 🔐 Lockable drawer • 📋 Personalized name plate • 🚀 Priority access • 📞 Phone booth access",
            description:
                "Your own dedicated space in a collaborative environment - perfect for consistent daily users",
            category: "Co-working Space",
            popular: false,
            whoIsThisFor: "Regular Users, Professionals, Small Business Owners",
        },
        {
            name: "📱 Virtual Office",
            price: "₹1,500",
            duration: "/ month",
            details: "Professional business address & services",
            features:
                "📮 Mail handling & forwarding • 📋 Business registration support • 📞 Reception services • 🏢 Professional address",
            description:
                "Establish your business presence without physical office space - ideal for online businesses",
            category: "Virtual Services",
            popular: false,
            whoIsThisFor: "Startups, Online Businesses, Remote Companies",
        },
        {
            name: "🏢 Private Cabins",
            price: "₹20,000",
            duration: "/ month onwards",
            details: "Fully furnished private office space",
            features:
                "🏢 Premium business address • 📦 Courier handling & forwarding • 📞 Dedicated phone support • 🔧 Flexible upgrade options • 🛡️ Enhanced security",
            description:
                "Complete private office solution for teams requiring privacy and dedicated space",
            category: "Private Office",
            popular: false,
            whoIsThisFor: "Small Teams, Startups, Professional Services",
        },
    ];

    const renderPlanCard = (plan: any, showWhoIsFor = false) => (
        <Card.Root
            key={plan.name}
            borderRadius={20}
            boxShadow="lg"
            position="relative"
            bg="white"
            _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
            transition="all 0.3s ease"
            w={["100%", "320px"]}
            border={plan.popular ? "2px solid" : "1px solid"}
            borderColor={plan.popular ? "support" : "gray.200"}
        >
            {plan.popular && (
                <Badge
                    position="absolute"
                    top={-2}
                    right={4}
                    bg="support"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                >
                    MOST POPULAR
                </Badge>
            )}
            <Card.Body gap={4} p={6}>
                <Flex direction="column" align="center" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" color="dark" mb={2}>
                        {plan.name}
                    </Text>
                    <Flex align="baseline" mb={3}>
                        <Text fontSize="3xl" fontWeight="bold" color="primary">
                            {plan.price}
                        </Text>
                        <Text fontSize="md" color="gray.600" ml={1}>
                            {plan.duration}
                        </Text>
                    </Flex>

                    {plan.timing && (
                        <Box
                            bg="blue.50"
                            p={2}
                            borderRadius="md"
                            mb={3}
                            w="100%"
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="primary"
                            >
                                {plan.timing}
                            </Text>
                        </Box>
                    )}

                    {plan.details && (
                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="secondary"
                            mb={2}
                        >
                            {plan.details}
                        </Text>
                    )}

                    {plan.features && (
                        <Text fontSize="sm" color="gray.600" mb={2}>
                            {plan.features}
                        </Text>
                    )}

                    <Text fontSize="sm" color="gray.700" mb={3}>
                        {plan.description}
                    </Text>

                    {showWhoIsFor && plan.whoIsThisFor && (
                        <Box
                            bg="green.50"
                            p={2}
                            borderRadius="md"
                            mb={3}
                            w="100%"
                        >
                            <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color="green.700"
                                mb={1}
                            >
                                Perfect for:
                            </Text>
                            <Text fontSize="xs" color="green.600">
                                {plan.whoIsThisFor}
                            </Text>
                        </Box>
                    )}
                </Flex>

                <Button
                    bg={plan.popular ? "support" : "primary"}
                    color="white"
                    w="full"
                    onClick={handleBookNow}
                    _hover={{
                        bg: plan.popular ? "red.600" : "blue.600",
                        transform: "scale(1.05)",
                    }}
                    transition="all 0.2s"
                    size="lg"
                >
                    {plan.price.includes("₹200")
                        ? "Book Meeting Room"
                        : "Book Now"}
                </Button>
            </Card.Body>
        </Card.Root>
    );

    return (
        <Flex
            id="hourly-packages"
            direction="column"
            p={[5, 7, 10]}
            bg="gray.50"
            gap={[8, 12]}
            alignItems="center"
        >
            {/* Enhanced Header Section */}
            <Flex
                direction="column"
                align="center"
                textAlign="center"
                maxW="900px"
            >
                <Text
                    fontSize={[24, 32, 42]}
                    fontWeight="bold"
                    color="dark"
                    mb={4}
                >
                    🏢 Warangal's Most Flexible Co-Working Solutions
                </Text>
                <Text fontSize="xl" color="support" fontWeight="bold" mb={4}>
                    "Professional workspace solutions designed for modern
                    professionals"
                </Text>
                <Text
                    fontSize="lg"
                    color="secondary"
                    fontWeight="semibold"
                    mb={2}
                >
                    ✅ Conference Room | Up to 6 Members | Professional
                    Environment
                </Text>
                <Text fontSize="md" color="gray.600" maxW="600px">
                    Perfect for Warangal's growing startup ecosystem, students,
                    and professionals who need flexible workspace solutions.
                </Text>
            </Flex>

            {/* On-Demand Meeting Rooms Section */}
            <Flex
                direction="column"
                w="100%"
                align="center"
                id="ondemand-packages"
            >
                <Box textAlign="center" mb={6}>
                    <Text
                        fontSize={[20, 26, 34]}
                        fontWeight="bold"
                        color="dark"
                        mb={3}
                    >
                        🚀 On-Demand Meeting Rooms
                    </Text>
                    <Text
                        fontSize="lg"
                        color="primary"
                        fontWeight="semibold"
                        mb={2}
                    >
                        Book instantly for client meetings and calls
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        Professional meeting space when you need it • No advance
                        booking required
                    </Text>
                </Box>
                <Flex
                    gap={6}
                    wrap="wrap"
                    justify="center"
                    w="100%"
                    maxW="1200px"
                >
                    {hourlyOfficePlans.map((plan) =>
                        renderPlanCard(plan, true),
                    )}
                </Flex>
            </Flex>
            {/* Hourly Office Subscriptions Section */}
            <Flex direction="column" w="100%" align="center">
                <Box textAlign="center" mb={6}>
                    <Text
                        fontSize={[20, 26, 34]}
                        fontWeight="bold"
                        color="dark"
                        mb={3}
                    >
                        🏢 Hourly Office Subscriptions
                    </Text>
                    <Text
                        fontSize="lg"
                        color="primary"
                        fontWeight="semibold"
                        mb={2}
                    >
                        Your dedicated office hours - same desk, same time,
                        every day
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        Professional workspace routine without the full-time
                        cost • Treat it like your regular office
                    </Text>
                </Box>
                <Flex
                    gap={6}
                    wrap="wrap"
                    justify="center"
                    w="100%"
                    maxW="1400px"
                >
                    {flexiblePlans.map((plan) => renderPlanCard(plan, true))}
                </Flex>
            </Flex>
            {/* Evening Office Section */}
            <Flex direction="column" w="100%" align="center">
                <Box textAlign="center" mb={6}>
                    <Text
                        fontSize={[20, 26, 34]}
                        fontWeight="bold"
                        color="dark"
                        mb={3}
                    >
                        🌆 Evening Office Access
                    </Text>
                    <Text
                        fontSize="lg"
                        color="primary"
                        fontWeight="semibold"
                        mb={2}
                    >
                        Dedicated evening workspace for students, freelancers,
                        and professionals
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        Monthly access • Evening productivity • Affordable rates
                    </Text>
                </Box>
                <Flex
                    gap={6}
                    wrap="wrap"
                    justify="center"
                    w="100%"
                    maxW="1200px"
                >
                    {eveningOfficePlans.map((plan) =>
                        renderPlanCard(plan, true),
                    )}
                </Flex>
            </Flex>

            {/* Special Packages */}
            <Flex direction="column" w="100%" align="center">
                <Box textAlign="center" mb={6}>
                    <Text
                        fontSize={[20, 26, 34]}
                        fontWeight="bold"
                        color="dark"
                        mb={3}
                    >
                        🎯 Specialized Solutions
                    </Text>
                    <Text
                        fontSize="lg"
                        color="primary"
                        fontWeight="semibold"
                        mb={2}
                    >
                        Tailored packages for specific business needs, including
                        custom plans.
                    </Text>
                </Box>
                <Flex
                    gap={6}
                    wrap="wrap"
                    justify="center"
                    w="100%"
                    maxW="1400px"
                >
                    {specialPackages.map((plan) => (
                        <Card.Root
                            key={plan.name}
                            borderRadius={20}
                            boxShadow="lg"
                            position="relative"
                            bg="white"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "2xl",
                            }}
                            transition="all 0.3s ease"
                            w={["100%", "320px"]}
                            border={plan.popular ? "2px solid" : "1px solid"}
                            borderColor={plan.popular ? "support" : "gray.200"}
                        >
                            {plan.popular && (
                                <Badge
                                    position="absolute"
                                    top={-2}
                                    right={4}
                                    bg="support"
                                    color="white"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                >
                                    MOST POPULAR
                                </Badge>
                            )}
                            <Card.Body gap={4} p={6}>
                                <Badge
                                    bg="primary"
                                    color="white"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    alignSelf="flex-start"
                                >
                                    {plan.category}
                                </Badge>
                                <Flex
                                    direction="column"
                                    align="center"
                                    textAlign="center"
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color="dark"
                                        mb={2}
                                    >
                                        {plan.name}
                                    </Text>
                                    <Flex align="baseline" mb={3}>
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                            color="primary"
                                        >
                                            {plan.price}
                                        </Text>
                                        <Text
                                            fontSize="md"
                                            color="gray.600"
                                            ml={1}
                                        >
                                            {plan.duration}
                                        </Text>
                                    </Flex>

                                    {plan.details && (
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="secondary"
                                            mb={2}
                                        >
                                            {plan.details}
                                        </Text>
                                    )}

                                    {plan.features && (
                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            mb={2}
                                        >
                                            {plan.features}
                                        </Text>
                                    )}

                                    <Text fontSize="sm" color="gray.700" mb={3}>
                                        {plan.description}
                                    </Text>

                                    {plan.whoIsThisFor && (
                                        <Box
                                            bg="green.50"
                                            p={2}
                                            borderRadius="md"
                                            mb={3}
                                            w="100%"
                                        >
                                            <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                color="green.700"
                                                mb={1}
                                            >
                                                Perfect for:
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="green.600"
                                            >
                                                {plan.whoIsThisFor}
                                            </Text>
                                        </Box>
                                    )}
                                </Flex>

                                <Button
                                    bg={plan.popular ? "support" : "primary"}
                                    color="white"
                                    w="full"
                                    onClick={handleBookNow}
                                    _hover={{
                                        bg: plan.popular
                                            ? "red.600"
                                            : "blue.600",
                                        transform: "scale(1.05)",
                                    }}
                                    transition="all 0.2s"
                                >
                                    Book Now
                                </Button>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </Flex>
            </Flex>

            {/* Coworking Packages */}
            <Flex direction="column" w="100%" align="center" id="plans">
                <Box textAlign="center" mb={6}>
                    <Text
                        fontSize={[20, 26, 34]}
                        fontWeight="bold"
                        color="dark"
                        mb={3}
                    >
                        🏢 Premium Co-working Space Solutions
                    </Text>
                    <Text
                        fontSize="lg"
                        color="primary"
                        fontWeight="semibold"
                        mb={2}
                    >
                        Professional workspace environments designed for growth
                        and collaboration
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        From flexible hot desks to private cabins - find your
                        perfect workspace solution
                    </Text>
                </Box>
                <Flex
                    gap={6}
                    wrap="wrap"
                    justify="center"
                    w="100%"
                    maxW="1400px"
                >
                    {coworkingPackages.map((plan) => (
                        <Card.Root
                            key={plan.name}
                            borderRadius={20}
                            boxShadow="lg"
                            position="relative"
                            bg="white"
                            _hover={{
                                transform: "translateY(-5px)",
                                boxShadow: "2xl",
                            }}
                            transition="all 0.3s ease"
                            w={["100%", "320px"]}
                            border={plan.popular ? "2px solid" : "1px solid"}
                            borderColor={plan.popular ? "support" : "gray.200"}
                        >
                            {plan.popular && (
                                <Badge
                                    position="absolute"
                                    top={-2}
                                    right={4}
                                    bg="support"
                                    color="white"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                >
                                    MOST POPULAR
                                </Badge>
                            )}
                            <Card.Body gap={4} p={6}>
                                <Badge
                                    bg="primary"
                                    color="white"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                    alignSelf="flex-start"
                                >
                                    {plan.category}
                                </Badge>
                                <Flex
                                    direction="column"
                                    align="center"
                                    textAlign="center"
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                        color="dark"
                                        mb={2}
                                    >
                                        {plan.name}
                                    </Text>
                                    <Flex align="baseline" mb={3}>
                                        <Text
                                            fontSize="3xl"
                                            fontWeight="bold"
                                            color="primary"
                                        >
                                            {plan.price}
                                        </Text>
                                        <Text
                                            fontSize="md"
                                            color="gray.600"
                                            ml={1}
                                        >
                                            {plan.duration}
                                        </Text>
                                    </Flex>

                                    {plan.details && (
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="secondary"
                                            mb={2}
                                        >
                                            {plan.details}
                                        </Text>
                                    )}

                                    {plan.features && (
                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            mb={2}
                                        >
                                            {plan.features}
                                        </Text>
                                    )}

                                    <Text fontSize="sm" color="gray.700" mb={3}>
                                        {plan.description}
                                    </Text>

                                    {plan.whoIsThisFor && (
                                        <Box
                                            bg="green.50"
                                            p={2}
                                            borderRadius="md"
                                            mb={3}
                                            w="100%"
                                        >
                                            <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                color="green.700"
                                                mb={1}
                                            >
                                                Perfect for:
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color="green.600"
                                            >
                                                {plan.whoIsThisFor}
                                            </Text>
                                        </Box>
                                    )}
                                </Flex>

                                <Button
                                    bg={plan.popular ? "support" : "primary"}
                                    color="white"
                                    w="full"
                                    onClick={handleBookNow}
                                    _hover={{
                                        bg: plan.popular
                                            ? "red.600"
                                            : "blue.600",
                                        transform: "scale(1.05)",
                                    }}
                                    transition="all 0.2s"
                                >
                                    Book Now
                                </Button>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </Flex>
            </Flex>

            {/* Why Choose Our Solutions Section */}
            <Flex direction="column" w="100%" align="center" maxW="1000px">
                <Text
                    fontSize={[20, 26, 32]}
                    fontWeight="bold"
                    color="dark"
                    mb={6}
                >
                    Why Choose Our Workspace Solutions?
                </Text>
                <Flex wrap="wrap" gap={6} justify="center">
                    {[
                        {
                            icon: "🚀",
                            title: "Instant Availability",
                            desc: "On-demand meeting rooms ready when you are",
                        },
                        {
                            icon: "🏢",
                            title: "Regular Office Feel",
                            desc: "Same desk, same time - your routine workspace",
                        },
                        {
                            icon: "💰",
                            title: "Cost Effective",
                            desc: "Professional workspace without full-time cost",
                        },
                        {
                            icon: "📱",
                            title: "Easy Booking",
                            desc: "Quick online reservation system",
                        },
                        {
                            icon: "🌐",
                            title: "Perfect Location",
                            desc: "Central Warangal location",
                        },
                        {
                            icon: "🔧",
                            title: "All Amenities",
                            desc: "WiFi, AC, projector included",
                        },
                    ].map((benefit, index) => (
                        <Box key={index} textAlign="center" maxW="150px">
                            <Text fontSize="3xl" mb={2}>
                                {benefit.icon}
                            </Text>
                            <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="dark"
                                mb={1}
                            >
                                {benefit.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                                {benefit.desc}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            </Flex>

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactModalOpen} 
                onClose={() => setIsContactModalOpen(false)} 
            />
        </Flex>
    );
};

export default HourlyPackages;
