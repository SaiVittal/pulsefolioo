// src/features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api";
import { useAuthStore } from "../../../store/auth";

type LoginInput = { username: string; password: string };

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (input: LoginInput) => loginApi(input),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.role);
    },
  });
}
