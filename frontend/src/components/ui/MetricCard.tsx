import { Card, Statistic } from "antd";

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: React.ReactNode;
}

export function MetricCard({ label, value, prefix }: MetricCardProps) {
  return (
    <Card style={{ textAlign: "center" }}>
      <Statistic
        title={label}
        value={value}
        prefix={prefix}
        precision={2}
      />
    </Card>
  );
}
