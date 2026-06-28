import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

/**
 * Layout-style protected route (react-router v6 pattern).
 * Wrap any group of routes with <ProtectedRoute /> as the parent element
 * and they will redirect to /login whenever the user isn't authenticated.
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
