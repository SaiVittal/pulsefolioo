import ReactECharts from "echarts-for-react";

interface EChartProps {
  option: any;
  height?: number;
}

export default function EChart({ option, height = 300 }: EChartProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
