import { Card } from "antd";

export default function KpiCard({
  label,
  value,
  prefix,
  color,
}: {
  label: string;
  value: string | number;
  prefix?: string;
  color?: string;
}) {
  return (
    <Card
      className="shadow-sm rounded-lg dark:bg-slate-800"
      style={{ minHeight: 100 }}>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>

      <div
        className={`text-2xl font-semibold mt-1 ${
          color ?? "text-gray-900 dark:text-white"
        }`}
      >
        {prefix}
        {value}
      </div>
    </Card>
  );
}
