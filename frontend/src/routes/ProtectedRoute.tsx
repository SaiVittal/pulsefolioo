import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  const publicPaths = ["/login", "/register", "/unauthorized"];

  // Allow public routes without auth
  if (publicPaths.includes(location.pathname)) {
    return children;
  }

  // All other routes require auth
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
