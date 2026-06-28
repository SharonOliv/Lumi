import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { Role } from "../types";

interface RequireRoleProps {
  role: Role;
}

/**
 * Layout-style role guard (same pattern as ProtectedRoute). Wrap a group of
 * routes with <RequireRole role="admin" /> and they'll redirect to /home
 * for anyone whose role doesn't match — including authenticated Viewers.
 */
const RequireRole = ({ role }: RequireRoleProps) => {
  const currentRole = useAppSelector((state) => state.auth.role);
  return currentRole === role ? <Outlet /> : <Navigate to="/home" replace />;
};

export default RequireRole;
