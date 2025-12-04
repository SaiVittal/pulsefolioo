// src/features/auth/hooks/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../api";
import { useAuthStore } from "../../../store/auth";
import { queryClient } from "../../../services/queryClient";

export function useLogout() {
  const logoutLocal = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      logoutLocal();
      // clear react-query cache on logout
      queryClient.clear();
      // navigate to login page from caller
    },
    onError: () => {
      // on error, still clear local state
      logoutLocal();
      queryClient.clear();
    },
  });
}
