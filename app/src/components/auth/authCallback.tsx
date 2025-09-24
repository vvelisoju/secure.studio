import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";// or useLocation() in React Router
import useAuthStore from "../../stores/auth";// adjust to your Zustand store
import { Center, Flex, Spinner } from "@chakra-ui/react";

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        let user = searchParams.get("user") as any;
        user = JSON.parse(decodeURIComponent(user));

        if (accessToken && user) {
            useAuthStore.setState({
                isAuthenticated: true,
                accessToken,
                refreshToken,
                user,
                role: user?.userType
            });

            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, []);

    return <Flex h={"100vh"} w={"1000%"} justifyContent={"center"} alignItems={"center"} >
        <Spinner size={"xl"} />
    </Flex>;
};

export default AuthCallback;
