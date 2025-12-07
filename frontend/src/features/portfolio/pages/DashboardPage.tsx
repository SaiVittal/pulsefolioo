import { useMemo, useState } from "react";
import { Card, Col, Row, Table, Tag, Typography, Space, Divider } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";

import TransactionsTable from "../../../components/TransactionTable";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import { MetricCard } from "../../../components/ui/MetricCard";
import SectionCard from "../../../components/ui/SectionCard";
import PageTransition from "../../../components/ui/PageTransition";
import AppButton from "../../../components/ui/AppButton";

import { Select } from "antd";
import { useEffect } from "react";
import CreatePortfolioModal from "../modals/CreatePortfolioModal";
import BuyStockModal from "../modals/BuyStockModal";
import SellStockModal from "../modals/SellStockModal";
import { usePortfolios } from "../hooks/usePortfolios";


const { Title, Text } = Typography;

// --------- Mock data (replace with API later) ---------

const mockSummary = {
  totalValue: 105000,
  dailyChangePct: 1.8,
  totalPnl: 8200,
  holdingsCount: 9,
};

const mockValueHistory = [
  { date: "2025-10-01", value: 82000 },
  { date: "2025-10-10", value: 87000 },
  { date: "2025-10-20", value: 91000 },
  { date: "2025-10-30", value: 98000 },
  { date: "2025-11-10", value: 102500 },
  { date: "2025-11-20", value: 105000 },
];

const mockAllocation = [
  { name: "US Stocks", value: 55 },
  { name: "Indian Stocks", value: 25 },
  { name: "ETFs", value: 12 },
  { name: "Cash", value: 8 },
];

const mockHoldings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 10,
    avgBuy: 150.25,
    lastPrice: 172.4,
    pnlPct: 14.7,
    value: 1724,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    quantity: 5,
    avgBuy: 320.5,
    lastPrice: 305.1,
    pnlPct: -4.8,
    value: 1525.5,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 3,
    avgBuy: 2800,
    lastPrice: 2905,
    pnlPct: 3.7,
    value: 8715,
  },
];

const mockGainers = [
  { symbol: "NVDA", changePct: 5.6 },
  { symbol: "TSLA", changePct: 4.2 },
  { symbol: "AAPL", changePct: 2.8 },
];

const mockLosers = [
  { symbol: "NFLX", changePct: -3.4 },
  { symbol: "META", changePct: -2.7 },
  { symbol: "AMZN", changePct: -1.9 },
];

// --------- Chart option builders (mock) ---------

function usePortfolioValueChartOptions() {
  return useMemo(
    () => ({
      grid: { left: 40, right: 16, top: 24, bottom: 32 },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const p = params[0];
          return `${p.axisValue}<br/>Value: $${p.data.toLocaleString()}`;
        },
      },
      xAxis: {
        type: "category",
        data: mockValueHistory.map((p) => p.date),
        boundaryGap: false,
        axisLine: { lineStyle: { opacity: 0.3 } },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
        },
        splitLine: { lineStyle: { opacity: 0.15 } },
      },
      series: [
        {
          name: "Portfolio Value",
          type: "line",
          smooth: true,
          data: mockValueHistory.map((p) => p.value),
          areaStyle: { opacity: 0.12 },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
    }),
    []
  );
}

function useAllocationPieOptions() {
  return useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {d}%",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Allocation",
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderWidth: 1,
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: mockAllocation.map((a) => ({
            name: a.name,
            value: a.value,
          })),
        },
      ],
    }),
    []
  );
}

// --------- Page component ---------

export default function DashboardPage() {
  const valueChartOptions = usePortfolioValueChartOptions();
  const allocationOptions = useAllocationPieOptions();

const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios();
const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

useEffect(() => {
  if (!selectedPortfolioId && portfolios.length > 0) {
    setSelectedPortfolioId(portfolios[0]!.id);
  }
}, [portfolios, selectedPortfolioId]);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);  

  const isUp = mockSummary.dailyChangePct >= 0;

  return (
      <PageTransition>
    <LayoutContainer>
      {/* Page header */}
 
<div className="flex flex-wrap justify-between items-start mb-6">
  <div>
    <Title level={3} className="mb-1!">Dashboard</Title>
    <Text type="secondary">Live overview of your Pulsefolio portfolio.</Text>
  </div>

  <div className="flex flex-wrap gap-2 items-center mt-2 md:mt-0">
    <Select
      size="middle"
      style={{ minWidth: 180 }}
      loading={portfoliosLoading}
      placeholder="Select portfolio"
      value={selectedPortfolioId ?? undefined}
      onChange={(val) => setSelectedPortfolioId(val)}
      options={portfolios.map((p) => ({ label: p.name, value: p.id }))}
    />
    <AppButton kind="primary" onClick={() => setCreateModalOpen(true)}>
      Create Portfolio
    </AppButton>
    <AppButton kind="outline" onClick={() => setBuyModalOpen(true)}>
      Buy
    </AppButton>
    <AppButton kind="ghost" onClick={() => setSellModalOpen(true)}>
      Sell
    </AppButton>
  </div>
</div>




      {/* Top metrics row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <MetricCard
            label="Total Value"
            value={mockSummary.totalValue}
            prefix="$"
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            style={{ height: "100%" }}
          >
            <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
              <div>
                <Text type="secondary">Today's Change</Text>
                <div style={{ marginTop: 4, fontSize: 20, fontWeight: 600 }}>
                  {isUp ? "+" : ""}
                  {mockSummary.dailyChangePct.toFixed(2)}%
                </div>
              </div>
              <Tag color={isUp ? "green" : "red"} style={{ borderRadius: 999 }}>
                {isUp ? (
                  <ArrowUpOutlined style={{ marginRight: 4 }} />
                ) : (
                  <ArrowDownOutlined style={{ marginRight: 4 }} />
                )}
                {isUp ? "Up" : "Down"}
              </Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            style={{ height: "100%" }}
          >
            <Space size={4}>
              <Text type="secondary">Total P&amp;L</Text>
              <Space align="center">
                <DollarOutlined />
                <Text strong style={{ fontSize: 20 }}>
                  {mockSummary.totalPnl.toLocaleString()}
                </Text>
                <Tag color={mockSummary.totalPnl >= 0 ? "green" : "red"}>
                  {mockSummary.totalPnl >= 0 ? "Profit" : "Loss"}
                </Tag>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card
            style={{ height: "100%" }}
          >
            <Space size={4}>
              <Text type="secondary">Holdings</Text>
              <Text strong style={{ fontSize: 20 }}>
                {mockSummary.holdingsCount}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Unique positions in this portfolio
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: "24px 0" }} />

      {/* Value chart + PnL snapshot */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <SectionCard title="Portfolio Value">
            <ReactECharts
              option={valueChartOptions}
              style={{ height: 280, width: "100%" }}
            />
          </SectionCard>
        </Col>
        <Col xs={24} lg={8}>
          <SectionCard title="P&amp;L Snapshot">
            <Space size="large" style={{ width: "100%" }}>
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space>
                  <RiseOutlined />
                  <Text type="secondary">Best Performer</Text>
                </Space>
                <Text strong>NVDA · +18.4%</Text>
              </Space>
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space>
                  <FallOutlined />
                  <Text type="secondary">Worst Performer</Text>
                </Space>
                <Text strong type="danger">
                  NFLX · -7.2%
                </Text>
              </Space>
              <Divider style={{ margin: "8px 0" }} />
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text type="secondary">Realized P&amp;L</Text>
                <Text strong>$4,350</Text>
              </Space>
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text type="secondary">Unrealized P&amp;L</Text>
                <Text strong>$3,850</Text>
              </Space>
            </Space>
          </SectionCard>
        </Col>
      </Row>

      <Divider style={{ margin: "24px 0" }} />

      {/* Holdings + Allocation */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <SectionCard title="Holdings Overview">
            <Table
              rowKey="symbol"
              size="small"
              pagination={false}
              dataSource={mockHoldings}
              scroll={{ x: true }}
              columns={[
                {
                  title: "Asset",
                  dataIndex: "symbol",
                  key: "symbol",
                  render: (symbol, record) => (
                    <Space size={0}>
                      <Text strong>{symbol}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.name}
                      </Text>
                    </Space>
                  ),
                },
                {
                  title: "Qty",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "right",
                },
                {
                  title: "Avg Buy",
                  dataIndex: "avgBuy",
                  key: "avgBuy",
                  align: "right",
                  render: (val: number) => `$${val.toFixed(2)}`,
                },
                {
                  title: "Last Price",
                  dataIndex: "lastPrice",
                  key: "lastPrice",
                  align: "right",
                  render: (val: number) => `$${val.toFixed(2)}`,
                },
                {
                  title: "P&amp;L %",
                  dataIndex: "pnlPct",
                  key: "pnlPct",
                  align: "right",
                  render: (val: number) => (
                    <Text type={val >= 0 ? "success" : "danger"}>
                      {val >= 0 ? "+" : ""}
                      {val.toFixed(2)}%
                    </Text>
                  ),
                },
                {
                  title: "Value",
                  dataIndex: "value",
                  key: "value",
                  align: "right",
                  render: (val: number) =>
                    `$${val.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`,
                },
              ]}
            />
          </SectionCard>
        </Col>
        <Col xs={24} xl={10}>
          <SectionCard title="Allocation">
            <ReactECharts
              option={allocationOptions}
              style={{ height: 260, width: "100%" }}
            />
          </SectionCard>
        </Col>
      </Row>

      <Divider style={{ margin: "24px 0" }} />

      {/* Gainers / Losers + Transactions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <SectionCard title="Top Gainers">
            <Space style={{ width: "100%" }}>
              {mockGainers.map((g) => (
                <Space
                  key={g.symbol}
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text strong>{g.symbol}</Text>
                  <Text type="success">
                    <ArrowUpOutlined /> +{g.changePct.toFixed(2)}%
                  </Text>
                </Space>
              ))}
            </Space>
          </SectionCard>
        </Col>
        <Col xs={24} md={8}>
          <SectionCard title="Top Losers">
            <Space style={{ width: "100%" }}>
              {mockLosers.map((l) => (
                <Space
                  key={l.symbol}
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text strong>{l.symbol}</Text>
                  <Text type="danger">
                    <ArrowDownOutlined /> {l.changePct.toFixed(2)}%
                  </Text>
                </Space>
              ))}
            </Space>
          </SectionCard>
        </Col>
        <Col xs={24} md={8}>
          <SectionCard title="Cash &amp; Liquidity">
            <Space style={{ width: "100%" }} size="middle">
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text type="secondary">Cash Balance</Text>
                <Text strong>$12,500</Text>
              </Space>
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text type="secondary">Invested</Text>
                <Text strong>$92,500</Text>
              </Space>
              <Space
                align="center"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Text type="secondary">Margin Used</Text>
                <Text strong>$0</Text>
              </Space>
            </Space>
          </SectionCard>
        </Col>
      </Row>

      <Divider style={{ margin: "24px 0" }} />

      {/* Your existing transactions table */}
      <SectionCard title="Recent Transactions">
        <TransactionsTable mock />
      </SectionCard>


      <CreatePortfolioModal
  open={isCreateModalOpen}
  onClose={() => setCreateModalOpen(false)}
/>

<BuyStockModal
  open={isBuyModalOpen}
  portfolioId={selectedPortfolioId}
  onClose={() => setBuyModalOpen(false)}
/>

<SellStockModal
  open={isSellModalOpen}
  portfolioId={selectedPortfolioId}
  onClose={() => setSellModalOpen(false)}
/>
    </LayoutContainer>
    </PageTransition> 
  );
}
