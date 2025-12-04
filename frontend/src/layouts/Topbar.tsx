import { Layout, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useAuthStore } from "../store/auth";

const { Header } = Layout;

export function Topbar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const { role } = useAuthStore();
  const { token } = theme.useToken();

  return (
    <Header
      style={{
        padding: "0 16px",
        background: token.colorBgContainer,
      }}
      className="flex items-center justify-between shadow-sm"
    >
      <Button
        type="text"
        onClick={() => setCollapsed(!collapsed)}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      />

      <div className="font-medium text-gray-600">
        Role: <span className="font-bold">{role}</span>
      </div>
    </Header>
  );
}
