import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: React.ReactNode;
  trend?: number; // Optional percentage change
}

export function MetricCard({ label, value, prefix, trend }: MetricCardProps) {
  const isPositive = (trend || 0) >= 0;

  return (
    <div className="glass-card rounded-2xl p-6 hover:bg-opacity-80 transition-all duration-300 h-full flex flex-col justify-between group">
      <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
        {label}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          {prefix}{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'} bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-full`}>
            {isPositive ? <ArrowUpOutlined className="mr-1" /> : <ArrowDownOutlined className="mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
