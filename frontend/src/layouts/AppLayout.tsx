// AppLayout.tsx - Responsive layout with mobile drawer sidebar

import { Layout, Drawer } from "antd";
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";

  // Auto-collapse on tablet
  const effectiveCollapsed = isTablet ? true : collapsed;

  // Calculate the margin for the content layout
  const marginLeft = isMobile
    ? 0
    : effectiveCollapsed
      ? SIDEBAR_COLLAPSED
      : SIDEBAR_WIDTH;

  return (
    <Layout className="min-h-screen w-full">
      {/* Mobile Drawer Sidebar */}
      {isMobile && (
        <Drawer
          placement="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          width={280}
          styles={{
            body: { padding: 0, background: "#0b132b" },
            header: { display: "none" }
          }}
          className="mobile-drawer"
        >
          <Sidebar
            collapsed={false}
            setCollapsed={() => { }}
            width={280}
            collapsedWidth={72}
            isMobile={true}
            onMobileClose={() => setMobileDrawerOpen(false)}
          />
        </Drawer>
      )}

      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={effectiveCollapsed}
          setCollapsed={setCollapsed}
          width={SIDEBAR_WIDTH}
          collapsedWidth={SIDEBAR_COLLAPSED}
          isMobile={false}
        />
      )}

      {/* Content Layout */}
      <Layout
        className="w-full flex flex-col transition-all duration-300"
        style={{ marginLeft }}
      >
        <Topbar
          collapsed={effectiveCollapsed}
          setCollapsed={isTablet ? () => { } : setCollapsed}
          pageTitle=""
          isMobile={isMobile}
          onMobileMenuClick={() => setMobileDrawerOpen(true)}
        />

        {/* Main Content Area - Responsive padding */}
        <Layout.Content
          className="responsive-content"
          style={{
            paddingTop: 64 + 16,
            paddingLeft: isMobile ? 16 : isTablet ? 20 : 24,
            paddingRight: isMobile ? 16 : isTablet ? 20 : 24,
            paddingBottom: isMobile ? 16 : 24,
          }}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}