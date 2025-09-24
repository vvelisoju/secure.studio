import { Box, Text, List, Heading } from '@chakra-ui/react';
import { LuCircleCheck } from "react-icons/lu";

const InvoiceTerms = () => {
    return (
        <Box  id='InvoiceTerms' >
            <Heading as="h1" size="xl" mb={6} textAlign="center">
                Invoice – Terms & Conditions
            </Heading>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    1. Payment Terms
                </Heading>
                <List.Root gap={2} variant="plain" align="center">
                    <List.Item>
                        All payments must be made in advance as per the agreed membership plan.
                    </List.Item>
                    <List.Item>
                        Charges are exclusive of GST and other applicable taxes, which will be added separately.
                    </List.Item>
                    <List.Item>
                        Additional services (Meeting Hall, Conference Hall, Overtime, etc.) will be billed separately.
                    </List.Item>
                    <List.Item>
                        Payment must be completed by the due date mentioned in the invoice.
                    </List.Item>
                </List.Root>
            </Box>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    2. Late Payment Policy
                </Heading>
                <List.Root gap={2} variant="plain" align="center">
                    <List.Item>
                        A late fee of ₹XXX per day applies for overdue payments.
                    </List.Item>
                    <List.Item>
                        Services may be suspended if payment is delayed beyond three (3) days.
                    </List.Item>
                </List.Root>
            </Box>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    3. Refund & Security Deposit
                </Heading>
                <List.Root gap={2} variant="plain" align="center">
                    <List.Item>
                        No refunds will be issued for early termination.
                    </List.Item>
                    <List.Item>
                        Security deposit (if applicable) will be refunded within fifteen (15) days after adjusting any dues or damages.
                    </List.Item>
                </List.Root>
            </Box>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    4. Taxes
                </Heading>
                <List.Root gap={2} variant="plain" align="center">
                    <List.Item>
                        GST and other applicable taxes will be charged in addition to the quoted prices.
                    </List.Item>
                </List.Root>
            </Box>

            <Box>
                <Heading as="h2" size="lg" mb={4}>
                    5. Acceptance of Terms
                </Heading>
                <List.Root gap={2} variant="plain" align="center">
                    <List.Item>
                        Payment of this invoice confirms the Client’s acceptance of these Terms and the Co-Working Space Usage Agreement.
                    </List.Item>
                </List.Root>
            </Box>
        </Box>
    );
};

export default InvoiceTerms;
