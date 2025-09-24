import { Box, Text, Heading, Link } from "@chakra-ui/react";

const TermsAndConditions = () => {
    return (
        <Box maxW="800px" mx="auto" py={10} px={5}>
            <Heading as="h1" size="xl" mb={6}>Terms and Conditions</Heading>

            <Text mb={4}>
                Welcome to SecureStudio. By using our services, you agree to the following terms and conditions. 
                Please read them carefully before proceeding.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>1. Membership & Access</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>Membership grants access to SecureStudio’s co-working spaces, subject to availability.</Box>
                <Box as="li" mb={2}>Users must follow the workspace rules and guidelines.</Box>
                <Box as="li" mb={2}>Access is granted only for the duration of the paid plan (hourly, monthly, or yearly).</Box>
                <Box as="li" mb={2}>Unauthorized sharing of access credentials may result in termination of membership.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>2. Payments & Subscriptions</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>All payments must be made in advance before access is granted.</Box>
                <Box as="li" mb={2}>Subscriptions (monthly/yearly) are subject to a <b>lock-in period</b>, as specified during signup.</Box>
                <Box as="li" mb={2}>Subscription fees are <b>non-refundable</b>, even if the service is not utilized.</Box>
                <Box as="li" mb={2}>Security deposits (if applicable) are refundable only after completion of the lock-in period and subject to outstanding dues or damages.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>3. Cancellations & Refunds</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>Cancellations for hourly/daily bookings must be made <b>24 hours</b> in advance to avoid charges.</Box>
                <Box as="li" mb={2}>Subscriptions (monthly/yearly) <b>cannot be canceled before the lock-in period</b>.</Box>
                <Box as="li" mb={2}>Refunds for security deposits (if applicable) will be processed within <b>7-10 business days</b> after the completion of the lock-in period.</Box>
                <Box as="li" mb={2}>Any damages or unpaid dues will be deducted from the security deposit before the refund is issued.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>4. Code of Conduct</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>Members must respect other users and maintain a professional work environment.</Box>
                <Box as="li" mb={2}>Loud or disruptive behavior is not permitted.</Box>
                <Box as="li" mb={2}>Any damage to property will result in a penalty, deducted from the security deposit.</Box>
                <Box as="li" mb={2}>Illegal activities are strictly prohibited and may result in legal action.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>5. Liability & Security</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>SecureStudio is not responsible for any personal belongings lost or stolen on the premises.</Box>
                <Box as="li" mb={2}>Users must ensure their devices and data are secure. We do not guarantee protection against cyber threats.</Box>
                <Box as="li" mb={2}>SecureStudio reserves the right to deny access to any member violating these terms.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>6. Amendments</Heading>
            <Text>
                SecureStudio reserves the right to update these terms at any time. Users will be notified of any changes, and continued 
                use of the workspace constitutes acceptance of the revised terms.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>7. Contact Us</Heading>
            <Text>
                For any questions regarding these terms, please contact us at:{" "}
                <Link href="mailto:support@secure.studio" color="blue.500">support@secure.studio</Link>.
            </Text>
        </Box>
    );
};

export default TermsAndConditions;
