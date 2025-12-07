import { Card, Skeleton } from "antd";

export function TableSkeleton({ title }: { title?: string }) {
  return (
    <Card title={title}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </Card>
  );
}