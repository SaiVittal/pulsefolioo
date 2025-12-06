import { useMutation } from "@tanstack/react-query";
import { http } from "../../../services/http";
import { useAuthStore } from "../../../store/auth";

interface RegisterPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      http<RegisterResponse>("/api/Auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: "User",
        email: data.userId, // backend must return email soon
      });
    },
  });
}
