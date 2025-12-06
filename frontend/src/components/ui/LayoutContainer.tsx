import { Layout } from "antd";

export default function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ padding: 24, minHeight: "100vh" }}>
      {children}
    </Layout>
  );
}
