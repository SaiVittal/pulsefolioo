import { Navigate } from "react-router-dom";
import { UserRole, useAuthStore } from "../store/auth";

export default function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const userRole = useAuthStore((s) => s.role);

  if (!userRole) return <Navigate to="/login" replace />;

  if (userRole !== role) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
