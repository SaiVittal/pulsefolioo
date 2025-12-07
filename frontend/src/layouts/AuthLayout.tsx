import { Card } from "antd";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--colorBgLayout] p-4">
      <Card
        style={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 12,
          padding: 24,
        }}
      >
        {children}
      </Card>
    </div>
  );
}
