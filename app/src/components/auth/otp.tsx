import { Flex, Button, Stack, Heading, Box, Text, Span } from "@chakra-ui/react"
import { Field } from "../../components/ui/field"
import { Controller, useForm } from "react-hook-form"
import { toaster } from "../../components/ui/toaster"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PinInput } from "../ui/pin-input"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Spinner } from "@chakra-ui/react"
import useAuthStore from "../../stores/auth"
import BackwardIcon from "../../assets/keyboardBackspace"
import { useLocation } from 'react-router-dom';

const formSchema = z.object({
    otp: z.array(z.string().min(1), { required_error: "OTP is required" })
        .length(6, { message: "OTP must be 6 digits long" }),
})

type FormValues = z.infer<typeof formSchema>

const OTP = () => {
    const { handleSubmit, control, formState, clearErrors, setError } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { verifyOTP, setOtpToken, afterLoginGoTo, email, setView, resendOTP } = useAuthStore();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('ref');
    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);


    const onResendOtp = async () => {
        if (!canResend) return;
        setCanResend(false);
        setTimer(30);
        let toastId: any = toaster.create({ description: "Checking OTP", type: "loading" })
        try {
            const response: any = await resendOTP();
            const { otpToken } = response;
            setOtpToken(otpToken);
            toaster.update(toastId, { description: response.message || "OTP Resent Succesfully", type: "success" })
        } catch (error: any) {
            toaster.update(toastId, { description: error.message || "OTP Resent Failed", type: "error" });
        }
    };


    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "Checking OTP", type: "loading" })
        setLoading(true);
        clearErrors();
        try {
            const response: any = await verifyOTP({ otp: data.otp.join(""), referralCode });
            toaster.update(toastId, { description: response.message || "OTP Verification Succesfully", type: "success" })
            setLoading(false);
            navigate(afterLoginGoTo);
            setOtpToken(null);
            setTimeout(() => setView("login"), 1000);
        } catch (error: any) {
            console.error(error);
            if (error.status === 400) {
                setError("otp", { message: error.data.message })
                toaster.update(toastId, { description: error.data.message || "OTP Verification Failed", type: "error" })
            };
            if (error.status === 500) toaster.update(toastId, { description: error.message || "OTP Verification Failed", type: "error" });
            setLoading(false); // Keep this here for immediate error handling
            if (error.data.message === "OTP has expired. Please request a new one.") setOtpToken(null);
        }
    });

    return (
        <Flex flexGrow={{ base: 0, md: 1 }}  >
            <form onSubmit={onSubmit} style={{ display: "flex" }}  >
                <Flex w={"100%"} justifyContent={"center"} alignItems={"center"} >
                    <Stack gap={5} maxW={{ base: "90%", sm: 400 }} flexGrow={1} px={8} py={10} boxShadow={"sm"} border={"1px solid"} borderColor={"gray.300"} borderRadius={20}>
                        <Heading fontSize={"2xl"} textAlign={"center"}>OTP Verification</Heading>
                        <Box textAlign={"center"}>
                            <Text fontSize={"sm"} color={"blackAlpha.700"} fontWeight={"500"} >We've sent a verification code to </Text>
                            <Text fontSize={"sm"} color={"secondary"} fontWeight={"500"} >{email || "example @mail.com"}</Text>
                        </Box>
                        <Field w="100%" justifyContent="center" invalid={!!formState.errors.otp} errorText={formState.errors.otp?.message}>
                            <Controller control={control} name="otp"
                                render={({ field }) => (
                                    <PinInput w="100%" value={field.value} onValueChange={(e) => field.onChange(e.value)} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            onSubmit();
                                        }
                                    }}
                                    />
                                )}
                            />
                        </Field>
                        <Button bgGradient={"to-r"} gradientFrom={"primary"} gradientTo={"secondary"} type="submit">
                            {loading ? <Spinner size="sm" /> : "Submit"}
                        </Button>
                        <Box textAlign={"center"}>
                            <Text fontSize={"sm"} color={"blackAlpha.700"} fontWeight={"500"} >Didn't receive the code?</Text>
                            <Text fontSize={"sm"} color={"blackAlpha.800"} fontWeight={"500"} ><Span onClick={onResendOtp}
                                pointerEvents={!canResend ? "none" : "all"} opacity={!canResend ? "0.5" : "1"} _hover={{ cursor: "pointer" }} color={"secondary"}>Resend OTP</Span> <Span color={"blackAlpha.500"}>in</Span>{" 00:"}{timer < 10 ? `0${timer}` : timer}</Text>
                        </Box>
                        <Button fontSize={"md"} color={"blackAlpha.700"} fontWeight={"500"} variant={"plain"} onClick={() => setView("login")}>
                            {BackwardIcon("20", "20", "var(--chakra-colors-black-alpha-700)")}  Back to Login
                        </Button>
                    </Stack>
                </Flex>
            </form>
        </Flex>

    )
}

export default OTP