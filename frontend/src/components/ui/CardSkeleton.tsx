import { Card, Skeleton } from "antd";

export function ChartSkeleton({ title }: { title?: string }) {
  return (
    <Card title={title}>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  );
}