import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import UserAvatar from "../components/UserAvatar";


const { Header } = Layout;

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}

export default function Topbar({ collapsed, setCollapsed, isMobile }: TopbarProps) {
  return (
<Header
  className="w-full flex items-center justify-between bg-white dark:bg-[#111] shadow-sm px-4 sticky top-0 z-10"
  style={{ height: 64, padding: "0 24px" }}
>
  {/* Left */}
  <div className="flex items-center gap-2">
    {!isMobile && (
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
    )}
    <span className="font-semibold text-lg">Dashboard</span>
  </div>

  {/* Right */}
  <div className="flex items-center gap-3">
    <UserAvatar />
  </div>
</Header>



  );
}
