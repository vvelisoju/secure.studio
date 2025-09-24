import { Flex, Text, Span, Button, Input, Stack, Textarea, Link, } from "@chakra-ui/react"
import LocationIcon from "../../assets/location";
import CallIcon from "../../assets/call";
import MailIcon from "../../assets/mail";
import { Field } from "../../components/ui/field";
import { useForm } from "react-hook-form";
import { toaster } from "../../components/ui/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Spinner } from "@chakra-ui/react"
import { useState } from "react";
import { getInTouch } from "../../api/home";



const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name is too long" }),
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(10, { message: "Phone number is too long" })
        .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
    email: z.string().email({ message: "Invalid email" }).min(1, { message: "Email is required" }),
    message: z.string().min(1, { message: "Message is required" }).max(500, { message: "Message is too long" })
});

type FormValues = z.infer<typeof formSchema>;


const GetInTouch = () => {
    const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
    const [loading, setLoading] = useState(false);


    const onSubmit = handleSubmit(async (data) => {
        let toastId: any = toaster.create({ description: "Sending Message", type: "loading" });
        reset();
        setLoading(true);
        try {
            const response: any = await getInTouch(data);
            toaster.update(toastId, { description: response.message || "Message Sent successfully", type: "success" });
            setLoading(false);
        } catch (error: any) {
            if (error.status === 400) setError("email", { message: error.data.message });
            if (error.status === 500) {
                toaster.update(toastId, { description: error.data.message || "Message Sent Failed", type: "error" });
            }
            setLoading(false);
        }
    });


    const businessDetails = () => {
        return (
            <Flex gap={5} flexGrow={1} flexDir={["column"]} >
                <Flex alignItems={"center"} gap={3} >
                    <Text fontSize={"lg"} color={"#0d6efd"} fontWeight={"bold"} marginLeft={"2em"}>Secure Studio</Text>
                </Flex>

                <Flex alignItems={"center"} gap={3} >
                    <Span>{LocationIcon("25", "25", "#0d6efd")}</Span>
                    <Text fontSize={"md"}> 3rd Floor, Jakotia Complex, Opp. Ratna Hotel, Pochamma Maidan, Vasavi Colony, Kothawada, Warangal, Telangana 506002</Text>
                </Flex>

                <Flex alignItems={"center"} gap={3} >
                    <Span>{CallIcon("25", "25", "#0d6efd")}</Span>
                    <Link href="tel:+919494644848" fontSize={"md"} color={"white"} _hover={{ textDecoration: "underline", color: "#0d6efd" }}>
                        +91 9494 64 4848
                    </Link>
                </Flex>

                <Flex alignItems={"center"} gap={3} >
                    <Span>{MailIcon("25", "25", "#0d6efd")}</Span>
                    <Link target="_blank" href="mailto:support@secure.studio" fontSize={"md"} color={"white"} _hover={{ textDecoration: "underline", color: "#0d6efd" }}>
                        support@secure.studio
                    </Link>
                </Flex>
            </Flex>
        )
    }


    const businessHours = () => {
        return (
            <Flex gap={5} flexDir={"column"} flexGrow={1} p={5} bg={"whiteAlpha.100"} borderRadius={10}>
                <Text color={"#0d6efd"} fontSize={"lg"} fontWeight={"bold"} >Business Hours</Text>
                <Flex gap={5} flexDir={"column"} flexGrow={1}>
                    <Flex flexGrow={1} justifyContent={"space-between"} >
                        <Text>Monday - Saturday</Text>
                        <Text>09:00 AM - 08:00 PM</Text>
                    </Flex>
                    <Flex flexGrow={1} justifyContent={"space-between"} >
                        <Text>Sunday</Text>
                        <Text>Closed</Text>
                    </Flex>
                </Flex>
            </Flex>
        )
    }



    return (
        <Flex id="getinTouch" color={"white"} bg={"blackAlpha.900"} p={[5, 10]} gap={10} flexGrow={1} flexDir={"column"} alignItems={"center"}>
            <Text fontSize={30} fontWeight={"bold"}>Get in Touch</Text>
            <Flex flexGrow={1} w={["100%", "100%", "80%", "100%"]} gap={[5, 5, 5, 10]} flexDir={["column", "column", "row"]} alignItems={["center"]}>

                {/* Map Section */}
                <Flex w={["100%", "80%", "50%"]} flexGrow={1} h={{ base: 300, md: "100%" }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7740688661656!2d79.5999349!3d17.989245399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaf65e22ea733c053%3A0x4e201c248142e260!2sSecure%20Studio!5e0!3m2!1sen!2sin!4v1741600529878!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ borderRadius: 10, border: 0 }}
                        loading="lazy"
                    ></iframe>
                </Flex>



                {/* Business Details Section */}
                <Flex fontWeight={"500"} gap={10} p={5} flexDir={"column"} w={["100%", "80%", "50%"]} minH={300}>
                    {businessDetails()}
                    {businessHours()}
                </Flex>

                {/* Contact Form Section */}
                <Flex w={["100%", "80%", "50%"]} minH={300}>
                    <Flex flexGrow={{ base: 1, md: 1 }} bg={"whiteAlpha.100"} px={[3, 6]} py={10} borderRadius={10}>
                        <form onSubmit={onSubmit} style={{ display: "flex", flexGrow: 1 }}>
                            <Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
                                <Stack gap={5} flexGrow={1}>
                                    <Field label="Name" invalid={!!errors.name} errorText={errors.name?.message}>
                                        <Input outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("name")} />
                                    </Field>
                                    <Field label="Phone" invalid={!!errors.phone} errorText={errors.phone?.message}>
                                        <Input outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("phone")} />
                                    </Field>
                                    <Field label="Email" invalid={!!errors.email} errorText={errors.email?.message}>
                                        <Input outlineColor={"primary"} _focus={{ borderColor: "primary" }} type="email" {...register("email")} />
                                    </Field>
                                    <Field label="Message" invalid={!!errors.message} errorText={errors.message?.message}>
                                        <Textarea outlineColor={"primary"} _focus={{ borderColor: "primary" }}  {...register("message")} />
                                    </Field>
                                    <Button bg={"#0d6efd"} type="submit" disabled={loading}>
                                        {loading ? <Spinner size="sm" /> : "Submit"}
                                    </Button>
                                </Stack>
                            </Flex>
                        </form>
                    </Flex>
                </Flex>
            </Flex>
        </Flex >
    )
}

export default GetInTouch