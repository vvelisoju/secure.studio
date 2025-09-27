
import { Box, Flex, Button, Text, Span, Link, Grid } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const ContactForm = () => (
  <Flex
    direction="column"
    gap={3}
    p={6}
    border="2px solid"
    borderColor="blue.500"
    borderRadius="xl"
    bg="white"
    w="100%"
    maxW="400px"
    boxShadow="2xl"
    position="relative"
  >
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
    >
      🔥 Limited Spots Available
    </Box>

    <Box textAlign="center" mb={3}>
      <Text fontSize="xl" fontWeight="bold" color="blue.600" mb={1}>
        Get Instant Quote & Save 30%
      </Text>
      <Text fontSize="sm" color="gray.700" fontWeight="semibold" mb={2}>
        ⚡ Quick response in 15 minutes
      </Text>
      <Box bg="green.50" p={3} borderRadius="md">
        <Text fontSize="sm" color="green.700" fontWeight="bold">
          🎯 Special Launch Offer: First Week Only ₹99!
        </Text>
      </Box>
    </Box>

    <input
      type="text"
      placeholder="Your Name"
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        border: "2px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s",
      }}
    />
    <input
      type="email"
      placeholder="Your Email"
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        border: "2px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s",
      }}
    />
    <input
      type="tel"
      placeholder="Phone Number"
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        border: "2px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.2s",
      }}
    />
    <select
      style={{
        padding: "12px 16px",
        borderRadius: "8px",
        border: "2px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
        backgroundColor: "white",
        transition: "border-color 0.2s",
      }}
    >
      <option value="">What service interests you?</option>
      <option value="hourly">
        🕐 Hourly Office (₹200/hr) - Perfect for meetings
      </option>
      <option value="evening">
        🌙 Evening Office (₹1,500/month) - Student-friendly
      </option>
      <option value="coworking">
        🏢 Co-working Space - Professional environment
      </option>
      <option value="meeting">👥 Meeting Rooms - Fully equipped</option>
      <option value="virtual">📱 Virtual Office - Business address</option>
      <option value="tour">🏢 Free Tour & Consultation</option>
    </select>

    <Button
      bg="orange.500"
      color="white"
      _hover={{ bg: "orange.600", transform: "scale(1.02)" }}
      transition="all 0.2s"
      size="lg"
      fontWeight="bold"
      borderRadius="xl"
      boxShadow="lg"
    >
      🚀 Claim Your Spot Now
    </Button>

    <Box fontSize="xs" color="gray.600" textAlign="center">
      <Text fontWeight="bold" color="green.600" mb={1}>
        ✅ Instant confirmation • ✅ No hidden fees • ✅ Cancel anytime
      </Text>
      <Text fontSize="xs" color="gray.500">
        Join 500+ professionals who chose Warangal's #1 co-working space
      </Text>
    </Box>
  </Flex>
);

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
    <Text fontSize="lg" fontWeight="bold" mb={2} textShadow="0 1px 2px rgba(0,0,0,0.3)">
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
            <Text
              fontSize={{ base: 16, md: 20, lg: 24 }}
              fontWeight="600"
              color="rgba(255,255,255,0.95)"
              lineHeight="1.2"
              mb={2}
              letterSpacing="1px"
              textTransform="uppercase"
              display="flex"
              alignItems="center"
              gap={2}
              textShadow="0 2px 8px rgba(0,0,0,0.4)"
            >
              🏢 Premium Workspace Solutions
            </Text>
            <Text
              fontSize={{ base: 42, md: 64, lg: 76 }}
              fontWeight="900"
              lineHeight="0.85"
              mb={4}
              background="linear-gradient(135deg, #ffffff 0%, #f8fafc 20%, #e2e8f0 40%, #cbd5e1 60%, #94a3b8 80%, #64748b 100%)"
              backgroundClip="text"
              color="transparent"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-3px"
              textShadow="0 12px 24px rgba(0,0,0,0.4)"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "3px",
                left: "3px",
                right: "0",
                bottom: "0",
                background: "rgba(0,0,0,0.3)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                zIndex: -1,
              }}
            >
              Secure Studio
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              gap={{ base: 2, md: 4 }}
              mb={4}
            >
              <Text
                fontSize={{ base: 20, md: 26, lg: 30 }}
                fontWeight="700"
                color="rgba(255,255,255,0.95)"
                lineHeight="1.2"
                letterSpacing="0.5px"
                textShadow="0 3px 6px rgba(0,0,0,0.4)"
              >
                Your Success Hub in Warangal
              </Text>
              <Box
                bg="rgba(255,255,255,0.2)"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="bold"
                whiteSpace="nowrap"
                boxShadow="0 6px 20px rgba(0,0,0,0.3)"
                backdropFilter="blur(12px)"
                border="1px solid rgba(255,255,255,0.3)"
              >
                ⚡ Starting at ₹199!
              </Box>
            </Flex>
          </Box>

          {/* Service Cards Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={4}
            w="100%"
          >
            <ServiceCard
              icon="🕐"
              title="Hourly Office"
              price="₹200/hr"
              description="Perfect for meetings & calls"
            />
            <ServiceCard
              icon="🌙"
              title="Evening Office"
              price="₹1,500/mo"
              description="Student-friendly evening access"
              highlight={true}
            />
            <ServiceCard
              icon="🏢"
              title="Co-working"
              price="From ₹3,000"
              description="Professional workspace"
            />
          </Grid>

          {/* CTA Buttons */}
          <Flex gap={4} wrap="wrap" w="100%">
            <Link href="/#hourly-packages">
              <Button
                bg="linear-gradient(135deg, rgba(255,165,0,0.9) 0%, rgba(255,140,0,1) 100%)"
                color="white"
                size="lg"
                fontWeight="bold"
                borderRadius="xl"
                boxShadow="0 10px 30px rgba(255,165,0,0.4)"
                px={8}
                py={6}
                fontSize="md"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255,255,255,0.2)"
                _hover={{
                  bg: "linear-gradient(135deg, rgba(255,165,0,1) 0%, rgba(255,120,0,1) 100%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 40px rgba(255,165,0,0.5)",
                }}
                transition="all 0.3s"
              >
                🔥 Book Now - Starting ₹199!
              </Button>
            </Link>
            <Link href="/#getinTouch">
              <Button
                bg="rgba(255,255,255,0.15)"
                color="white"
                size="lg"
                borderWidth="2px"
                borderColor="rgba(255,255,255,0.4)"
                px={6}
                py={6}
                fontSize="md"
                fontWeight="bold"
                backdropFilter="blur(12px)"
                boxShadow="0 8px 25px rgba(255,255,255,0.1)"
                _hover={{
                  bg: "rgba(255,255,255,0.25)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 35px rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.6)",
                }}
                transition="all 0.3s"
              >
                📞 Free Tour
              </Button>
            </Link>
          </Flex>

          {/* Enhanced Value Proposition */}
          <Box
            bg="rgba(255,255,255,0.12)"
            p={6}
            borderRadius="xl"
            boxShadow="0 12px 40px rgba(0,0,0,0.15)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.25)"
            backdropFilter="blur(15px)"
          >
            <Text
              fontSize={{ base: 18, md: 20 }}
              fontWeight="bold"
              color="white"
              mb={4}
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              🚀 <strong>Why Choose SecureStudio?</strong>
            </Text>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
            >
              <Flex align="center" gap={3}>
                <Text fontSize="18px" color="rgba(255,255,255,0.9)" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                  🏢 <strong>Co-working Spaces</strong> - Professional environment
                </Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Text fontSize="18px" color="rgba(255,255,255,0.9)" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                  ⏰ <strong>Hourly Offices</strong> - Pay per use flexibility
                </Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Text fontSize="18px" color="rgba(255,255,255,0.9)" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                  🌙 <strong>Evening Plans</strong> - Student-friendly rates
                </Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Text fontSize="18px" color="rgba(255,255,255,0.9)" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                  👥 <strong>Meeting Rooms</strong> - Fully equipped spaces
                </Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Text fontSize="18px" color="rgba(255,255,255,0.9)" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                  📱 <strong>Virtual Office</strong> - Business address solution
                </Text>
              </Flex>
              <Flex align="center" gap={3}>
                <Text fontSize="18px" color="rgba(255,255,255,0.9)" fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                  💰 <strong>Save 70%</strong> - Compared to traditional offices
                </Text>
              </Flex>
            </Grid>
          </Box>

          {/* Enhanced Trust Indicators */}
          <Box>
            <Flex align="center" gap={4} mb={3} wrap="wrap">
              <Text fontSize="sm" fontWeight="bold" color="rgba(255,255,255,0.95)" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                🏆 Warangal's #1 Co-working Space
              </Text>
              <Text fontSize="sm" color="rgba(255,255,255,0.95)" fontWeight="bold" textShadow="0 1px 2px rgba(0,0,0,0.3)">
                🔥 500+ Happy Members
              </Text>
            </Flex>
            <Flex
              align="center"
              gap={3}
              fontSize="sm"
              color="rgba(255,255,255,0.85)"
              wrap="wrap"
            >
              <Text fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">⭐ 4.9/5 Rating</Text>
              <Text>•</Text>
              <Text fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">✅ Premium Amenities</Text>
              <Text>•</Text>
              <Text fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">✅ 24/7 Access</Text>
              <Text>•</Text>
              <Text fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.3)">✅ Government Registered</Text>
            </Flex>
          </Box>
        </Flex>

        {/* Right Contact Form */}
        <Flex
          w={{ base: "100%", xl: "35%" }}
          alignItems="flex-start"
          justifyContent="center"
        >
          <ContactForm />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Banner;
