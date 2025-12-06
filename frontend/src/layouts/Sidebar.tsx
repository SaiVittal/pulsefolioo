import { Divider, Layout, Menu } from "antd";
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
  const clearAuth = useAuthStore((s: { clearAuth: () => void }) => s.clearAuth);

  const items: MenuItemType[] = [
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

    { key: "divider-1", label: "divider", icon: <Divider /> },

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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={width}
      collapsedWidth={collapsedWidth}
      className="shadow-lg bg-[#001529]"
      style={{ position: "fixed", height: "100vh", left: 0 }}
    >
      <div className="text-white text-lg font-bold px-4 py-4">
        {collapsed ? "PF" : "Pulsefolio"}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={[location.pathname]}
      />
    </Sider>
  );
}
