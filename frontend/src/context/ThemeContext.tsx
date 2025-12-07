import React, { createContext, useState, useMemo, useCallback } from "react";
import { ConfigProvider, theme } from "antd";
import { motion } from "framer-motion";

const { defaultAlgorithm, darkAlgorithm } = theme;

interface ThemeContextType {
  themeMode: "light" | "dark";
  toggleThemeWithRipple: (pos: { x: number; y: number }) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  const [isAnimating, setIsAnimating] = useState(false);
  const [, setRipplePos] = useState({ x: 0, y: 0 });

  const toggleThemeWithRipple = useCallback(
  ({ x, y }: { x: number; y: number }) => {
      // Start ripple
      setRipplePos({ x, y });
      setIsAnimating(true);

      // Switch theme after ripple starts expanding
      setTimeout(() => {
        const next = themeMode === "light" ? "dark" : "light";
        setThemeMode(next);
        localStorage.setItem("theme", next);
      }, 200);

      // End animation after full effect
      setTimeout(() => {
        setIsAnimating(false);
      }, 700);
    },
    [themeMode]
  );

  const themeConfig = useMemo(
    () => ({
      algorithm: themeMode === "light" ? defaultAlgorithm : darkAlgorithm,
      token: {
        /* TEXT COLORS */
        colorText: themeMode === "light" ? "#1e293b" : "#f1f5f9",
        colorTextSecondary: themeMode === "light" ? "#475569" : "#94a3b8",

        /* BACKGROUNDS */
        colorBgBase: themeMode === "light" ? "#ffffff" : "#0e1117",
        colorBgContainer: themeMode === "light" ? "#ffffff" : "#161b22",
        colorBgLayout: themeMode === "light" ? "#f5f6f8" : "#0d1117",

        /* BORDERS */
        colorBorder: themeMode === "light" ? "#e2e8f0" : "#30363d",
        borderRadius: 10,

        /* BUTTONS */
        colorPrimary: themeMode === "light" ? "#1677ff" : "#3b82f6",
        colorPrimaryHover: themeMode === "light" ? "#4096ff" : "#60a5fa",
        controlHeight: 38,

        /* CARDS */
        boxShadow:
          themeMode === "light"
            ? "0 2px 12px rgba(0,0,0,0.05)"
            : "0 2px 12px rgba(0,0,0,0.35)",

        /* INPUTS */
        colorBgElevated: themeMode === "light" ? "#ffffff" : "#1c2128",

        /* CUSTOM VARS FOR YOUR CSS */
        bgCard: themeMode === "light" ? "#ffffff" : "#161b22",
        skeletonBase: themeMode === "light" ? "#e5e7eb" : "#2d3543",
      },
    }),
    [themeMode]
  );


  return (
    <ThemeContext.Provider value={{ themeMode, toggleThemeWithRipple }}>
      <div className={themeMode}>
        {/* Ripple animation circle */}
<motion.div
  key={isAnimating ? "animating" : "idle"}
  initial={{ opacity: 0 }}
  animate={{ opacity: isAnimating ? 1 : 0 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
  style={{
    position: "fixed",
    inset: 0,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    background:
      themeMode === "light"
        ? "rgba(255,255,255,0.35)"
        : "rgba(0,0,0,0.35)",
    pointerEvents: "none",
    zIndex: 2000,
  }}
/>

        <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
