import { useEffect, useMemo, useState } from "react";
import {
  Col,
  Divider,
  Row,
  Skeleton,
  Space,
  Table,
  Select,
  ConfigProvider,
  theme
} from "antd";
import ReactECharts from "echarts-for-react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  WalletOutlined,
  LineChartOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

import LayoutContainer from "../../../components/ui/LayoutContainer";
import { MetricCard } from "../../../components/ui/MetricCard";
import SectionCard from "../../../components/ui/SectionCard";
import AppButton from "../../../components/ui/AppButton";
import CreatePortfolioModal from "../modals/CreatePortfolioModal";
import BuyStockModal from "../modals/BuyStockModal";
import SellStockModal from "../modals/SellStockModal";
import { usePortfolios } from "../hooks/usePortfolios";
import { usePortfolioSummary } from "../hooks/usePortfolioSummary";
import { useHoldings } from "../hooks/useHoldings";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

export default function DashboardPage() {
  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPortfolioId && portfolios.length > 0) {
      setSelectedPortfolioId(portfolios[0]!.id);
    }
  }, [portfolios, selectedPortfolioId]);

  const { data: summaryData } = usePortfolioSummary(selectedPortfolioId);
  const { data: holdings = [] } = useHoldings(selectedPortfolioId);

  // Charts Data (Derived from summary/holdings usually)
  const safeHoldings = Array.isArray(holdings) ? holdings : [];
  const allocationData = safeHoldings.map(h => ({ name: h.symbol, value: h.quantity * (h.currentPrice || h.averagePrice || 0) }));

  // Chart Options
  const valueChartOptions = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 16, top: 24, bottom: 32, containLabel: true },
    xAxis: { type: "category", data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], boundaryGap: false, axisLine: { lineStyle: { color: '#9ca3af' } } },
    yAxis: { type: "value", splitLine: { lineStyle: { type: 'dashed', color: '#374151' } }, axisLine: { show: false } },
    series: [{
      type: "line",
      data: [820, 932, 901, 934, 1290, 1330, 1320], // Mock for MVP visual
      smooth: true,
      lineStyle: { width: 4, color: '#3b82f6' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]
        }
      },
      showSymbol: false
    }]
  }), []);

  const allocationOptions = useMemo(() => ({
    tooltip: { trigger: "item", formatter: "{b}: {d}%" },
    legend: { bottom: '0%', left: 'center', textStyle: { color: '#9ca3af' } },
    series: [{
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      data: allocationData.length ? allocationData : [{ value: 1, name: 'Empty' }],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } }
    }]
  }), [allocationData]);

  const gainers = holdings.filter(h => (h.pnlPct || 0) > 0).sort((a, b) => (b.pnlPct || 0) - (a.pnlPct || 0)).slice(0, 3);
  const losers = holdings.filter(h => (h.pnlPct || 0) < 0).sort((a, b) => (a.pnlPct || 0) - (b.pnlPct || 0)).slice(0, 3);

  // Fallback defaults
  const rawSummary = summaryData || {
    totalValue: 0,
    totalCost: 0,
    totalPnl: 0,
    dayPnl: 0,
    holdingsCount: 0
  };

  const summary = {
    ...rawSummary,
    dailyChangePct: (rawSummary.totalValue - rawSummary.dayPnl) > 0
      ? (rawSummary.dayPnl / (rawSummary.totalValue - rawSummary.dayPnl)) * 100
      : 0
  };

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);

  const isLoading = portfoliosLoading;

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <LayoutContainer>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ----------------- Header ----------------- */}
          <motion.div variants={itemVariants} className="mb-8">
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Overview of your wealth and market usage.
                </p>
              </Col>

              <Col>
                <Space size="middle" wrap>
                  <Select
                    size="large"
                    className="min-w-[200px]"
                    // Antd select styling override via class is tricky, relying on ConfigProvider
                    loading={portfoliosLoading}
                    placeholder="Select portfolio"
                    value={selectedPortfolioId ?? undefined}
                    onChange={(val) => setSelectedPortfolioId(val)}
                    options={portfolios.map((p) => ({ label: p.name, value: p.id }))}
                  />

                  <AppButton kind="outline" onClick={() => setBuyModalOpen(true)} icon={<PlusOutlined />}>
                    Buy
                  </AppButton>
                  <AppButton kind="ghost" onClick={() => setSellModalOpen(true)}>
                    Sell
                  </AppButton>
                  <AppButton kind="primary" onClick={() => setCreateModalOpen(true)} icon={<WalletOutlined />}>
                    New Portfolio
                  </AppButton>
                </Space>
              </Col>
            </Row>
          </motion.div>

          {/* ----------------- Metrics Grid ----------------- */}
          <motion.div variants={itemVariants}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                {isLoading ? <Skeleton.Button active block className="!h-32 !rounded-2xl" /> : (
                  <MetricCard
                    label="Total Portfolio Value"
                    value={summary.totalValue}
                    prefix="$"
                    trend={summary.dailyChangePct}
                  />
                )}
              </Col>
              <Col xs={24} sm={12} lg={6}>
                {isLoading ? <Skeleton.Button active block className="!h-32 !rounded-2xl" /> : (
                  <MetricCard
                    label="Total P&L"
                    value={summary.totalPnl}
                    prefix="$"
                    trend={(summary.totalPnl / (summary.totalCost || 1)) * 100}
                  />
                )}
              </Col>
              <Col xs={24} sm={12} lg={6}>
                {isLoading ? <Skeleton.Button active block className="!h-32 !rounded-2xl" /> : (
                  <MetricCard
                    label="Total Cost Basis"
                    value={summary.totalCost}
                    prefix="$"
                  />
                )}
              </Col>
              <Col xs={24} sm={12} lg={6}>
                {isLoading ? <Skeleton.Button active block className="!h-32 !rounded-2xl" /> : (
                  <MetricCard
                    label="Active Holdings"
                    value={summary.holdingsCount}
                  />
                )}
              </Col>
            </Row>
          </motion.div>

          <Divider className="my-8 opacity-20" />

          {/* ----------------- Charts Section ----------------- */}
          <motion.div variants={itemVariants}>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <SectionCard title="Performance History">
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                  ) : (
                    <ReactECharts
                      option={valueChartOptions}
                      style={{ height: 350, width: "100%" }}
                      theme="dark" // Using dark theme for echarts to match
                    />
                  )}
                </SectionCard>
              </Col>
              <Col xs={24} lg={8}>
                <SectionCard title="Asset Allocation">
                  {isLoading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                  ) : (
                    <ReactECharts
                      option={allocationOptions}
                      style={{ height: 350, width: "100%" }}
                    />
                  )}
                </SectionCard>
              </Col>
            </Row>
          </motion.div>

          <div className="h-8" />

          {/* ----------------- Holdings Table ----------------- */}
          <motion.div variants={itemVariants}>
            <SectionCard
              title="Holdings Overview"
              action={<AppButton kind="ghost" size="small" icon={<LineChartOutlined />}>View All</AppButton>}
            >
              <Table
                rowKey="symbol"
                className="custom-table"
                size="middle"
                pagination={false}
                dataSource={holdings}
                scroll={{ x: true }}
                columns={[
                  {
                    title: "Asset",
                    dataIndex: "symbol",
                    key: "symbol",
                    render: (symbol: string, record: any) => (
                      <Space>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {symbol[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{symbol}</span>
                          <span className="text-xs text-gray-500">{record.symbol} Inc.</span>
                        </div>
                      </Space>
                    ),
                  },
                  {
                    title: "Qty",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "right",
                    render: (val) => <span className="font-medium">{val}</span>
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
                      <span className={`font-semibold ${val >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {val >= 0 ? "+" : ""}
                        {val ? val.toFixed(2) : '0.00'}%
                      </span>
                    ),
                  },
                  {
                    title: "Value",
                    dataIndex: "value",
                    key: "value",
                    align: "right",
                    render: (val: number) =>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                  },
                ]}
              />
            </SectionCard>
          </motion.div>

          <div className="h-8" />

          {/* ----------------- Top Movers ----------------- */}
          <motion.div variants={itemVariants}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <SectionCard title="Top Gainers">
                  <div className="space-y-4">
                    {gainers.length === 0 && <span className="text-gray-500 text-sm">No positive movement yet.</span>}
                    {gainers.map((g) => (
                      <div key={g.symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-green-500/20 transition-colors">
                        <Space>
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <ArrowUpOutlined />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{g.symbol}</span>
                        </Space>
                        <span className="text-green-500 font-bold">
                          +{(g.pnlPct || 0).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </Col>
              <Col xs={24} md={12}>
                <SectionCard title="Top Losers">
                  <div className="space-y-4">
                    {losers.length === 0 && <span className="text-gray-500 text-sm">No negative movement. Great job!</span>}
                    {losers.map((l) => (
                      <div key={l.symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-red-500/20 transition-colors">
                        <Space>
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <ArrowDownOutlined />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{l.symbol}</span>
                        </Space>
                        <span className="text-red-500 font-bold">
                          {(l.pnlPct || 0).toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </Col>
            </Row>
          </motion.div>

        </motion.div>

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
    </ConfigProvider>
  );
}
