import { Divider, Layout, Menu, Tooltip } from "antd";
import {
  LineChartOutlined,
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  SwapOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/interface";
import { useAuthStore, UserRole } from "../store/auth";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  width: number;
  collapsedWidth: number;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

// Role hierarchy for navigation item filtering
const roleHierarchy: Record<UserRole, number> = {
  User: 0,
  Analyst: 1,
  Admin: 2,
};

interface NavItem extends Omit<MenuItemType, "onClick"> {
  minRole?: UserRole;
  onClick?: () => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  width,
  collapsedWidth,
  isMobile = false,
  onMobileClose,
}: SidebarProps) {
  const nav = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const userRole = useAuthStore((s) => s.role);
  const userLevel = userRole ? roleHierarchy[userRole] : -1;

  const handleNavigation = (path: string) => {
    nav(path);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const filterByRole = (items: NavItem[]): MenuItemType[] =>
    items
      .filter((item) => {
        if (!item.minRole) return true;
        return userLevel >= roleHierarchy[item.minRole];
      })
      .map(({ minRole, ...rest }) => rest as MenuItemType);

  const mainItems: NavItem[] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => handleNavigation("/"),
    },
    {
      key: "/market",
      icon: <LineChartOutlined />,
      label: "Market",
      onClick: () => handleNavigation("/market"),
    },
    {
      key: "/analytics",
      icon: <LineChartOutlined />,
      label: "Analytics",
      minRole: "Analyst",
      onClick: () => handleNavigation("/analytics"),
    },
    {
      key: "/watchlist",
      icon: <EyeOutlined />,
      label: "Watchlist",
      onClick: () => handleNavigation("/watchlist"),
    },
    {
      key: "/transactions",
      icon: <SwapOutlined />,
      label: "Transactions",
      onClick: () => handleNavigation("/transactions"),
    },
  ];

  const secondaryItems: NavItem[] = [
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => handleNavigation("/settings"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: () => {
        clearAuth();
        nav("/login", { replace: true });
        if (isMobile && onMobileClose) {
          onMobileClose();
        }
      },
    },
  ];

  // helper to add tooltip when collapsed (desktop only)
  const withTooltip = (item: MenuItemType): MenuItemType => ({
    ...item,
    label: collapsed && !isMobile ? (
      <Tooltip title={item.label} placement="right">
        <span>{item.label}</span>
      </Tooltip>
    ) : (
      item.label
    ),
  });

  // Mobile sidebar (inside drawer)
  if (isMobile) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b132b",
        }}
      >
        {/* Mobile Header with Close Button */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 16,
            background: "#0b132b",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              }}
            >
              P
            </div>
            <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
              Pulsefolio
            </span>
          </div>
          <CloseOutlined
            onClick={onMobileClose}
            style={{ color: "white", fontSize: 18, cursor: "pointer" }}
          />
        </div>

        {/* Navigation */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={filterByRole(mainItems)}
          style={{ marginTop: 12, borderInline: "none", background: "#0b132b" }}
        />

        <Divider style={{ margin: "12px 0", borderColor: "rgba(255,255,255,0.08)" }} />

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={secondaryItems}
          style={{ borderInline: "none", background: "#0b132b" }}
        />
      </div>
    );
  }

  // Desktop/Tablet sidebar
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={width}
      collapsedWidth={collapsedWidth}
      theme="dark"
      className="shadow-lg"
      trigger={null}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 20,
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

        {!collapsed && (
          <div
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              marginTop: 2,
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
        items={filterByRole(mainItems).map(withTooltip)}
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
