import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { queryClient } from "../services/queryClient";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InnerProviders>{children}</InnerProviders>
    </ThemeProvider>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { themeMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === "light" ? defaultAlgorithm : darkAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}
