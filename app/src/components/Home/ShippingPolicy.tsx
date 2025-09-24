import { Box, Text, Heading } from "@chakra-ui/react";

const ShippingPolicy = () => {
    return (
        <Box maxW="800px" mx="auto" py={10} px={5}>
            <Heading as="h1" size="xl" mb={6}>Shipping & Digital Delivery Policy</Heading>

            <Text mb={4}>
                At SecureStudio, we provide digital services related to workspace access and memberships. 
                We do not ship physical products. Please review our digital delivery process below.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>1. Digital Service Delivery</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}><b>Membership Confirmation:</b> Once a payment is successfully processed, the membership confirmation and receipt will be sent via email.</Box>
                <Box as="li" mb={2}><b>Access Credentials:</b> For private offices or secure areas, digital access credentials (if applicable) will be shared via email or SMS.</Box>
                <Box as="li" mb={2}><b>Invoices & Payment Receipts:</b> All invoices and receipts will be emailed to the registered email address.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>2. Processing Time</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>Membership activations and access credentials are usually processed <b>instantly</b> upon successful payment.</Box>
                <Box as="li" mb={2}>In rare cases, processing may take up to <b>24 hours</b>. If you have not received confirmation within this time, please contact support.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>3. Non-Delivery Issues</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}><b>Incorrect Email Address:</b> Ensure that the email provided during registration is correct. SecureStudio is not responsible for failed deliveries due to incorrect information.</Box>
                <Box as="li" mb={2}><b>Spam Folder:</b> If you do not receive your membership confirmation, please check your spam/junk folder.</Box>
                <Box as="li" mb={2}><b>Technical Delays:</b> If there is a system-related delay, our team will notify you and resolve the issue as soon as possible.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>4. Contact & Support</Heading>
            <Text>
                If you have any issues with receiving your digital membership details, invoices, or access credentials, please contact us at:{" "}
                <Text as="span" color="blue.500" cursor="pointer">support@secure.studio</Text>.
            </Text>
        </Box>
    );
};

export default ShippingPolicy;
