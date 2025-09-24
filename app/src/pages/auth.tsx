import useAuthStore from "../stores/auth"
import Register from "../components/auth/register"
import Login from "../components/auth/login"
import OTP from "../components/auth/otp"

import { Flex, Image } from "@chakra-ui/react"
import People from "../assets/login-people.png"
const Auth = () => {
  const { view } = useAuthStore();
  return (
    <Flex gap={10} w={"100%"} h={"95vh"} justifyContent={"center"} flexDirection={["column", "column", "row"]} p={[5, 10, 20]} >
      <Flex w={{ sm: "100%", md: "40%" }} justifyContent={"center"} alignItems={"center"} >
        <Image src={People} w={[200, 200, 300, 500]} />
      </Flex>
      {view === "login" && <Login />}
      {view === "register" && <Register />}
      {view === "otp" && <OTP />}
    </Flex>
  )
}

export default Auth