import { useEffect } from "react";
import { useRefreshSession } from "./useRefreshSession";
import { useAuthStore } from "../../../store/auth";

export function useRestoreSession() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const role = useAuthStore((s) => s.role);
  const refreshMutation = useRefreshSession();

  useEffect(() => {
    if (refreshToken && role) {
      refreshMutation.mutate();
    }
  }, []);
}
