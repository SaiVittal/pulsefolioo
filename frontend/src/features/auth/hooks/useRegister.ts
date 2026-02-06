import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../../../services/httpMethods";
import { useAuthStore, UserRole } from "../../../store/auth";

interface RegisterPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: UserRole;
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiPost<RegisterResponse>("/api/Auth/register", payload),

    onSuccess: async (registerData) => {
      setAuth({
        accessToken: registerData.accessToken,
        refreshToken: registerData.refreshToken,
        role: registerData.role ?? "User",
        email: registerData.email,
      });
    },
  });
}

