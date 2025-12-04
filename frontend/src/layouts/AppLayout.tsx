import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

export default function AppLayout() {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-blue-600 text-white px-6 flex items-center">
        <h1 className="text-xl font-semibold">Pulsefolio</h1>
      </Header>

      <Content className="p-6 bg-gray-50">
        <Outlet />
      </Content>
    </Layout>
  );
}
