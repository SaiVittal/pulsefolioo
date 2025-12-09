import { Divider, Layout, Menu, Tooltip } from "antd";
import {
  LineChartOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/interface";
import { useAuthStore } from "../store/auth";
// import { motion } from "framer-motion";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  width: number;
  collapsedWidth: number;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  width,
  collapsedWidth,
}: SidebarProps) {
  const nav = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const mainItems: MenuItemType[] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => nav("/"),
    },
    {
      key: "/analytics",
      icon: <LineChartOutlined />,
      label: "Analytics",
      onClick: () => nav("/analytics"),
    },
    {
      key: "/transactions",
      icon: <SwapOutlined />,
      label: "Transactions",
      onClick: () => nav("/transactions"),
    },
  ];

  const secondaryItems: MenuItemType[] = [
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => nav("/settings"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: () => {
        clearAuth();
        nav("/login", { replace: true });
      },
    },
  ];

  // helper to add tooltip when collapsed
  const withTooltip = (item: MenuItemType): MenuItemType => ({
    ...item,
    label: collapsed ? (
      <Tooltip title={item.label} placement="right">
        <span>{item.label}</span>
      </Tooltip>
    ) : (
      item.label
    ),
  });

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={width}
      collapsedWidth={collapsedWidth}
      theme="dark"
      className="shadow-lg"
    style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed", 
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 20, // Must be higher than the Topbar's z-index (10)
      }}
    >
      {/* BRAND HEADER */}
<div
  style={{
    height: 64,
    display: "flex",
    alignItems: "center",
    paddingInline: 16,
    gap: 12,
    background: "#0b132b",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    lineHeight: 1,
  }}
>
  {/* Logo bubble */}
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "#1d4ed8",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: 16,
      fontWeight: 600,
      flexShrink: 0,
    }}
  >
    P
  </div>

  {/* brand text */}
  {!collapsed && (
    <div
      style={{
        color: "white",
        fontSize: 18,
        fontWeight: 600,
        marginTop: 2, // subtle baseline alignment
      }}
    >
      Pulsefolio
    </div>
  )}
</div>


      {/* Main navigation */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={mainItems.map(withTooltip)}
        style={{ marginTop: 12, borderInline: "none" }}
      />

      <Divider style={{ margin: "12px 0", borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Secondary navigation */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={secondaryItems.map(withTooltip)}
        style={{ borderInline: "none" }}
      />
    </Sider>
  );
}
