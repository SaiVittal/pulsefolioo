import { Card } from "antd";
import EChart from "../../../components/charts/EChart";

export default function ProfitChart() {
  const option: any = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      boundaryGap: false,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "PnL",
        type: "line",
        smooth: true,
        areaStyle: {},
        itemStyle: { color: "#1677ff" },
        data: [100, 120, 90, 150, 180],
      },
    ],
  };

  return (
    <Card title="Portfolio P&L (Weekly)">
      <EChart option={option} height={350} />
    </Card>
  );
}
