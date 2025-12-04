import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { queryClient } from "../services/queryClient";
// import SessionInitializer from "../features/auth/components/SessionInitializer";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        {/* <SessionInitializer />    */}
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}
