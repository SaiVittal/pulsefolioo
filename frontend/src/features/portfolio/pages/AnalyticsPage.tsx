import { Row, Col, Typography } from "antd";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import SectionCard from "../../../components/ui/SectionCard";
import { useTop10Analytics } from "../hooks/useAnalytics";

const { Title } = Typography;

export default function AnalyticsPage() {
  useTop10Analytics();

  // Mock data for visualization if API data isn't ready or structured for charts
  const performanceData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    returns: [1200, 1350, 1100, 1600, 1900, 2100],
    benchmark: [1000, 1100, 1150, 1300, 1400, 1500]
  };

  const performanceOption = {
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#9ca3af' }, bottom: 0 },
    grid: { left: 40, right: 20, top: 20, bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: performanceData.months,
      axisLine: { lineStyle: { color: '#9ca3af' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#374151' } },
      axisLine: { show: false }
    },
    series: [
      {
        name: 'Portfolio',
        type: 'line',
        smooth: true,
        data: performanceData.returns,
        lineStyle: { width: 4, color: '#3b82f6' },
        areaStyle: { opacity: 0.2, color: '#3b82f6' }
      },
      {
        name: 'Benchmark (S&P 500)',
        type: 'line',
        smooth: true,
        data: performanceData.benchmark,
        lineStyle: { width: 2, type: 'dashed', color: '#10b981' }
      }
    ]
  };

  const compositionOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 1 },
        data: [
          { value: 45, name: 'Technology' },
          { value: 20, name: 'Finance' },
          { value: 15, name: 'Healthcare' },
          { value: 10, name: 'Energy' },
          { value: 10, name: 'Other' }
        ],
        label: { show: false }
      }
    ]
  };

  return (
    <LayoutContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <Title level={2} className="!text-gray-900 dark:!text-white !m-0">
            Analytics
          </Title>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Deep dive into your portfolio performance.
          </p>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <SectionCard title="Growth vs Benchmark">
              <ReactECharts option={performanceOption} theme="dark" style={{ height: 400 }} />
            </SectionCard>
          </Col>
          <Col xs={24} lg={8}>
            <SectionCard title="Sector Allocation">
              <ReactECharts option={compositionOption} theme="dark" style={{ height: 400 }} />
            </SectionCard>
          </Col>
        </Row>
      </motion.div>
    </LayoutContainer>
  );
}
