import { useMutation } from "@tanstack/react-query";
import { apiPost, apiGet } from "../../../services/httpMethods";
import { useAuthStore, UserRole } from "../../../store/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

interface MeResponse {
  userId: string;
  email: string;
  role?: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiPost<LoginResponse>("/api/Auth/login", payload),

    onSuccess: async (loginData) => {

      setTokens({ 
          accessToken: loginData.accessToken,
          refreshToken: loginData.refreshToken, // Set refresh token too
      });

      // Fetch profile after login
      const me = await apiGet<MeResponse>("/api/Auth/me");

      setAuth({
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
        role: (me.role as UserRole) ?? "User", // until backend adds role
        email: me.email,
      });
    },
  });
}
