import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "../../../store/auth";

interface RequireRoleProps {
  role?: "User" | "Analyst" | "Admin";
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { accessToken, role: userRole } = useAuthStore();

  // No token = not logged in
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but user role mismatch
  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
