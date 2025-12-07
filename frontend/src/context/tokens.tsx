// src/theme/tokens.ts
import { theme } from "antd";

export type ThemeMode = "light" | "dark";

const { defaultAlgorithm, darkAlgorithm } = theme;

export const designTokens = {
  light: {
    // base
    colorText: "#1e293b",
    colorTextSecondary: "#475569",
    colorBgBase: "#ffffff",
    colorBgLayout: "#f5f6f8",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "#e2e8f0",

    // brand
    colorPrimary: "#1677ff",
    colorPrimaryHover: "#4096ff",
    colorSuccess: "#16a34a",
    colorError: "#dc2626",
    colorWarning: "#f59e0b",

    // components
    controlHeight: 38,
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(15,23,42,0.05)",

    // custom
    bgCard: "#ffffff",
    skeletonBase: "#e5e7eb",
  },

  dark: {
    colorText: "#e2e8f0",
    colorTextSecondary: "#94a3b8",
    colorBgBase: "#0e1117",
    colorBgLayout: "#0d1117",
    colorBgContainer: "#161b22",
    colorBgElevated: "#1b2430",
    colorBorder: "#30363d",

    colorPrimary: "#3b82f6",
    colorPrimaryHover: "#60a5fa",
    colorSuccess: "#22c55e",
    colorError: "#f97373",
    colorWarning: "#eab308",

    controlHeight: 38,
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.4)",

    bgCard: "#161b22",
    skeletonBase: "#2d3543",
  },
};

import type { ThemeConfig } from "antd";

export function getAntdTheme(mode: ThemeMode): ThemeConfig {
  const tokens = mode === "light" ? designTokens.light : designTokens.dark;

  return {
    algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
    token: tokens,
  };
}

