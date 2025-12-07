import { useMutation } from "@tanstack/react-query";
import { apiPost, apiGet } from "../../../services/httpMethods";
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

interface MeResponse {
  userId: string;
  email: string;
  role?: string;
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiPost<RegisterResponse>("/api/Auth/register", payload),

    onSuccess: async (registerData) => {
      const me = await apiGet<MeResponse>("/api/Auth/me");

      setAuth({
        accessToken: registerData.accessToken,
        refreshToken: registerData.refreshToken,
        role: (me.role as any) ?? "User",
        email: me.email,
      });
    },
  });
}
