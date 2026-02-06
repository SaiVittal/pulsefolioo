import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../../../services/httpMethods";
import { useAuthStore, UserRole } from "../../../store/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: UserRole;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiPost<LoginResponse>("/api/Auth/login", payload),

    onSuccess: async (loginData) => {
      setAuth({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
        role: loginData.role ?? "User",
        email: loginData.email,
      });
    },
  });
}

