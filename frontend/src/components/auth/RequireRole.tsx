import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "../../store/auth";

interface RequireRoleProps {
  role?: "User" | "Analyst" | "Admin";
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const userRole = useAuthStore((s) => s.role);

  if (!userRole || (role && userRole !== role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
