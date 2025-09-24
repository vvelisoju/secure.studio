import { Flex, Button, Input, Stack, Heading, Box, Text, Span, Image } from "@chakra-ui/react";
import { Field } from "../../components/ui/field";
import { useForm } from "react-hook-form";
import useAuthStore from "../../stores/auth";
import { toaster } from "../../components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react"
import GoogleLogo from "../../assets/googleLogo.svg";
import { Separator } from "@chakra-ui/react";

const formSchema = z.object({
    email: z.string().email({ message: "Enter proper email" }).min(1, { message: "Email is required" })
});

type FormValues = z.infer<typeof formSchema>;


const Login = () => {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
    const { sendOTP, setOtpToken, setView, setCurrentStep,  } = useAuthStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => setCurrentStep("login"), []);

    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "Sending OTP", type: "loading" });
        clearErrors();
        setLoading(true);

        try {
            const response: any = await sendOTP({ ...data, type: "login" });
            const { otpToken } = response;
            toaster.update(toastId, { description: response.message || "OTP Sent successfully", type: "success" });
            setLoading(false);
            setOtpToken(otpToken);
            setView("otp");
        } catch (error: any) {
            if (error.status === 404) {
                setError("email", { message: error.data.message }); toaster.remove(toastId);
            }
            if (error.status === 400) setError("email", { message: error.data.message });
            if (error.status === 500) {
                toaster.update(toastId, { description: error.data.message || "OTP Sent Failed", type: "error" });
            }
            setLoading(false);
        }
    });

    const handleGoogleLogin = () => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        window.location.href = `${apiBaseUrl}/api/auth/google`;
    };

    return (
        <Flex flexGrow={{ base: 0, md: 1 }}  >

            <form onSubmit={onSubmit} style={{ display: "flex" }}>
                <Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
                    <Stack gap={4} maxW={{ base: "90%", sm: 400 }} flexGrow={1} px={8} py={10} boxShadow={"sm"} border={"1px solid"} borderColor={"gray.300"} borderRadius={20}>
                        <Flex flexDir={"column"} gap={1}>
                            <Heading fontSize={"3xl"} textAlign={"center"}>Welcome back!</Heading>
                            <Box textAlign={"center"}>
                                <Text fontSize={"xs"} color={"blackAlpha.700"} fontWeight={"500"} >Please sign in to your account</Text>
                            </Box>

                        </Flex>
                        <Field required label="Email Address" invalid={!!errors.email} errorText={errors.email?.message}>
                            <Input outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="email" {...register("email")} placeholder="Enter your email" />
                        </Field>
                        <Flex direction={"column"} gap={2}>
                            <Button bgGradient={"to-r"} gradientFrom={"primary"} gradientTo={"secondary"} type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : "Sign In"}
                            </Button>
                            <Flex gap={3} alignItems={"center"} >
                                <Separator flexGrow={1} />
                                <Text fontWeight={500} fontSize={"xs"} color={"blackAlpha.700"} >Or Continue With</Text>
                                <Separator flexGrow={1} />
                            </Flex>
                            <Button p={0} m={0} w={"100%"} variant={"ghost"} onClick={handleGoogleLogin} >
                                <Flex w={"100%"} gap={2} alignItems={"center"} p={2} justifyContent={"center"} border={"1px solid"} borderColor={"primary"} borderRadius={3} >
                                    <Image src={GoogleLogo} h={4} />
                                    <Text color={"primary"} fontWeight={"500"} fontSize={15} >Google</Text>
                                </Flex>
                            </Button>
                        </Flex>
                        <Box textAlign={"center"}>
                            <Text fontSize={"sm"} color={"blackAlpha.700"} fontWeight={"500"} >Don't have an accout? <Span _hover={{ cursor: "pointer" }} onClick={() => setView("register")} color={"secondary"}>Sign up now</Span></Text>
                        </Box>
                    </Stack>
                </Flex>
            </form>
        </Flex>
    );
};

export default Login;
