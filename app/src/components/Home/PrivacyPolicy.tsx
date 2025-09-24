import { Box, Text, Heading, Link } from "@chakra-ui/react";

const PrivacyPolicy = () => {
    return (
        <Box maxW="800px" mx="auto" py={10} px={5}>
            <Heading as="h1" size="xl" mb={6}>Privacy Policy</Heading>

            <Text mb={4}>
                At SecureStudio, we are committed to protecting your privacy and ensuring that your personal data is handled responsibly. 
                This policy outlines how we collect, use, and safeguard your information.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>1. Information We Collect</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}><b>Personal Information:</b> When you sign up, we collect your name, email address, phone number, and billing details.</Box>
                <Box as="li" mb={2}><b>Payment Information:</b> We securely process payments via third-party providers (e.g., Razorpay). We do not store credit/debit card details.</Box>
                <Box as="li" mb={2}><b>Usage Data:</b> We may track your interactions with our platform to improve user experience.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>2. How We Use Your Information</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>To manage your account and provide services.</Box>
                <Box as="li" mb={2}>To process payments and issue invoices.</Box>
                <Box as="li" mb={2}>To send important updates, promotions, and service notifications.</Box>
                <Box as="li" mb={2}>To improve our platform based on user interactions.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>3. Data Security</Heading>
            <Text>
                We use industry-standard security measures to protect your personal information from unauthorized access, alteration, 
                or disclosure. However, no data transmission over the internet can be guaranteed as 100% secure.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>4. Third-Party Services</Heading>
            <Text>
                We may share necessary data with trusted third-party payment processors and service providers to facilitate transactions. 
                We do not sell or rent your personal information to any third parties.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>5. Your Rights</Heading>
            <Box as="ul" pl={5}>
                <Box as="li" mb={2}>You can access, update, or delete your personal data by contacting us.</Box>
                <Box as="li" mb={2}>You can opt out of promotional emails at any time.</Box>
                <Box as="li" mb={2}>You can request the deletion of your account and associated data.</Box>
            </Box>

            <Heading as="h2" size="md" mt={6} mb={3}>6. Policy Updates</Heading>
            <Text>
                We may update this policy from time to time. Any changes will be posted on this page with an updated revision date.
            </Text>

            <Heading as="h2" size="md" mt={6} mb={3}>7. Contact Us</Heading>
            <Text>
                If you have any questions or concerns about this Privacy Policy, please contact us at:{" "}
                <Link href="mailto:privacy@secure.studio" color="blue.500">privacy@secure.studio</Link>.
            </Text>
        </Box>
    );
};

export default PrivacyPolicy;
