import { Card, Skeleton } from "antd";

export function MetricCardSkeleton() {
  return (
    <Card>
      <Skeleton.Input active style={{ width: 120, height: 16 }} />
      <div style={{ marginTop: 12 }}>
        <Skeleton.Input active style={{ width: 80, height: 28 }} />
      </div>
    </Card>
  );
}