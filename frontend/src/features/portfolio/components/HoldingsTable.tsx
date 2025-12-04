import { Table, Tag } from "antd";
import { useHoldings } from "../hooks/useHoldings";

export default function HoldingsTable() {
  const { data, isLoading } = useHoldings();

  return (
    <Table
      loading={isLoading}
      dataSource={data ?? []}
      rowKey="id"
      pagination={false}
      columns={[
        { title: "Symbol", dataIndex: "symbol" },
        { title: "Qty", dataIndex: "quantity" },
        { title: "Avg Price", dataIndex: "avgPrice" },
        { title: "LTP", dataIndex: "currentPrice" },
        {
          title: "P&L",
          dataIndex: "pnl",
          render: (value) => (
            <Tag color={value >= 0 ? "green" : "red"}>
              {value.toFixed(2)}
            </Tag>
          ),
        },
      ]}
    />
  );
}
