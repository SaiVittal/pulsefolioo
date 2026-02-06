import { Navigate } from "react-router-dom";
import { UserRole, useAuthStore } from "../store/auth";

// Role hierarchy: Admin > Analyst > User
const roleHierarchy: Record<UserRole, number> = {
  User: 0,
  Analyst: 1,
  Admin: 2,
};

export default function RequireRole({
  role,
  children,
}: {
  role: UserRole | UserRole[];
  children: React.ReactNode;
}) {
  const userRole = useAuthStore((s) => s.role);

  if (!userRole) return <Navigate to="/login" replace />;

  // Support both single role and array of allowed roles
  const allowedRoles = Array.isArray(role) ? role : [role];

  // Check if user's role level is >= the minimum required level
  const userLevel = roleHierarchy[userRole];
  const hasAccess = allowedRoles.some((r) => userLevel >= roleHierarchy[r]);

  if (!hasAccess) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}

