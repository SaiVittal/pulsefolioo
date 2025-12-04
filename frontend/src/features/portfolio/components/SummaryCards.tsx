import { Card, Statistic, Row, Col, Skeleton } from "antd";
import { motion } from "framer-motion";
import { usePortfolioSummary } from "../hooks/usePortfolioSummary";

export default function SummaryCards() {
  const { data, isLoading } = usePortfolioSummary();

  const items = [
    {
      label: "Total Value",
      value: data?.totalValue,
    },
    {
      label: "Invested",
      value: data?.invested,
    },
    {
      label: "Total P&L",
      value: data?.totalPnL,
    },
    {
      label: "Today's P&L",
      value: data?.todaysPnL,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item, idx) => (
        <Col xs={24} sm={12} md={6} key={item.label}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              {isLoading ? (
                <Skeleton active paragraph={false} />
              ) : (
                <Statistic
                  title={item.label}
                  value={item.value ?? 0}
                  precision={2}
                />
              )}
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}
