
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

const WhatsAppWidget = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const phoneNumber = "919494644848"; // SecureStudio Warangal - Primary Contact
  const message = "Hi! I'm interested in SecureStudio's workspace solutions in Warangal. Can you help me with pricing and availability?";
  
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex={1000}
    >
      {/* Tooltip */}
      {(isHovered || showTooltip) && (
        <Box
          position="absolute"
          bottom="75px"
          right="0"
          bg="gray.800"
          color="white"
          px={4}
          py={3}
          borderRadius="lg"
          fontSize="sm"
          fontWeight="medium"
          whiteSpace="nowrap"
          boxShadow="0 8px 25px rgba(0,0,0,0.2)"
          _after={{
            content: '""',
            position: "absolute",
            top: "100%",
            right: "20px",
            borderWidth: "8px 8px 0 8px",
            borderStyle: "solid",
            borderColor: "gray.800 transparent transparent transparent"
          }}
        >
          Chat with us on WhatsApp
          <br />
          <Box fontSize="xs" color="gray.300">+91 94946 44848</Box>
        </Box>
      )}
      
      <Box
        cursor="pointer"
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
      <Button
        bg="linear-gradient(135deg, #25D366 0%, #128C7E 100%)"
        color="white"
        borderRadius="50%"
        w="60px"
        h="60px"
        p={0}
        boxShadow="0 8px 25px rgba(37, 211, 102, 0.4)"
        _hover={{
          transform: "scale(1.1)",
          boxShadow: "0 12px 35px rgba(37, 211, 102, 0.6)",
        }}
        transition="all 0.3s ease"
        border="3px solid white"
        animation={isHovered ? "pulse 1.5s infinite" : "none"}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z"/>
        </svg>
      </Button>

      {/* Pulse animation styles */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            }
            70% {
              box-shadow: 0 0 0 20px rgba(37, 211, 102, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
          }
        `}
      </style>
      </Box>
    </Box>
  );
};

export default WhatsAppWidget;
