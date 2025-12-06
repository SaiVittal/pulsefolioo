import { Layout, Menu } from "antd";
import { DashboardOutlined, LineChartOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

export function SidebarMenu({ collapsed }: { collapsed: boolean }) {
  const nav = useNavigate();

  return (
    <Sider collapsible collapsed={collapsed}>
      <Menu
        theme="dark"
        mode="inline"
        items={[
          { key: "/", icon: <DashboardOutlined />, label: "Dashboard", onClick: () => nav("/") },
          { key: "/analytics", icon: <LineChartOutlined />, label: "Analytics", onClick: () => nav("/analytics") },
          { type: "divider" },
          { key: "/settings", icon: <SettingOutlined />, label: "Settings", onClick: () => nav("/settings") },
        ]}
      />
    </Sider>
  );
}
