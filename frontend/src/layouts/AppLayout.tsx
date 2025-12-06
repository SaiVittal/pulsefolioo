import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import useBreakpoint from "../hooks/useBreakpoints";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 72;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useBreakpoint() === "mobile";

  const marginLeft = isMobile
    ? 0
    : collapsed
    ? SIDEBAR_COLLAPSED
    : SIDEBAR_WIDTH;

  return (
    <Layout className="min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        width={SIDEBAR_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED}
      />

      {/* Content Layout */}
      <Layout
        className="w-full flex flex-col"
        style={{
          marginLeft,
          transition: "margin-left 0.25s ease",
        }}
      >
        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
        />

        {/* THIS FIXES THE ISSUE */}
  <Layout.Content
  className="px-6 py-4"
  style={{ paddingTop: 64 + 16 }} // header height + gap
>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
