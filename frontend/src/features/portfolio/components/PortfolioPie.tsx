import { Card } from "antd";
import EChart from "../../../components/charts/EChart";

export default function PortfolioPie() {
  const option: any = {
    tooltip: { trigger: "item" },
    legend: { orient: "horizontal", top: "bottom" },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: [
          { value: 40, name: "AAPL" },
          { value: 25, name: "TSLA" },
          { value: 20, name: "INFY" },
          { value: 15, name: "HDFC" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
          },
        },
      },
    ],
  };

  return (
    <Card title="Portfolio Allocation">
      <EChart option={option} height={350} />
    </Card>
  );
}
