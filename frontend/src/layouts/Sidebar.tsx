import { Layout, Menu } from "antd";
import {
  PieChartOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/auth/hooks/useLogout";
import { useAuthStore } from "../store/auth";

const { Sider } = Layout;

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const logout = useLogout();
  const role = useAuthStore((s) => s.role);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      className="min-h-screen bg-white shadow-lg"
      width={220}
    >
      <div className="h-16 flex items-center justify-center text-xl font-bold">
        {!collapsed ? "Pulsefolio" : "PF"}
      </div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={[
          {
            key: "dashboard",
            icon: <PieChartOutlined />,
            label: "Dashboard",
            onClick: () => navigate("/"),
          },
          {
            key: "analytics",
            icon: <BarChartOutlined />,
            label: "Analytics",
            onClick: () => navigate("/analytics"),
            disabled: role !== "Analyst" && role !== "Admin",
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            danger: true,
            label: "Logout",
            onClick: () => logout(),
          },
        ]}
      />
    </Sider>
  );
}
