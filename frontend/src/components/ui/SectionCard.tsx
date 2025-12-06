  import { Card } from "antd";

  export default function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <Card
        title={title}
        styles={{ body: { padding: 16 } }}
      >
        {children}
      </Card>
    );
  }
