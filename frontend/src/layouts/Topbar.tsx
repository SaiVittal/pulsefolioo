// Topbar.tsx - Responsive top navigation bar

import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, MenuOutlined } from "@ant-design/icons";
import UserAvatar from "../components/UserAvatar";

const { Header } = Layout;

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  pageTitle: string;
  isMobile?: boolean;
  onMobileMenuClick?: () => void;
}

export default function Topbar({
  collapsed,
  setCollapsed,
  pageTitle,
  isMobile,
  onMobileMenuClick
}: TopbarProps) {
  // Calculate the correct 'left' position based on sidebar state
  const sidebarWidth = isMobile ? 0 : collapsed ? 72 : 240;

  return (
    <Header
      className="flex items-center justify-between bg-[#0d1117] h-16"
      style={{
        paddingInline: isMobile ? 16 : 20,
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: `calc(100% - ${sidebarWidth}px)`,
        top: 0,
        left: sidebarWidth,
        zIndex: 10,
        transition: "left 0.25s ease, width 0.25s ease",
        height: 64,
      }}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 min-w-0 max-w-full">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMobileMenuClick}
            className="text-white hover:text-blue-400 flex-shrink-0"
            style={{ color: "white" }}
          />
        )}

        {/* Desktop collapse button */}
        {!isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-blue-400 flex-shrink-0"
            style={{ color: "white" }}
          />
        )}

        {/* Branding/Page Title */}
        <span className="text-white text-lg md:text-xl font-bold truncate">
          {pageTitle || "Pulsefolio"}
        </span>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <UserAvatar />
      </div>
    </Header>
  );
}