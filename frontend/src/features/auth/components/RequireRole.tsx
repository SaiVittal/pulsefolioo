import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "../../../store/auth";

interface RequireRoleProps {
  role?: "User" | "Analyst" | "Admin";
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { accessToken, role: userRole } = useAuthStore();

  // Not logged in → go to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
