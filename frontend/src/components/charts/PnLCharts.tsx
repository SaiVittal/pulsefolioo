import ReactECharts from "echarts-for-react";

export default function PnlChart() {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      boundaryGap: false,
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [120, 130, 90, 150, 180],
        type: "line",
        smooth: true,
        areaStyle: { opacity: 0.4 },
        lineStyle: { width: 3, color: "#4A90E2" },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260 }} />;
}
