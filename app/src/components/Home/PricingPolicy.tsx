import { Box, Text, Heading } from "@chakra-ui/react";

const PricingPolicy = () => {
    return (
        <Box maxW="800px" mx="auto" py={10} px={5}>
            <Heading as="h1" size="xl" mb={6}>Pricing Policy</Heading>

            <Text mb={4}>
                Our pricing is transparent and based on the type of workspace selected. We offer hourly, daily, and monthly plans.
            </Text>

            <Text fontWeight="bold" mb={2}>Payment Terms:</Text>
            <Box as="ul" pl={5}>
                <Box as="li">All payments must be made in advance.</Box>
                <Box as="li">Pricing is subject to change with prior notice.</Box>
                <Box as="li">Discounts and promotions may apply.</Box>
                <Box as="li">We accept payments via credit/debit cards, UPI, and bank transfers.</Box>
                <Box as="li">Invoices will be emailed upon successful payment.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>Discounts & Offers</Heading>
            <Box as="ul" pl={5}>
                <Box as="li">Long-term commitments (3+ months) receive a 10% discount.</Box>
                <Box as="li">Special discounts available for startups and students.</Box>
                <Box as="li">Referral programs offer additional benefits.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>Cancellation & Refunds</Heading>
            <Text>
                Cancellations must be made at least 24 hours before the booking. Refunds will be processed according to our 
                <Text as="span" color="blue.500" cursor="pointer"> Cancellation Policy</Text>.
            </Text>

        </Box>
    );
};

export default PricingPolicy;
