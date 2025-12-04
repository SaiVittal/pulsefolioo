import { useAuthStore } from "../../../store/auth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const nav = useNavigate();

  return () => {
    clearAuth();
    nav("/login", { replace: true });
  };
}
