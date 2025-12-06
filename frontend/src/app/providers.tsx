

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { queryClient } from "../services/queryClient";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

// 1. Create a component to apply the theme from context
function ThemeWrapper({ children }: { children: ReactNode }) {
  const { antdAlgorithm } = useTheme();
  
  return (
    <ConfigProvider theme={{ algorithm: antdAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        {/* <SessionInitializer /> */}
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}

// 2. The main AppProviders component
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeWrapper>{children}</ThemeWrapper>
    </ThemeProvider>
  );
}