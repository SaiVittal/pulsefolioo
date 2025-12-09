// AppLayout.tsx

import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import useBreakpoint from "../hooks/useBreakpoints";

// Ensure these constants are exported for use in Topbar.tsx
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED = 72;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useBreakpoint() === "mobile";

  // Calculate the margin for the content layout
  const marginLeft = isMobile
    ? 0
    : collapsed
    ? SIDEBAR_COLLAPSED
    : SIDEBAR_WIDTH;

  return (
    // Set the overall layout to min-h-screen, but do NOT make it a flex container here
    <Layout className="min-h-screen w-full"> 
      {/* 1. Sidebar (Positioned fixed/sticky internally) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED}
      />

      {/* 2. Content Layout (The wrapper for Topbar and Content) */}
      <Layout
        className="w-full flex flex-col" // Use flex-col to stack Topbar and Content
        style={{
          marginLeft, // This pushes the ENTIRE content area (Topbar + Outlet)
          transition: "margin-left 0.25s ease",
        }}
      >
        {/* Topbar is now inside the shifting content wrapper, so it moves with it. */}
        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pageTitle="" // You can set a default title or manage it via context/state
          isMobile={isMobile}
        />

        {/* 3. Main Content Area */}
        <Layout.Content
          className="px-6 py-4"
          // We apply the padding-top to create space for the fixed Topbar (height: 64px)
          style={{ paddingTop: 64 + 16 }} 
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}