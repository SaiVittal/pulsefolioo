import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { JSX } from "react/jsx-dev-runtime";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.accessToken);

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
