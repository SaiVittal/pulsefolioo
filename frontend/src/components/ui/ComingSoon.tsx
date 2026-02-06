import { Typography, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface ComingSoonProps {
    title?: string;
    description?: string;
    showIcon?: boolean;
}

export default function ComingSoon({
    title = "Coming Soon",
    description = "This feature is under development and will be available soon.",
    showIcon = true,
}: ComingSoonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700"
        >
            {showIcon && (
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mb-6"
                >
                    <ClockCircleOutlined className="text-6xl text-blue-500 dark:text-blue-400" />
                </motion.div>
            )}

            <Title level={3} className="!text-gray-900 dark:!text-white !mt-0 !mb-3">
                {title}
            </Title>

            <Text className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                {description}
            </Text>

            <div className="flex gap-3">
                <Button
                    type="primary"
                    disabled
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                    Notify Me
                </Button>
                <Button type="default">
                    Learn More
                </Button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>In Development</span>
            </div>
        </motion.div>
    );
}
