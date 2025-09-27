import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from "./dialog";
import { Flex, Text, Button, Box, Link } from "@chakra-ui/react";
import * as React from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const primaryNumber = "9494644848";

  const handleCall = () => {
    window.location.href = `tel:+91${primaryNumber}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in booking a workspace at Secure Studio. Can you help me with the details?",
    );
    window.open(`https://wa.me/91${primaryNumber}?text=${message}`, "_blank");
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <DialogContent
        maxW="420px"
        borderRadius="2xl"
        bg="white"
        boxShadow="0 25px 50px rgba(0,0,0,0.15)"
        border="1px solid"
        borderColor="gray.200"
        position="relative"
      >
        <DialogHeader>
          <DialogTitle
            fontSize="2xl"
            fontWeight="bold"
            color="gray.800"
            textAlign="center"
            mb={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            📞 Call Us Now
          </DialogTitle>
          {/* <Text
            fontSize="md"
            color="gray.600"
            textAlign="center"
            mb={4}
            fontWeight="medium"
          >
            Get instant assistance for your workspace needs
          </Text> */}
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody p={6}>
          <Flex direction="column" gap={6}>
            {/* Main Contact Card */}
            <Box
              p={6}
              bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
              borderRadius="2xl"
              border="2px solid"
              borderColor="blue.200"
              _hover={{
                borderColor: "blue.400",
                bg: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 30px rgba(59, 130, 246, 0.2)",
              }}
              transition="all 0.3s ease"
              position="relative"
            >
              <Box
                position="absolute"
                top={-2}
                right={-2}
                bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
                boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)"
              >
                Available Now
              </Box>

              <Flex direction="column" gap={4} align="center">
                <Box textAlign="center">
                  <Text
                    fontSize="3xl"
                    fontWeight="black"
                    color="gray.800"
                    letterSpacing="1px"
                    mb={2}
                  >
                    +91 {primaryNumber}
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Direct line to our workspace specialists
                  </Text>
                </Box>

                <Flex gap={4} w="100%">
                  <Button
                    flex={1}
                    onClick={handleCall}
                    bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    color="white"
                    size="lg"
                    borderRadius="xl"
                    _hover={{
                      bg: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                    }}
                    transition="all 0.2s"
                    fontWeight="bold"
                    boxShadow="0 6px 20px rgba(16, 185, 129, 0.3)"
                    py={6}
                  >
                    <Flex align="center" gap={2}>
                      <Text fontSize="18px">📞</Text>
                      <Text>Call Now</Text>
                    </Flex>
                  </Button>

                  <Button
                    flex={1}
                    onClick={handleWhatsApp}
                    bg="linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
                    color="white"
                    size="lg"
                    borderRadius="xl"
                    _hover={{
                      bg: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)",
                    }}
                    transition="all 0.2s"
                    fontWeight="bold"
                    boxShadow="0 6px 20px rgba(37, 211, 102, 0.3)"
                    py={6}
                  >
                    <Flex align="center" gap={2}>
                      <Text fontSize="18px">💬</Text>
                      <Text>WhatsApp</Text>
                    </Flex>
                  </Button>
                </Flex>
              </Flex>
            </Box>

            {/* Business Hours */}
            <Box
              bg="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
              p={5}
              borderRadius="xl"
              border="1px solid"
              borderColor="blue.300"
              textAlign="center"
            >
              <Text fontSize="md" color="blue.800" fontWeight="bold" mb={3}>
                🕒 Business Hours
              </Text>
              <Text fontSize="sm" color="blue.700" fontWeight="medium" mb={1}>
                Monday - Saturday: 09:00 AM - 08:00 PM
              </Text>
              <Text fontSize="sm" color="blue.700" fontWeight="medium">
                Sunday: Closed
              </Text>
            </Box>

            {/* Trust Indicators */}
            <Box textAlign="center">
              <Flex justify="center" gap={6} mb={2}>
                <Text fontSize="sm" color="green.600" fontWeight="bold">
                  ⚡ Quick Response
                </Text>
                <Text fontSize="sm" color="blue.600" fontWeight="bold">
                  🏢 Premium Location
                </Text>
              </Flex>
              <Text fontSize="xs" color="gray.500">
                Located at Warangal's Prime Business District
              </Text>
            </Box>
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
