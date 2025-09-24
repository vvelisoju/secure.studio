import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../stores/auth";

// interface ProtectedRouteProps {
//     children: React.ReactNode;
//     roles: string[]; // Add type annotation for roles prop
// }

const ProtectedRoute = () => {
    const { isAuthenticated, role } = useAuthStore();
    // const location = useLocation();
    // if (!role) {
    //     return <Navigate to="/auth" state={{ from: location }} />;
    // }

    // if (!roles.includes(role)) {
    //     return <Navigate to="/notFound" />;
    // }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
