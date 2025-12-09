import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Divider,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
  Select,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  FallOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";

import TransactionsTable from "../../../components/TransactionTable";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import { MetricCard } from "../../../components/ui/MetricCard";
import SectionCard from "../../../components/ui/SectionCard";
import PageTransition from "../../../components/ui/PageTransition";
import AppButton from "../../../components/ui/AppButton";
import CreatePortfolioModal from "../modals/CreatePortfolioModal";
import BuyStockModal from "../modals/BuyStockModal";
import SellStockModal from "../modals/SellStockModal";
import { usePortfolios } from "../hooks/usePortfolios";

const { Title, Text } = Typography;

// -----------------------------------------------------------------------------
// Mock data (still here – easy to swap with API later)
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Chart option builders
// -----------------------------------------------------------------------------

function usePortfolioValueChartOptions() {
  return useMemo(
    () => ({
      grid: { left: 40, right: 16, top: 24, bottom: 32 },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15,23,42,0.9)",
        borderWidth: 0,
        textStyle: { color: "#e5e7eb" },
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
        axisLabel: { color: "#9ca3af" },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (val: number) => `$${(val / 1000).toFixed(0)}k`,
          color: "#9ca3af",
        },
        splitLine: { lineStyle: { opacity: 0.15 } },
      },
      series: [
        {
          name: "Portfolio Value",
          type: "line",
          smooth: true,
          data: mockValueHistory.map((p) => p.value),
          symbol: "circle",
          symbolSize: 6,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            opacity: 0.12,
          },
        },
      ],
      color: ["#3b82f6"],
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
        textStyle: { color: "#9ca3af" },
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
      color: ["#3b82f6", "#10b981", "#f97316", "#6366f1"],
    }),
    []
  );
}

// -----------------------------------------------------------------------------
// Dashboard page
// -----------------------------------------------------------------------------

export default function DashboardPage() {
  const valueChartOptions = usePortfolioValueChartOptions();
  const allocationOptions = useAllocationPieOptions();

  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!selectedPortfolioId && portfolios.length > 0) {
      setSelectedPortfolioId(portfolios[0]!.id);
    }
  }, [portfolios, selectedPortfolioId]);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);

  // later this can incorporate dashboard query loading as well
  const isLoading = portfoliosLoading;
  const isUp = mockSummary.dailyChangePct >= 0;

  return (
    <PageTransition>
      <LayoutContainer>
        {/* ------------------------------------------------------------------ */}
        {/* Header: title + portfolio selector + actions                       */}
        {/* ------------------------------------------------------------------ */}
        <Row justify="space-between" align="middle" className="mb-6 w-full">
          <Col>
            <Title level={3} className="mb-0">
              Dashboard
            </Title>
            <Text type="secondary">
              Live overview of your Pulsefolio portfolio.
            </Text>
          </Col>

          <Col className="mt-3 md:mt-0">
            <Space size="middle" wrap>
              <Select
                size="large"
                style={{ minWidth: 200 }}
                loading={portfoliosLoading}
                placeholder="Select portfolio"
                value={selectedPortfolioId ?? undefined}
                onChange={(val) => setSelectedPortfolioId(val)}
                options={portfolios.map((p) => ({ label: p.name, value: p.id }))}
              />

              <AppButton kind="outline" onClick={() => setBuyModalOpen(true)}>
                Buy
              </AppButton>
              <AppButton kind="ghost" onClick={() => setSellModalOpen(true)}>
                Sell
              </AppButton>
              <AppButton kind="primary" onClick={() => setCreateModalOpen(true)}>
                Create Portfolio
              </AppButton>
            </Space>
          </Col>
        </Row>

        {/* ------------------------------------------------------------------ */}
        {/* Top metrics                                                       */}
        {/* ------------------------------------------------------------------ */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {isLoading ? (
                <Skeleton.Button
                  active
                  block
                  style={{ height: 96, borderRadius: 16 }}
                />
              ) : (
                <MetricCard
                  label="Total Value"
                  value={mockSummary.totalValue}
                  prefix="$"
                />
              )}
            </motion.div>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Card style={{ height: "100%", borderRadius: 16 }}>
                {isLoading ? (
                  <Skeleton active title={false} paragraph={{ rows: 2 }} />
                ) : (
                  <Space
                    align="start"
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Text type="secondary">Today&apos;s Change</Text>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 20,
                          fontWeight: 600,
                        }}
                      >
                        {isUp ? "+" : ""}
                        {mockSummary.dailyChangePct.toFixed(2)}%
                      </div>
                    </div>
                    <Tag
                      color={isUp ? "green" : "red"}
                      style={{ borderRadius: 999 }}
                    >
                      {isUp ? (
                        <ArrowUpOutlined style={{ marginRight: 4 }} />
                      ) : (
                        <ArrowDownOutlined style={{ marginRight: 4 }} />
                      )}
                      {isUp ? "Up" : "Down"}
                    </Tag>
                  </Space>
                )}
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Card style={{ height: "100%", borderRadius: 16 }}>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} title={false} />
                ) : (
                  <Space size={4} direction="vertical">
                    <Text type="secondary">Total P&amp;L</Text>
                    <Space align="center">
                      <DollarOutlined />
                      <Text strong style={{ fontSize: 20 }}>
                        {mockSummary.totalPnl.toLocaleString()}
                      </Text>
                      <Tag
                        color={mockSummary.totalPnl >= 0 ? "green" : "red"}
                        style={{ borderRadius: 999 }}
                      >
                        {mockSummary.totalPnl >= 0 ? "Profit" : "Loss"}
                      </Tag>
                    </Space>
                  </Space>
                )}
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 18px 30px rgba(0,0,0,0.35)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Card style={{ height: "100%", borderRadius: 16 }}>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 2 }} title={false} />
                ) : (
                  <Space size={4} direction="vertical">
                    <Text type="secondary">Holdings</Text>
                    <Text strong style={{ fontSize: 20 }}>
                      {mockSummary.holdingsCount}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Unique positions in this portfolio
                    </Text>
                  </Space>
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Divider style={{ margin: "24px 0" }} />

        {/* ------------------------------------------------------------------ */}
        {/* Value chart + P&L snapshot                                        */}
        {/* ------------------------------------------------------------------ */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <SectionCard title="Portfolio Value">
              {isLoading ? (
                <Skeleton.Input
                  active
                  block
                  style={{ height: 280, borderRadius: 16 }}
                />
              ) : (
                <ReactECharts
                  option={valueChartOptions}
                  style={{ height: 280, width: "100%" }}
                />
              )}
            </SectionCard>
          </Col>
          <Col xs={24} lg={8}>
            <SectionCard title="P&L Snapshot">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} title={false} />
              ) : (
                <Space size="large" style={{ width: "100%" }} direction="vertical">
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
              )}
            </SectionCard>
          </Col>
        </Row>

        <Divider style={{ margin: "24px 0" }} />

        {/* ------------------------------------------------------------------ */}
        {/* Holdings + Allocation                                             */}
        {/* ------------------------------------------------------------------ */}
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <SectionCard title="Holdings Overview">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 6 }} title={false} />
              ) : (
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
                      render: (
                        symbol: string,
                        record: (typeof mockHoldings)[number]
                      ) => (
                        <Space>
                          {/* future: plug in real logos if you want */}
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: 999,
                              background:
                                "radial-gradient(circle at 30% 30%, #60a5fa, #1d4ed8)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {symbol[0]}
                          </div>
                          <div>
                            <Text strong>{symbol}</Text>
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {record.name}
                              </Text>
                            </div>
                          </div>
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
                      title: "P&L %",
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
              )}
            </SectionCard>
          </Col>

          <Col xs={24} xl={10}>
            <SectionCard title="Allocation">
              {isLoading ? (
                <Skeleton.Input
                  active
                  block
                  style={{ height: 260, borderRadius: 16 }}
                />
              ) : (
                <ReactECharts
                  option={allocationOptions}
                  style={{ height: 260, width: "100%" }}
                />
              )}
            </SectionCard>
          </Col>
        </Row>

        <Divider style={{ margin: "24px 0" }} />

        {/* ------------------------------------------------------------------ */}
        {/* Gainers / Losers + Cash                                           */}
        {/* ------------------------------------------------------------------ */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <SectionCard title="Top Gainers">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : (
                <Space style={{ width: "100%" }} direction="vertical">
                  {mockGainers.map((g) => (
                    <Space
                      key={g.symbol}
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>{g.symbol}</Text>
                      <Text type="success">
                        <ArrowUpOutlined /> +{g.changePct.toFixed(2)}%
                      </Text>
                    </Space>
                  ))}
                </Space>
              )}
            </SectionCard>
          </Col>

          <Col xs={24} md={8}>
            <SectionCard title="Top Losers">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : (
                <Space style={{ width: "100%" }} direction="vertical">
                  {mockLosers.map((l) => (
                    <Space
                      key={l.symbol}
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>{l.symbol}</Text>
                      <Text type="danger">
                        <ArrowDownOutlined /> {l.changePct.toFixed(2)}%
                      </Text>
                    </Space>
                  ))}
                </Space>
              )}
            </SectionCard>
          </Col>

          <Col xs={24} md={8}>
            <SectionCard title="Cash & Liquidity">
              {isLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} title={false} />
              ) : (
                <Space style={{ width: "100%" }} size="middle" direction="vertical">
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
              )}
            </SectionCard>
          </Col>
        </Row>

        <Divider style={{ margin: "24px 0" }} />

        {/* ------------------------------------------------------------------ */}
        {/* Recent Transactions                                                */}
        {/* ------------------------------------------------------------------ */}
        <SectionCard title="Recent Transactions">
          {/* still mock; later replace with useQuery(/api/Transactions/portfolio/{id}) */}
          <TransactionsTable mock />
        </SectionCard>

        {/* ------------------------------------------------------------------ */}
        {/* Modals                                                             */}
        {/* ------------------------------------------------------------------ */}
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
