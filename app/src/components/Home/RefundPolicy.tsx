import { Box, Text, Heading } from "@chakra-ui/react";

const CancellationPolicy = () => {
    return (
        <Box maxW="800px" mx="auto" py={10} px={5}>
            <Heading as="h1" size="xl" mb={6}>Cancellation & Refund Policy</Heading>

            <Text mb={4}>
                At SecureStudio, we strive to maintain fairness in our cancellation and refund policies. 
                Please read the following terms carefully before booking.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>Cancellation Policy</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}><b>Hourly & Daily Bookings:</b> Cancellations must be made at least <b>24 hours</b> before the booking start time to avoid charges.</Box>
                <Box as="li" mb={2}><b>Monthly & Yearly Subscriptions:</b> <b>Non-refundable.</b> Once paid, subscription fees are non-refundable, regardless of usage. Early cancellations are allowed, but the **security deposit is non-refundable** unless the full lock-in period is completed.</Box>
                <Box as="li" mb={2}><b>Private Offices (With Lock-in Period):</b> Early cancellations are allowed, but the **security deposit is non-refundable** unless the full lock-in period is completed.</Box>
                <Box as="li" mb={2}><b>Failure to Cancel:</b> Late cancellations or no-shows will be charged in full.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>Refund Policy</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}><b>Subscription Fees:</b> <b>Non-refundable.</b> No refunds are issued for monthly or yearly subscriptions.</Box>
                <Box as="li" mb={2}><b>Security Deposit Refund:</b> Refunds for security deposits are only processed if the tenant **completes the lock-in period** and there are no outstanding dues or damages.</Box>
                <Box as="li" mb={2}><b>Deductions from Security Deposit:</b> If applicable, deductions may be made for damages, unpaid dues, or other agreed-upon penalties.</Box>
                <Box as="li" mb={2}><b>Processing Time:</b> Approved security deposit refunds will be processed within <b>7-10 business days</b> after completion of the lock-in period.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>How to Request a Cancellation</Heading>
            <Text>
                To cancel a booking or request a security deposit refund (if applicable), please contact us at <Text as="span" color="blue.500" cursor="pointer">support@secure.studio</Text> 
                &nbsp;with your booking details. Our team will review your request and respond promptly.
            </Text>
        </Box>
    );
};

export default CancellationPolicy;
