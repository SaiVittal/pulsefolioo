import ReactECharts from "echarts-for-react";

export default function AllocationPie() {
  const option = {
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        name: "Holdings",
        type: "pie",
        radius: "65%",
        itemStyle: { borderColor: "#fff", borderWidth: 2 },
        data: [
          { value: 45, name: "AAPL" },
          { value: 25, name: "INFY" },
          { value: 15, name: "HDFC" },
          { value: 10, name: "TSLA" },
          { value: 5, name: "Other" },
        ],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260 }} />;
}
