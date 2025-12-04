import { useMutation } from "@tanstack/react-query";
import { http } from "../../../services/http";
import { useAuthStore } from "../../../store/auth";

export function useRefreshSession() {
  const { refreshToken, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: () =>
      http<{ accessToken: string; refreshToken: string }>("/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify(refreshToken),
      }),

    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: useAuthStore.getState().role!, // keep existing role
      });
    },
  });
}
