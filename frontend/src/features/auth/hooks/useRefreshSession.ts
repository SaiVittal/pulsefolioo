import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../../../services/httpMethods";
import { useAuthStore } from "../../../store/auth";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export function useRefreshSession() {
  const { refreshToken, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: () =>
      apiPost<RefreshResponse>("/api/auth/refresh", { refreshToken }),

    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: useAuthStore.getState().role!,
        email: useAuthStore.getState().email!,
      });
    },
  });
}
