// src/features/auth/hooks/useRestoreSession.ts
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { refreshApi } from "../api";
import { useAuthStore } from "../../../store/auth";

export function useRestoreSession() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const m = useMutation({
    mutationFn: () => refreshApi(),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.role);
    },
    onError: () => {
      // clear role if refresh fails (server session expired)
      setAuth(null, null);
    },
  });

  useEffect(() => {
    // attempt to restore session once on mount
    m.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return m;
}
