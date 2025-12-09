// Topbar.tsx (FIXED)

import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import UserAvatar from "../components/UserAvatar";

const { Header } = Layout;

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  pageTitle: string;
  isMobile?: boolean;
}

export default function Topbar({ collapsed, setCollapsed, pageTitle, isMobile }: TopbarProps) {
  // Calculate the correct 'left' position based on sidebar state
  const sidebarWidth = isMobile ? 0 : collapsed ? 72 : 240;

  return (
    <Header
      className="flex items-center justify-between px-4 bg-[#0d1117] h-16"
      style={{ 
        paddingInline: 20, 
        // Use Antd's fixed positioning instead of manually duplicating flex styles
        position: "fixed", 
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: `calc(100% - ${sidebarWidth}px)`, // Adjust width dynamically
        top: 0, 
        left: sidebarWidth, 
        zIndex: 10, 
        transition: "left 0.25s ease, width 0.25s ease", 
        height: 64,
      }}
    >
      {/* 
        ✅ LEFT SECTION (Combined: Button + Title) - Added min-w-0 and max-w-full 
        to ensure this flexible item shrinks and respects the screen edge.
      */}
      <div className="flex items-center gap-4 **min-w-0 max-w-full**"> 
        
        {/* Collapse button - only on desktop */}
        {!isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-blue-400 **flex-shrink-0**" 
          />
        )}
        
        {/* Branding/Page Title Slot */}
        {/* ✅ TRUNCATE applied to prevent long titles from forcing overflow */}
        <span className="text-white text-xl font-bold **truncate**">
            {pageTitle || "Pulsefolio"} 
        </span>
      </div>

      
      {/* 
        ❌ Removed the duplicate/redundant Center/Middle Section. 
      */}


      {/* Right section: show avatar always (Far Right) */}
      <div className="flex items-center gap-3 **flex-shrink-0**">
        <UserAvatar />
      </div>
    </Header>
  );
}