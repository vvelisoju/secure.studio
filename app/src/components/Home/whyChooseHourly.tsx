
import { Flex, Text, Box, Card, Grid } from "@chakra-ui/react";

const WhyChooseHourly = () => {
    const benefits = [
        {
            icon: "💰",
            title: "Cost-Effective",
            description: "Pay only for the hours you actually use. No monthly commitments or hidden fees.",
            savings: "Save up to 70% vs traditional office rentals"
        },
        {
            icon: "⚡",
            title: "Instant Booking",
            description: "Book your space in minutes. Perfect for last-minute meetings and urgent work sessions.",
            savings: "Available 24/7 online booking"
        },
        {
            icon: "🎯",
            title: "Perfect for Teams",
            description: "Ideal for startup meetings, client presentations, interviews, and team collaborations.",
            savings: "Accommodates 1-6 people comfortably"
        },
        {
            icon: "📚",
            title: "Student-Friendly",
            description: "Special evening plans designed for students and exam preparation at affordable rates.",
            savings: "Evening access from just ₹1,500/month"
        },
        {
            icon: "🌐",
            title: "Prime Location",
            description: "Centrally located in Warangal with easy access and professional environment.",
            savings: "Walking distance from major landmarks"
        },
        {
            icon: "🔧",
            title: "All Inclusive",
            description: "High-speed WiFi, AC, projector, whiteboard, and refreshments included in every booking.",
            savings: "No additional equipment charges"
        }
    ];

    const comparisonData = [
        { feature: "Initial Investment", traditional: "₹25,000-50,000", hourly: "₹200/hour" },
        { feature: "Minimum Commitment", traditional: "6-12 months", hourly: "1 hour" },
        { feature: "Flexibility", traditional: "Fixed timing", hourly: "24/7 access" },
        { feature: "Equipment Setup", traditional: "Your responsibility", hourly: "Fully equipped" },
        { feature: "Monthly Cost", traditional: "₹8,000-15,000", hourly: "₹2,000-5,000" }
    ];

    return (
        <Flex 
            direction="column" 
            p={[5, 7, 10]} 
            bg="white" 
            gap={[8, 12]} 
            alignItems="center"
        >
            {/* Header Section */}
            <Flex direction="column" align="center" textAlign="center" maxW="800px">
                <Text fontSize={[24, 32, 40]} fontWeight="bold" color="dark" mb={4}>
                    Why Choose Hourly Office Solutions?
                </Text>
                <Text fontSize="lg" color="primary" fontWeight="semibold" mb={2}>
                    Warangal's first and most flexible co-working solution
                </Text>
                <Text fontSize="md" color="gray.600">
                    Join the growing community of professionals, students, and entrepreneurs who are choosing 
                    smarter, more flexible workspace solutions.
                </Text>
            </Flex>

            {/* Benefits Grid */}
            <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={6}
                w="100%"
                maxW="1200px"
            >
                {benefits.map((benefit, index) => (
                    <Card.Root 
                        key={index}
                        p={6}
                        borderRadius={15}
                        boxShadow="md"
                        bg="gray.50"
                        _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                        transition="all 0.3s ease"
                        textAlign="center"
                    >
                        <Card.Body gap={4}>
                            <Text fontSize="4xl" mb={2}>{benefit.icon}</Text>
                            <Text fontSize="xl" fontWeight="bold" color="dark" mb={2}>
                                {benefit.title}
                            </Text>
                            <Text fontSize="sm" color="gray.700" mb={3}>
                                {benefit.description}
                            </Text>
                            <Box bg="primary" color="white" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                                {benefit.savings}
                            </Box>
                        </Card.Body>
                    </Card.Root>
                ))}
            </Grid>

            {/* Comparison Table */}
            <Flex direction="column" w="100%" maxW="800px" align="center">
                <Text fontSize={[20, 26, 32]} fontWeight="bold" color="dark" mb={6} textAlign="center">
                    Traditional Office vs Hourly Office
                </Text>
                <Card.Root w="100%" borderRadius={15} overflow="hidden" boxShadow="lg">
                    <Card.Body p={0}>
                        {/* Header */}
                        <Flex bg="primary" color="white" p={4}>
                            <Text flex="1" fontWeight="bold" textAlign="center">Feature</Text>
                            <Text flex="1" fontWeight="bold" textAlign="center">Traditional Office</Text>
                            <Text flex="1" fontWeight="bold" textAlign="center">Hourly Office</Text>
                        </Flex>
                        
                        {/* Rows */}
                        {comparisonData.map((row, index) => (
                            <Flex 
                                key={index}
                                p={4}
                                bg={index % 2 === 0 ? "gray.50" : "white"}
                                align="center"
                            >
                                <Text flex="1" fontWeight="semibold" textAlign="center" color="dark">
                                    {row.feature}
                                </Text>
                                <Text flex="1" textAlign="center" color="gray.600" fontSize="sm">
                                    {row.traditional}
                                </Text>
                                <Text flex="1" textAlign="center" color="support" fontWeight="bold" fontSize="sm">
                                    {row.hourly}
                                </Text>
                            </Flex>
                        ))}
                    </Card.Body>
                </Card.Root>
            </Flex>

            {/* Success Stories Preview */}
            <Flex direction="column" w="100%" maxW="1000px" align="center">
                <Text fontSize={[20, 26, 32]} fontWeight="bold" color="dark" mb={6} textAlign="center">
                    Success Stories from Warangal
                </Text>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} w="100%">
                    {[
                        {
                            name: "Priya S.",
                            role: "Freelance Designer", 
                            story: "Perfect for client meetings! No need to rent expensive office space.",
                            hours: "8 hours/month"
                        },
                        {
                            name: "Rajesh T.",
                            role: "Startup Founder",
                            story: "Our team meets here twice a week. Professional environment at great prices.",
                            hours: "16 hours/month"
                        },
                        {
                            name: "Sneha M.",
                            role: "Engineering Student",
                            story: "Evening plan is perfect for group studies and project work.",
                            hours: "Evening Plan subscriber"
                        }
                    ].map((story, index) => (
                        <Card.Root key={index} p={4} borderRadius={10} bg="blue.50" textAlign="center">
                            <Card.Body gap={3}>
                                <Text fontSize="sm" fontStyle="italic" color="gray.700">
                                    "{story.story}"
                                </Text>
                                <Box>
                                    <Text fontSize="sm" fontWeight="bold" color="dark">{story.name}</Text>
                                    <Text fontSize="xs" color="gray.600">{story.role}</Text>
                                    <Text fontSize="xs" color="primary" fontWeight="semibold">{story.hours}</Text>
                                </Box>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </Grid>
            </Flex>
        </Flex>
    );
};

export default WhyChooseHourly;
