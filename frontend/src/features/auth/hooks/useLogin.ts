import { useMutation } from "@tanstack/react-query";
import { http } from "../../../services/http";
import { useAuthStore } from "../../../store/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      http<{ accessToken: string; refreshToken: string; userId: string }>(
        "/api/Auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      ),
    onSuccess: async (data: LoginResponse) => {
      const me = await http<{ userId: string; email: string }>("/api/Auth/me");

      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: "User", // backend must add role soon
        email: me.email,
      });
    },
  });
}
