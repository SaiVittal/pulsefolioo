import { useMutation } from "@tanstack/react-query";
import { http } from "../../../services/http";
import { useAuthStore } from "../../../store/auth";
import type { UserRole } from "../../../store/auth";

interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      http<{ accessToken: string; refreshToken: string; user: { role: string } }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify(data) }
      ),

    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: data.user.role as UserRole,
      });
    },
  });
}
