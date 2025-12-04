import { Layout } from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const { Content } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} />

      <Layout>
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="p-6 bg-gray-50 min-h-screen">
          <Outlet />  
        </Content>
      </Layout>
    </Layout>
  );
}
