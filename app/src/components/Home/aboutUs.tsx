
import { Flex, Text, Image, Span, Card, Button, Box } from "@chakra-ui/react";
import People from "../../assets/login-people.png";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";

const AboutUs = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate("/subscriptions/book");
        } else {
            navigate("/auth");
        }
    };

    const stats = [
        { number: "500+", label: "Happy Customers", icon: "👥" },
        { number: "2000+", label: "Hours Booked", icon: "⏰" },
        { number: "50+", label: "Companies Served", icon: "🏢" },
        { number: "99%", label: "Satisfaction", icon: "⭐" },
    ];

    const features = [
        {
            icon: "🚀",
            title: "First in Warangal",
            desc: "Pioneering co-working solutions",
        },
        {
            icon: "🌐",
            title: "Strategic Location",
            desc: "Central & accessible",
        },
        {
            icon: "💼",
            title: "Professional Space",
            desc: "Modern & productive",
        },
        {
            icon: "🤝",
            title: "Community Focused",
            desc: "Building connections",
        },
    ];

    return (
        <Box
            id="aboutUs"
            minH="100vh"
            bg="linear-gradient(135deg, #0f172a 0%, #1e293b 15%, #334155 30%, #475569 45%, #64748b 60%, #94a3b8 75%, #cbd5e1 90%, #f1f5f9 100%)"
            position="relative"
            overflow="hidden"
            w="100%"
            maxW="100vw"
        >
            {/* Enhanced Professional Wave Background */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={0}
            >
                {/* Primary Wave Layer */}
                <svg
                    viewBox="0 0 1440 320"
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "auto",
                        opacity: 0.3,
                        zIndex: 1,
                        transform: "rotate(180deg)",
                    }}
                >
                    <defs>
                        <linearGradient id="aboutWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#aboutWave1)"
                        d="M0,160L24,165.3C48,171,96,181,144,176C192,171,240,149,288,144C336,139,384,149,432,165.3C480,181,528,203,576,197.3C624,192,672,160,720,154.7C768,149,816,171,864,186.7C912,203,960,213,1008,208C1056,203,1104,181,1152,165.3C1200,149,1248,139,1296,144C1344,149,1392,171,1416,181.3L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
                    />
                </svg>
                
                {/* Secondary Wave Layer */}
                <svg
                    viewBox="0 0 1440 320"
                    style={{
                        position: "absolute",
                        top: "-30px",
                        left: "0",
                        width: "100%",
                        height: "auto",
                        opacity: 0.25,
                        zIndex: 2,
                        transform: "rotate(180deg)",
                    }}
                >
                    <defs>
                        <linearGradient id="aboutWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(59,130,246,0.4)" />
                            <stop offset="50%" stopColor="rgba(147,197,253,0.3)" />
                            <stop offset="100%" stopColor="rgba(59,130,246,0.4)" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#aboutWave2)"
                        d="M0,128L24,133.3C48,139,96,149,144,138.7C192,128,240,96,288,96C336,96,384,128,432,149.3C480,171,528,181,576,170.7C624,160,672,128,720,117.3C768,107,816,117,864,138.7C912,160,960,192,1008,197.3C1056,203,1104,181,1152,170.7C1200,160,1248,160,1296,165.3C1344,171,1392,181,1416,186.7L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
                    />
                </svg>

                {/* Bottom Wave Layer */}
                <svg
                    viewBox="0 0 1440 320"
                    style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "auto",
                        opacity: 0.2,
                        zIndex: 3,
                    }}
                >
                    <defs>
                        <linearGradient id="aboutWave3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
                            <stop offset="50%" stopColor="rgba(165,180,252,0.2)" />
                            <stop offset="100%" stopColor="rgba(99,102,241,0.3)" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#aboutWave3)"
                        d="M0,224L24,218.7C48,213,96,203,144,202.7C192,203,240,213,288,213.3C336,213,384,203,432,181.3C480,160,528,128,576,128C624,128,672,160,720,181.3C768,203,816,213,864,213.3C912,213,960,203,1008,186.7C1056,171,1104,149,1152,144C1200,139,1248,149,1296,160C1344,171,1392,181,1416,186.7L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
                    />
                </svg>
            </Box>

            {/* Advanced Geometric Pattern Overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                opacity={0.05}
                backgroundImage="radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 1px, transparent 0), 
                                 radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 1px, transparent 0),
                                 radial-gradient(circle at 25% 75%, rgba(59,130,246,0.3) 1px, transparent 0),
                                 radial-gradient(circle at 75% 25%, rgba(147,197,253,0.2) 1px, transparent 0)"
                backgroundSize="100px 100px, 150px 150px, 80px 80px, 120px 120px"
                pointerEvents="none"
                zIndex={1}
            />

            {/* Enhanced Floating Elements */}
            <Box
                position="absolute"
                top="15%"
                right="8%"
                w="120px"
                h="120px"
                borderRadius="50%"
                bg="rgba(255,255,255,0.08)"
                opacity={0.7}
                animation="complexFloat 8s ease-in-out infinite"
                zIndex={1}
            />
            <Box
                position="absolute"
                top="50%"
                left="3%"
                w="80px"
                h="80px"
                borderRadius="50%"
                bg="rgba(59,130,246,0.1)"
                opacity={0.5}
                animation="complexFloat 10s ease-in-out infinite reverse"
                zIndex={1}
            />
            <Box
                position="absolute"
                bottom="25%"
                right="15%"
                w="100px"
                h="100px"
                borderRadius="50%"
                bg="rgba(147,197,253,0.06)"
                opacity={0.6}
                animation="complexFloat 9s ease-in-out infinite"
                zIndex={1}
            />

            {/* Professional Grid Overlay */}
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                backgroundImage="linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)"
                backgroundSize="50px 50px"
                opacity={0.3}
                pointerEvents="none"
                zIndex={1}
            />

            <style>
                {`
                  @keyframes complexFloat {
                    0%, 100% { 
                      transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
                    }
                    25% { 
                      transform: translateY(-30px) translateX(15px) rotate(90deg) scale(1.1); 
                    }
                    50% { 
                      transform: translateY(-20px) translateX(-10px) rotate(180deg) scale(0.9); 
                    }
                    75% { 
                      transform: translateY(-40px) translateX(5px) rotate(270deg) scale(1.05); 
                    }
                  }
                `}
            </style>

            <Flex
                direction="column"
                py={[8, 10, 12]}
                px={[4, 6, 8]}
                color="white"
                gap={8}
                alignItems="center"
                position="relative"
                zIndex={5}
                minH="100vh"
                justifyContent="center"
                maxW="1400px"
                mx="auto"
            >
                {/* Compact Header */}
                <Flex
                    direction="column"
                    align="center"
                    textAlign="center"
                    maxW="800px"
                    zIndex={1}
                >
                    <Text
                        fontSize={{ base: 32, md: 48, lg: 56 }}
                        fontWeight="900"
                        mb={4}
                        lineHeight="0.9"
                        background="linear-gradient(135deg, #ffffff 0%, #f8fafc 20%, #e2e8f0 40%, #cbd5e1 60%, #94a3b8 80%, #64748b 100%)"
                        backgroundClip="text"
                        color="transparent"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        letterSpacing="-2px"
                        textShadow="0 8px 16px rgba(0,0,0,0.4)"
                        position="relative"
                    >
                        About Warangal's First Co-Working Space
                    </Text>
                    <Text
                        fontSize={["lg", "xl"]}
                        opacity={0.95}
                        maxW="600px"
                        fontWeight="500"
                        textShadow="0 2px 4px rgba(0,0,0,0.2)"
                        lineHeight="1.6"
                    >
                        Introducing{" "}
                        <Span 
                            fontWeight="bold" 
                            color="#fbbf24"
                            textShadow="0 2px 4px rgba(0,0,0,0.5)"
                            position="relative"
                            _before={{
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                            }}
                        >
                            Warangal's first co-working space
                        </Span>{" "}
                        - a modern environment where professionals thrive and
                        succeed.
                    </Text>
                </Flex>

                {/* Compact Main Content */}
                <Flex
                    direction={["column", "column", "row"]}
                    gap={8}
                    alignItems="center"
                    w="100%"
                    maxW="1200px"
                    zIndex={1}
                >
                    {/* Enhanced Image */}
                    <Flex flex="1" justify="center">
                        <Box
                            position="relative"
                            p={4}
                            bg="rgba(255,255,255,0.1)"
                            borderRadius="24px"
                            backdropFilter="blur(20px)"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.2)"
                            boxShadow="0 20px 60px rgba(0,0,0,0.3)"
                            _hover={{
                                transform: "scale(1.05) rotate(1deg)",
                                boxShadow: "0 25px 80px rgba(0,0,0,0.4)",
                            }}
                            transition="all 0.3s ease"
                        >
                            <Image
                                src={People}
                                alt="People working in co-working space"
                                w={["280px", "320px"]}
                                h="auto"
                                borderRadius="20px"
                                fallback={
                                    <Box
                                        w={["280px", "320px"]}
                                        h={["200px", "240px"]}
                                        bg="rgba(255,255,255,0.1)"
                                        borderRadius="20px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        color="white"
                                        fontSize="lg"
                                        fontWeight="bold"
                                    >
                                        🏢 Co-working Space
                                    </Box>
                                }
                            />
                        </Box>
                    </Flex>

                    {/* Enhanced Stats & Features */}
                    <Flex flex="1" direction="column" gap={6}>
                        {/* Enhanced Stats Grid */}
                        <Flex wrap="wrap" gap={4} justify="center">
                            {stats.map((stat, index) => (
                                <Flex
                                    key={index}
                                    direction="column"
                                    align="center"
                                    bg="rgba(255,255,255,0.12)"
                                    p={4}
                                    borderRadius="xl"
                                    minW="110px"
                                    backdropFilter="blur(20px)"
                                    border="1px solid"
                                    borderColor="rgba(255,255,255,0.25)"
                                    _hover={{
                                        bg: "rgba(255,255,255,0.2)",
                                        transform: "translateY(-4px) scale(1.05)",
                                        boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                                    }}
                                    transition="all 0.3s ease"
                                    boxShadow="0 8px 25px rgba(0,0,0,0.2)"
                                    cursor="pointer"
                                >
                                    <Text fontSize="xl" mb={1}>
                                        {stat.icon}
                                    </Text>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color="#fbbf24"
                                        textShadow="0 1px 3px rgba(0,0,0,0.5)"
                                        filter="drop-shadow(0 1px 2px rgba(251,191,36,0.3))"
                                    >
                                        {stat.number}
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        opacity={0.95}
                                        textAlign="center"
                                    >
                                        {stat.label}
                                    </Text>
                                </Flex>
                            ))}
                        </Flex>

                        {/* Enhanced Features Grid */}
                        <Flex wrap="wrap" gap={4} justify="center">
                            {features.map((feature, index) => (
                                <Flex
                                    key={index}
                                    align="center"
                                    bg="rgba(255,255,255,0.12)"
                                    p={4}
                                    borderRadius="xl"
                                    w={["100%", "48%"]}
                                    backdropFilter="blur(15px)"
                                    border="1px solid"
                                    borderColor="rgba(255,255,255,0.25)"
                                    _hover={{
                                        bg: "rgba(255,255,255,0.2)",
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
                                    }}
                                    transition="all 0.3s ease"
                                    boxShadow="0 6px 20px rgba(0,0,0,0.15)"
                                    cursor="pointer"
                                >
                                    <Text fontSize="xl" mr={3}>
                                        {feature.icon}
                                    </Text>
                                    <Flex direction="column">
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="#fbbf24"
                                            textShadow="0 1px 2px rgba(0,0,0,0.5)"
                                            filter="drop-shadow(0 1px 2px rgba(251,191,36,0.2))"
                                        >
                                            {feature.title}
                                        </Text>
                                        <Text fontSize="xs" opacity={0.9}>
                                            {feature.desc}
                                        </Text>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>

                        {/* Enhanced CTA Button */}
                        <Button
                            bg="linear-gradient(135deg, rgba(255,165,0,0.9) 0%, rgba(255,140,0,1) 100%)"
                            color="white"
                            size="lg"
                            px={10}
                            py={6}
                            borderRadius="xl"
                            onClick={handleGetStarted}
                            _hover={{
                                bg: "linear-gradient(135deg, rgba(255,165,0,1) 0%, rgba(255,120,0,1) 100%)",
                                transform: "translateY(-3px) scale(1.05)",
                                boxShadow: "0 15px 40px rgba(255,165,0,0.4)",
                            }}
                            transition="all 0.3s ease"
                            alignSelf="center"
                            fontWeight="bold"
                            fontSize="md"
                            boxShadow="0 10px 30px rgba(255,165,0,0.3)"
                            border="1px solid"
                            borderColor="rgba(255,255,255,0.2)"
                            backdropFilter="blur(10px)"
                        >
                            🚀 Get Started Today
                        </Button>
                    </Flex>
                </Flex>

                {/* Enhanced Mission Statement */}
                <Card.Root
                    w="100%"
                    maxW="900px"
                    bg="rgba(255,255,255,0.12)"
                    borderRadius="24px"
                    p={6}
                    textAlign="center"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.25)"
                    backdropFilter="blur(20px)"
                    boxShadow="0 15px 50px rgba(0,0,0,0.25)"
                    _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
                    }}
                    transition="all 0.3s ease"
                    zIndex={1}
                >
                    <Card.Body p={0}>
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            mb={3}
                            color="#fbbf24"
                            textShadow="0 1px 3px rgba(0,0,0,0.5)"
                            filter="drop-shadow(0 1px 2px rgba(251,191,36,0.3))"
                        >
                            🎯 Our Mission
                        </Text>
                        <Text fontSize="sm" opacity={0.95} lineHeight="1.6">
                            "Empowering Warangal's entrepreneurial ecosystem with
                            world-class co-working solutions that foster innovation
                            and business growth."
                        </Text>
                    </Card.Body>
                </Card.Root>
            </Flex>
        </Box>
    );
};

export default AboutUs;
