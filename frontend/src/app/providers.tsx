import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { queryClient } from "../services/queryClient";
import { useRestoreSession } from "../features/auth/hooks/useRestoreSession";

export function AppProviders({ children }: { children: ReactNode }) {

    useRestoreSession();
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}
