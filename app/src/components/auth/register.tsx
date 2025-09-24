import { Flex, Button, Input, Stack, Heading, Text, Box, Span, HStack, RadioGroup, Image } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import useAuthStore from "../../stores/auth";
import { toaster } from "../ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react"
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "../ui/select";
import { Link } from "react-router-dom";
import { Separator } from "@chakra-ui/react";
import GoogleLogo from "../../assets/googleLogo.svg";

const formSchema = z.object({
    name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    accountType: z.string({ message: "Account Type is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const accountTypeValues = [
    { label: "Individual", value: "INDIVIDUAL" },
    { label: "Company", value: "COMPANY" },
]

const Register = () => {
    const { register, handleSubmit, formState: { errors }, clearErrors, control } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
    const { sendOTP, setOtpToken, setView, setCurrentStep } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "Sending OTP", type: "loading" });
        clearErrors();
        setLoading(true);

        try {
            const response: any = await sendOTP({ ...data, type: "register" });
            const { otpToken } = response;
            toaster.update(toastId, { description: response.message || "OTP Sent successfully", type: "success" });
            setLoading(false);
            setOtpToken(otpToken);
            setView("otp");
        } catch (error: any) {
            toaster.update(toastId, { description: error.data.message || "OTP Sent Failed", type: "error" });
            setLoading(false);
        }
    });

    useEffect(() => setCurrentStep("register"), []);

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:4000/api/auth/google";
    };

    return (
        <Flex flexGrow={{ base: 0, md: 1 }}  >
            <form onSubmit={onSubmit} style={{ display: "flex" }}>
                <Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
                    <Stack color={"blackAlpha.800"} gap={4} maxW={{ base: "90%", sm: 400 }} flexGrow={1} px={8} py={8} boxShadow={"sm"} border={"1px solid"} borderColor={"gray.300"} borderRadius={20}>
                        <Heading color={"dark"} fontSize={"2xl"} textAlign={"center"}>Create your account</Heading>
                        <Field label="Full Name" required invalid={!!errors.name} errorText={errors.name?.message}>
                            <Input outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="text" {...register("name")} placeholder="Enter your full name" />
                        </Field>
                        <Field label="Email address" required invalid={!!errors.email} errorText={errors.email?.message}>
                            <Input outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="email" {...register("email")} placeholder="Enter your email" />
                        </Field>
                        <Field label="Account Type" required invalid={!!errors.accountType} errorText={errors.accountType?.message}>
                            <Controller
                                control={control}
                                name="accountType"
                                render={({ field }) => (
                                    <RadioGroup.Root
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={({ value }) => {
                                            field.onChange(value)
                                        }}
                                    >
                                        <HStack gap="8" >
                                            {accountTypeValues.map((item) => (
                                                <RadioGroup.Item key={item.value} value={item.value}>
                                                    <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                                                    <RadioGroup.ItemIndicator />
                                                    <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                                                </RadioGroup.Item>
                                            ))}
                                        </HStack>
                                    </RadioGroup.Root>
                                )}
                            />
                        </Field>

                        <Flex direction={"column"} gap={2}>
                            <Button bgGradient={"to-r"} gradientFrom={"primary"} gradientTo={"secondary"} type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : "Create Account"}
                            </Button>
                            <Flex gap={3} alignItems={"center"} >
                                <Separator flexGrow={1} />
                                <Text fontWeight={500} fontSize={"xs"} color={"blackAlpha.700"} >Or Continue With</Text>
                                <Separator flexGrow={1} />
                            </Flex>
                            <Button p={0} m={0} w={"100%"} variant={"ghost"} onClick={handleGoogleLogin} >
                                <Flex w={"100%"} gap={2} alignItems={"center"} p={2} justifyContent={"center"} border={"1px solid"} borderColor={"primary"} borderRadius={3} >
                                    <Image src={GoogleLogo} h={4} />
                                    <Text color={"primary"} fontWeight={"500"} fontSize={15} > Google</Text>
                                </Flex>
                            </Button>
                        </Flex>
                        <Box textAlign={"center"}>
                            <Text fontSize={"sm"} color={"blackAlpha.700"} fontWeight={"500"} >Already have an accout? <Span _hover={{ cursor: "pointer" }} onClick={() => setView("login")} color={"secondary"}> Log in</Span></Text>
                        </Box>
                        {/* <Box textAlign={"center"}>
                            <Text fontSize={"xs"} color={"blackAlpha.700"} fontWeight={"500"} >By creating an account, you agree to our <br /> <Link to={""}><Span _hover={{ cursor: "pointer" }} color={"secondary"}>Terms of Service</Span></Link> and <Link to={""}><Span _hover={{ cursor: "pointer" }} color={"secondary"}> Privacy Policy</Span></Link></Text>
                        </Box> */}
                    </Stack>
                </Flex>
            </form>
        </Flex>
    );
};

export default Register;
