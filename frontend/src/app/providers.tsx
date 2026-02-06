import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { queryClient } from "../services/queryClient";
import { ThemeProvider } from "../context/ThemeContext";

const { darkAlgorithm } = theme;

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <InnerProviders>{children}</InnerProviders>
    </ThemeProvider>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  // const { themeMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm, // Enforce dark mode for premium feel
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}
