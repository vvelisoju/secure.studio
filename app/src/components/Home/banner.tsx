import { Box, Flex, Button, Text, Span, Link, Grid } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const QuickActionCards = () => {
  const handleWhatsAppContact = () => {
    const phoneNumber = "919494644848";
    const message =
      "Hi! I'd like to know more about SecureStudio's workspace solutions in Warangal.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCallNow = () => {
    window.location.href = "tel:+919494644848";
  };

  return (
    <Flex direction="column" gap={4} w="100%" maxW="400px" position="relative">
      {/* Urgency Badge */}
      <Box
        position="absolute"
        top={-3}
        right={3}
        bg="red.500"
        color="white"
        px={3}
        py={1}
        borderRadius="full"
        fontSize="xs"
        fontWeight="bold"
        animation="pulse 2s infinite"
        zIndex={10}
      >
        🔥 Limited Spots Available
      </Box>

      {/* Main Offer Card */}
      <Box
        bg="rgba(255,255,255,0.95)"
        p={6}
        borderRadius="xl"
        boxShadow="0 20px 60px rgba(0,0,0,0.15)"
        border="2px solid"
        borderColor="blue.500"
        backdropFilter="blur(10px)"
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="bold" color="blue.600" mb={2}>
          🎯 Special Launch Offer
        </Text>
        <Text fontSize="2xl" fontWeight="900" color="orange.500" mb={2}>
          First Day Only ₹99!
        </Text>
        <Text fontSize="sm" color="gray.700" fontWeight="semibold">
          ⚡ Quick response in 15 minutes
        </Text>
      </Box>

      {/* Action Cards Grid */}
      <Grid templateColumns="1fr 1fr" gap={3}>
        {/* Free Tour Card */}
        <Link href="/#getinTouch">
          <Box
            bg="rgba(255,255,255,0.9)"
            p={4}
            borderRadius="lg"
            boxShadow="0 8px 25px rgba(0,0,0,0.1)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.3)"
            backdropFilter="blur(8px)"
            textAlign="center"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              bg: "rgba(255,255,255,1)",
            }}
            h="120px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Text fontSize="2xl" mb={2}>
              🏢
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="gray.800">
              Free Tour
            </Text>
            <Text fontSize="xs" color="gray.600">
              Visit & explore
            </Text>
          </Box>
        </Link>

        {/* WhatsApp Chat Card */}
        <Box
          bg="rgba(255,255,255,0.9)"
          p={4}
          borderRadius="lg"
          boxShadow="0 8px 25px rgba(0,0,0,0.1)"
          border="1px solid"
          borderColor="rgba(255,255,255,0.3)"
          backdropFilter="blur(8px)"
          textAlign="center"
          cursor="pointer"
          transition="all 0.3s"
          _hover={{
            transform: "translateY(-5px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            bg: "rgba(255,255,255,1)",
          }}
          h="120px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          onClick={handleWhatsAppContact}
        >
          <Text fontSize="2xl" mb={2}>
            💬
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            WhatsApp
          </Text>
          <Text fontSize="xs" color="gray.600">
            Instant chat
          </Text>
        </Box>

        {/* Call Now Card */}
        <Box
          bg="rgba(255,255,255,0.9)"
          p={4}
          borderRadius="lg"
          boxShadow="0 8px 25px rgba(0,0,0,0.1)"
          border="1px solid"
          borderColor="rgba(255,255,255,0.3)"
          backdropFilter="blur(8px)"
          textAlign="center"
          cursor="pointer"
          transition="all 0.3s"
          _hover={{
            transform: "translateY(-5px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            bg: "rgba(255,255,255,1)",
          }}
          h="120px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          onClick={handleCallNow}
        >
          <Text fontSize="2xl" mb={2}>
            📞
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="gray.800">
            Call Now
          </Text>
          <Text fontSize="xs" color="gray.600">
            +91 94946 44848
          </Text>
        </Box>

        {/* Book Online Card */}
        <Link href="/#hourly-packages">
          <Box
            bg="linear-gradient(135deg, rgba(255,165,0,0.9) 0%, rgba(255,140,0,1) 100%)"
            color="white"
            p={4}
            borderRadius="lg"
            boxShadow="0 8px 25px rgba(255,165,0,0.3)"
            textAlign="center"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              boxShadow: "0 15px 35px rgba(255,165,0,0.4)",
            }}
            h="120px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Text fontSize="2xl" mb={2}>
              🚀
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Book Online
            </Text>
            <Text fontSize="xs" opacity={0.9}>
              Starting ₹199
            </Text>
          </Box>
        </Link>
      </Grid>

      {/* Trust Indicators */}
      <Box
        bg="rgba(255,255,255,0.8)"
        p={3}
        borderRadius="lg"
        textAlign="center"
        fontSize="xs"
        color="gray.700"
        backdropFilter="blur(8px)"
      >
        <Text fontWeight="bold" color="green.600" mb={1}>
          ✅ Instant confirmation • ✅ No hidden fees • ✅ Cancel anytime
        </Text>
        <Text fontSize="xs" color="gray.500">
          Join 500+ professionals who chose Warangal's #1 co-working space
        </Text>
      </Box>
    </Flex>
  );
};

const ServiceCard = ({
  icon,
  title,
  price,
  description,
  highlight = false,
}: any) => (
  <Box
    bg={highlight ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)"}
    color="white"
    p={5}
    borderRadius="xl"
    boxShadow="0 8px 32px rgba(0,0,0,0.1)"
    border="1px solid"
    borderColor="rgba(255,255,255,0.2)"
    backdropFilter="blur(10px)"
    transform={highlight ? "scale(1.02)" : "scale(1)"}
    transition="all 0.3s ease"
    _hover={{
      transform: "scale(1.05)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
      bg: highlight ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
    }}
    textAlign="center"
    position="relative"
    minH="160px"
    display="flex"
    flexDirection="column"
    justifyContent="center"
  >
    {highlight && (
      <Box
        position="absolute"
        top={-2}
        right={-2}
        bg="rgba(255,165,0,0.9)"
        color="white"
        px={3}
        py={1}
        borderRadius="full"
        fontSize="xs"
        fontWeight="bold"
        backdropFilter="blur(5px)"
        border="1px solid rgba(255,255,255,0.3)"
      >
        POPULAR
      </Box>
    )}
    <Text fontSize="3xl" mb={2}>
      {icon}
    </Text>
    <Text
      fontSize="lg"
      fontWeight="bold"
      mb={2}
      textShadow="0 1px 2px rgba(0,0,0,0.3)"
    >
      {title}
    </Text>
    <Text
      fontSize="xl"
      fontWeight="bold"
      color={highlight ? "yellow.200" : "blue.200"}
      mb={2}
      textShadow="0 1px 2px rgba(0,0,0,0.3)"
    >
      {price}
    </Text>
    <Text fontSize="sm" opacity={0.9} textShadow="0 1px 2px rgba(0,0,0,0.3)">
      {description}
    </Text>
  </Box>
);

const Banner = () => {
  return (
    <Box
      id="banner"
      minH="100vh"
      bg="linear-gradient(135deg, #0f172a 0%, #1e293b 15%, #334155 30%, #475569 45%, #64748b 60%, #94a3b8 75%, #cbd5e1 90%, #f1f5f9 100%)"
      position="relative"
      overflow="hidden"
      w="100%"
      maxW="100vw"
    >
      {/* Enhanced Professional Wave Background */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
        {/* Primary Wave Layer */}
        <svg
          viewBox="0 0 1440 320"
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "auto",
            opacity: 0.3,
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave1)"
            d="M0,160L24,165.3C48,171,96,181,144,176C192,171,240,149,288,144C336,139,384,149,432,165.3C480,181,528,203,576,197.3C624,192,672,160,720,154.7C768,149,816,171,864,186.7C912,203,960,213,1008,208C1056,203,1104,181,1152,165.3C1200,149,1248,139,1296,144C1344,149,1392,171,1416,181.3L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          />
        </svg>

        {/* Secondary Wave Layer */}
        <svg
          viewBox="0 0 1440 320"
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "0",
            width: "100%",
            height: "auto",
            opacity: 0.25,
            zIndex: 2,
          }}
        >
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.4)" />
              <stop offset="50%" stopColor="rgba(147,197,253,0.3)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.4)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave2)"
            d="M0,128L24,133.3C48,139,96,149,144,138.7C192,128,240,96,288,96C336,96,384,128,432,149.3C480,171,528,181,576,170.7C624,160,672,128,720,117.3C768,107,816,117,864,138.7C912,160,960,192,1008,197.3C1056,203,1104,181,1152,170.7C1200,160,1248,160,1296,165.3C1344,171,1392,181,1416,186.7L1440,192L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          />
        </svg>

        {/* Tertiary Wave Layer */}
        <svg
          viewBox="0 0 1440 320"
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "0",
            width: "100%",
            height: "auto",
            opacity: 0.2,
            zIndex: 3,
          }}
        >
          <defs>
            <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
              <stop offset="50%" stopColor="rgba(165,180,252,0.2)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.3)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave3)"
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
      <Box
        position="absolute"
        top="30%"
        left="20%"
        w="60px"
        h="60px"
        borderRadius="50%"
        bg="rgba(255,255,255,0.04)"
        opacity={0.4}
        animation="complexFloat 12s ease-in-out infinite reverse"
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

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>

      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        py={{ base: 4, md: 6, lg: 8 }}
        minH="100vh"
        align="center"
        gap={{ base: 6, lg: 10 }}
        direction={{ base: "column", xl: "row" }}
        position="relative"
        zIndex={5}
      >
        {/* Left Content */}
        <Flex
          flex="1"
          direction="column"
          gap={{ base: 4, md: 6 }}
          maxW={{ base: "100%", xl: "60%" }}
        >
          {/* Main Heading */}
          <Box>
            <Box
              bg="rgba(255,255,255,0.15)"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="bold"
              whiteSpace="nowrap"
              boxShadow="0 6px 20px rgba(0,0,0,0.3)"
              backdropFilter="blur(12px)"
              border="1px solid rgba(255,255,255,0.3)"
              display="inline-flex"
              alignItems="center"
              gap={2}
              mb={3}
            >
              🏢 Premium Workspace Solutions
            </Box>
            <Text
              fontSize={{ base: 48, md: 72, lg: 88 }}
              fontWeight="900"
              lineHeight="0.9"
              mb={3}
              background="linear-gradient(135deg, #ffffff 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)"
              backgroundClip="text"
              color="transparent"
              fontFamily="'Inter', system-ui, -apple-system, sans-serif"
              letterSpacing="-4px"
              textShadow="0 8px 16px rgba(0,0,0,0.5)"
              position="relative"
            >
              Secure Studio
            </Text>
            <Box mb={6}>
              <Text
                fontSize={{ base: 22, md: 28, lg: 32 }}
                fontWeight="600"
                color="rgba(255,255,255,0.95)"
                lineHeight="1.3"
                letterSpacing="0.5px"
                textShadow="0 3px 6px rgba(0,0,0,0.4)"
                mb={3}
              >
                Your Success Hub in Warangal
              </Text>
              <Flex gap={3} wrap="wrap" align="center">
                <Box
                  bg="linear-gradient(135deg, rgba(255,165,0,0.9) 0%, rgba(255,140,0,1) 100%)"
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="bold"
                  whiteSpace="nowrap"
                  boxShadow="0 8px 25px rgba(255,165,0,0.4)"
                  backdropFilter="blur(12px)"
                  border="1px solid rgba(255,255,255,0.3)"
                  animation="pulse 2s infinite"
                >
                  🔥 Starting at ₹199 only!
                </Box>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="rgba(255,255,255,0.85)"
                  fontWeight="medium"
                >
                  ⚡ Quick setup in 15 minutes
                </Text>
              </Flex>
            </Box>
          </Box>

          {/* Service Cards Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(5, 1fr)",
            }}
            gap={4}
            w="100%"
          >
            <ServiceCard
              icon="🕐"
              title="Hourly Office"
              price="₹199/hr"
              description="Perfect for meetings & calls"
            />
            <ServiceCard
              icon="🌙"
              title="Evening Office"
              price="₹1,499/mo"
              description="Student-friendly evening access"
              highlight={true}
            />
            <ServiceCard
              icon="🏢"
              title="Co-working"
              price="From ₹1,999"
              description="Professional workspace"
            />
            <ServiceCard
              icon="📱"
              title="Virtual Office"
              price="₹1,499/mo"
              description="Business address solution"
            />
            <ServiceCard
              icon="👥"
              title="Meeting Rooms"
              price="₹350/hr"
              description="Fully equipped spaces"
            />
          </Grid>

          {/* CTA Buttons */}
          <Flex gap={4} wrap="wrap" w="100%" mb={6}>
            <Link href="/#hourly-packages">
              <Button
                bg="linear-gradient(135deg, rgba(16,185,129,1) 0%, rgba(5,150,105,1) 100%)"
                color="white"
                size="xl"
                fontWeight="bold"
                borderRadius="2xl"
                boxShadow="0 12px 35px rgba(16,185,129,0.4)"
                px={10}
                py={8}
                fontSize="lg"
                backdropFilter="blur(10px)"
                border="2px solid rgba(255,255,255,0.2)"
                _hover={{
                  bg: "linear-gradient(135deg, rgba(5,150,105,1) 0%, rgba(4,120,87,1) 100%)",
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 50px rgba(16,185,129,0.5)",
                }}
                transition="all 0.3s"
              >
                🚀 Book Now - ₹199 Special!
              </Button>
            </Link>
            <Link href="/#getinTouch">
              <Button
                bg="rgba(255,255,255,0.1)"
                color="white"
                size="xl"
                borderWidth="2px"
                borderColor="rgba(255,255,255,0.5)"
                px={8}
                py={8}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="2xl"
                backdropFilter="blur(15px)"
                boxShadow="0 10px 30px rgba(255,255,255,0.1)"
                _hover={{
                  bg: "rgba(255,255,255,0.2)",
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 40px rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.8)",
                }}
                transition="all 0.3s"
              >
                📞 Schedule Free Tour
              </Button>
            </Link>
          </Flex>

          {/* Value Proposition - Simplified */}
          <Box
            bg="rgba(255,255,255,0.12)"
            p={6}
            borderRadius="xl"
            boxShadow="0 12px 40px rgba(0,0,0,0.15)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.25)"
            backdropFilter="blur(15px)"
            textAlign="center"
          >
            <Text
              fontSize={{ base: 18, md: 20 }}
              fontWeight="bold"
              color="white"
              mb={3}
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              💰 <strong>Save 70% on Traditional Office Costs</strong>
            </Text>
            <Text
              fontSize="16px"
              color="rgba(255,255,255,0.9)"
              fontWeight="medium"
              textShadow="0 1px 2px rgba(0,0,0,0.3)"
            >
              Flexible workspace solutions for every business need •
              Professional environment • Premium amenities
            </Text>
          </Box>

          {/* Enhanced Trust Indicators */}
          <Box
            bg="rgba(255,255,255,0.08)"
            p={4}
            borderRadius="xl"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255,255,255,0.15)"
          >
            <Flex
              align="center"
              gap={6}
              mb={3}
              wrap="wrap"
              justify="space-between"
            >
              <Flex align="center" gap={2}>
                <Text
                  fontSize="lg"
                  color="rgba(255,255,255,0.95)"
                  fontWeight="bold"
                >
                  🏆
                </Text>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="rgba(255,255,255,0.95)"
                  >
                    Warangal's #1 Co-working
                  </Text>
                  <Text fontSize="xs" color="rgba(255,255,255,0.75)">
                    500+ Happy Members
                  </Text>
                </Box>
              </Flex>
              <Flex align="center" gap={2}>
                <Text fontSize="lg" color="rgba(255,255,255,0.95)">
                  ⭐
                </Text>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="rgba(255,255,255,0.95)"
                  >
                    4.9/5 Rating
                  </Text>
                  <Text fontSize="xs" color="rgba(255,255,255,0.75)">
                    Verified Reviews
                  </Text>
                </Box>
              </Flex>
            </Flex>
            <Flex
              align="center"
              gap={4}
              fontSize="xs"
              color="rgba(255,255,255,0.8)"
              wrap="wrap"
              justify="center"
            >
              <Text fontWeight="medium">✅ Premium Amenities</Text>
              <Text>•</Text>
              <Text fontWeight="medium">✅ 24/7 Access</Text>
              <Text>•</Text>
              <Text fontWeight="medium">✅ Government Registered</Text>
            </Flex>
          </Box>
        </Flex>

        {/* Right Quick Actions */}
        <Flex
          w={{ base: "100%", xl: "35%" }}
          alignItems="flex-start"
          justifyContent="center"
        >
          <QuickActionCards />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Banner;