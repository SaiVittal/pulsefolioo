import { useEffect, useState } from "react";
import { getWatchlists, createWatchlist, deleteWatchlist, addWatchlistItem, removeWatchlistItem } from "../services/watchlistApi";
import { Watchlist } from "../types";
import { Button, Input, List, Typography, Modal, Row, Col, Empty } from "antd";
import { PlusOutlined, DeleteOutlined, StarFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import SectionCard from "../../../components/ui/SectionCard";

const { Title } = Typography;

export default function WatchlistPage() {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState("");

    const fetchWatchlists = async () => {
        try {
            const data = await getWatchlists();
            setWatchlists(data);
        } catch (error) {
            console.error("Failed to fetch watchlists", error);
        }
    };

    useEffect(() => {
        fetchWatchlists();
    }, []);

    const handleCreateWatchlist = async () => {
        if (!newWatchlistName) return;
        try {
            await createWatchlist({ name: newWatchlistName });
            setNewWatchlistName("");
            setIsModalOpen(false);
            fetchWatchlists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteWatchlist = async (id: string) => {
        try {
            await deleteWatchlist(id);
            fetchWatchlists();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveItem = async (watchlistId: string, itemId: string) => {
        try {
            await removeWatchlistItem(watchlistId, itemId);
            fetchWatchlists();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <LayoutContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <Title level={2} className="!text-gray-900 dark:!text-white !m-0">
                            Watchlists
                        </Title>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Track your favorite assets.
                        </p>
                    </div>
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                        New Watchlist
                    </Button>
                </div>

                {watchlists.length === 0 && (
                    <div className="py-12 glass-panel rounded-2xl flex justify-center">
                        <Empty description={<span className="text-gray-400">No watchlists yet. Create one to get started.</span>} />
                    </div>
                )}

                <Row gutter={[24, 24]}>
                    {watchlists.map((wl) => (
                        <Col xs={24} md={12} xl={8} key={wl.id}>
                            <SectionCard
                                title={wl.name}
                                action={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteWatchlist(wl.id)}
                                    />
                                }
                            >
                                <div className="min-h-[200px] flex flex-col justify-between">
                                    <List
                                        dataSource={wl.items}
                                        split={false}
                                        renderItem={(item) => (
                                            <List.Item
                                                className="!px-0 !py-2 hover:bg-white/5 rounded-lg transition-colors px-2 cursor-pointer group"
                                                actions={[
                                                    <DeleteOutlined
                                                        key="delete"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveItem(wl.id, item.id); }}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    />
                                                ]}
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                                        <StarFilled />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">{item.symbol}</div>
                                                        <div className="text-xs text-gray-500">{item.exchange}</div>
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                    />

                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                        <Input
                                            prefix={<PlusOutlined className="text-gray-400" />}
                                            placeholder="Add Symbol (e.g. TSLA)"
                                            className="!bg-transparent !border-gray-200 dark:!border-gray-700 !text-gray-900 dark:!text-white hover:!border-blue-500 focus:!border-blue-500"
                                            onPressEnter={(e) => {
                                                const val = e.currentTarget.value;
                                                if (val) {
                                                    addWatchlistItem(wl.id, { symbol: val.toUpperCase(), exchange: "NSE" }).then(() => {
                                                        e.currentTarget.value = "";
                                                        fetchWatchlists();
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </SectionCard>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title="Create New Watchlist"
                    open={isModalOpen}
                    onOk={handleCreateWatchlist}
                    onCancel={() => setIsModalOpen(false)}
                    okButtonProps={{ className: "bg-blue-600" }}
                >
                    <div className="pt-4">
                        <Input
                            size="large"
                            placeholder="Enter watchlist name..."
                            value={newWatchlistName}
                            onChange={(e) => setNewWatchlistName(e.target.value)}
                        />
                    </div>
                </Modal>
            </motion.div>
        </LayoutContainer>
    );
}
