import { Table, Tag, Typography } from "antd";
import { motion } from "framer-motion";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import SectionCard from "../../../components/ui/SectionCard";

const { Title } = Typography;

// Mock data for transactions
const transactions = [
    { id: "1", type: "BUY", symbol: "AAPL", quantity: 10, price: 150.25, total: 1502.5, date: "2024-02-14 10:30 AM" },
    { id: "2", type: "SELL", symbol: "TSLA", quantity: 5, price: 200.00, total: 1000.0, date: "2024-02-13 02:15 PM" },
    { id: "3", type: "BUY", symbol: "MSFT", quantity: 15, price: 310.50, total: 4657.5, date: "2024-02-12 09:45 AM" },
    { id: "4", type: "BUY", symbol: "NVDA", quantity: 2, price: 750.00, total: 1500.0, date: "2024-02-10 11:20 AM" },
    { id: "5", type: "SELL", symbol: "AMZN", quantity: 20, price: 145.20, total: 2904.0, date: "2024-02-08 03:00 PM" },
];

export default function TransactionsPage() {
    return (
        <LayoutContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <Title level={2} className="!text-gray-900 dark:!text-white !m-0">
                        Transactions
                    </Title>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        History of your trading activities.
                    </p>
                </div>

                <SectionCard title="Recent Activity">
                    <Table
                        dataSource={transactions}
                        rowKey="id"
                        pagination={false}
                        className="custom-table"
                        columns={[
                            {
                                title: "Type",
                                dataIndex: "type",
                                key: "type",
                                render: (type) => (
                                    <Tag color={type === "BUY" ? "success" : "volcano"} className="font-bold">
                                        {type}
                                    </Tag>
                                ),
                            },
                            {
                                title: "Asset",
                                dataIndex: "symbol",
                                key: "symbol",
                                render: (text) => <span className="font-semibold text-gray-900 dark:text-white">{text}</span>,
                            },
                            {
                                title: "Quantity",
                                dataIndex: "quantity",
                                key: "quantity",
                            },
                            {
                                title: "Price",
                                dataIndex: "price",
                                key: "price",
                                render: (val) => `$${val.toFixed(2)}`,
                            },
                            {
                                title: "Total Value",
                                dataIndex: "total",
                                key: "total",
                                align: "right",
                                render: (val) => (
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                ),
                            },
                            {
                                title: "Date",
                                dataIndex: "date",
                                key: "date",
                                align: "right",
                                className: "text-gray-500",
                            },
                        ]}
                    />
                </SectionCard>
            </motion.div>
        </LayoutContainer>
    );
}
