import { Card, Table, Typography, Tag, Spin, Alert, Row, Col } from "antd";
import { RiseOutlined, FallOutlined, StockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import SectionCard from "../../../components/ui/SectionCard";
import { useMarketIndices, useTrendingStocks } from "../../market/hooks/useMarket";

const { Title } = Typography;

export default function MarketPage() {
    const { data: indices, isLoading: indicesLoading, error: indicesError } = useMarketIndices();
    const { data: trending, isLoading: trendingLoading, error: trendingError } = useTrendingStocks();

    return (
        <LayoutContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <Title level={2} className="!text-gray-900 dark:!text-white !m-0">
                        Market Overview
                    </Title>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Real-time market data and trends.
                    </p>
                </div>

                <Row gutter={[24, 24]} className="mb-8">
                    {indicesLoading ? (
                        <Col xs={24} className="flex justify-center py-8">
                            <Spin size="large" />
                        </Col>
                    ) : indicesError ? (
                        <Col xs={24}>
                            <Alert type="error" message="Failed to load market indices" />
                        </Col>
                    ) : (
                        indices?.map((index) => (
                            <Col xs={24} sm={8} key={index.symbol}>
                                <Card
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-700"
                                    bordered={false}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <StockOutlined className="text-xl text-blue-500" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{index.name}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        ${index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <Tag
                                        color={index.changePercent >= 0 ? "success" : "error"}
                                        className="font-semibold"
                                        icon={index.changePercent >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                    >
                                        {index.changePercent >= 0 ? "+" : ""}{index.changePercent.toFixed(2)}%
                                    </Tag>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                <SectionCard title="Trending Stocks">
                    {trendingLoading ? (
                        <div className="flex justify-center py-8">
                            <Spin size="large" />
                        </div>
                    ) : trendingError ? (
                        <Alert type="error" message="Failed to load trending stocks" />
                    ) : (
                        <Table
                            dataSource={trending}
                            rowKey="symbol"
                            pagination={false}
                            className="custom-table"
                            columns={[
                                {
                                    title: "Symbol",
                                    dataIndex: "symbol",
                                    key: "symbol",
                                    render: (text) => (
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{text}</span>
                                    ),
                                },
                                {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                    className: "text-gray-600 dark:text-gray-300",
                                },
                                {
                                    title: "Price",
                                    dataIndex: "price",
                                    key: "price",
                                    align: "right",
                                    render: (val) => (
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    ),
                                },
                                {
                                    title: "Change",
                                    dataIndex: "changePercent",
                                    key: "changePercent",
                                    align: "right",
                                    render: (val) => (
                                        <Tag
                                            color={val >= 0 ? "success" : "error"}
                                            icon={val >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                        >
                                            {val >= 0 ? "+" : ""}{val.toFixed(2)}%
                                        </Tag>
                                    ),
                                },
                            ]}
                        />
                    )}
                </SectionCard>
            </motion.div>
        </LayoutContainer>
    );
}
