import { Switch, Typography, Form, Input, Button, Row, Col, Divider, Avatar } from "antd";
import { UserOutlined, BellOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import LayoutContainer from "../../../components/ui/LayoutContainer";
import SectionCard from "../../../components/ui/SectionCard";

const { Title } = Typography;

export default function SettingsPage() {
    return (
        <LayoutContainer>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <Title level={2} className="!text-gray-900 dark:!text-white !m-0">
                        Settings
                    </Title>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage your account preferences and application settings.
                    </p>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <div className="space-y-6">
                            <SectionCard title="Profile Information">
                                <div className="flex items-center gap-6 mb-8">
                                    <Avatar size={80} icon={<UserOutlined />} className="bg-gradient-to-tr from-blue-500 to-purple-600" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h3>
                                        <p className="text-gray-500">Premium Member</p>
                                        <Button type="link" className="p-0 h-auto">Change Avatar</Button>
                                    </div>
                                </div>

                                <Form layout="vertical" initialValues={{ name: "John Doe", email: "john@example.com" }}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Full Name" name="name">
                                                <Input className="dark:bg-white/5 dark:text-white" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Email" name="email">
                                                <Input className="dark:bg-white/5 dark:text-white" disabled />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Button type="primary" className="bg-blue-600">Save Changes</Button>
                                </Form>
                            </SectionCard>

                            <SectionCard title="Security">
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <SafetyCertificateOutlined className="text-xl text-green-500" />
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</div>
                                            <div className="text-sm text-gray-500">Add an extra layer of security to your account.</div>
                                        </div>
                                    </div>
                                    <Switch />
                                </div>
                                <Divider className="my-4 opacity-10" />
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold text-gray-900 dark:text-white">Change Password</div>
                                    </div>
                                    <Button>Update</Button>
                                </div>
                            </SectionCard>
                        </div>
                    </Col>

                    <Col xs={24} md={8}>
                        <SectionCard title="Preferences">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Appearance</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-900 dark:text-white">Dark Mode</span>
                                        <Switch defaultChecked />
                                    </div>
                                </div>

                                <Divider className="my-0 opacity-10" />

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Notifications</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BellOutlined className="text-gray-400" />
                                                <span className="text-gray-900 dark:text-white">Market Alerts</span>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BellOutlined className="text-gray-400" />
                                                <span className="text-gray-900 dark:text-white">Portfolio Updates</span>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </Col>
                </Row>
            </motion.div>
        </LayoutContainer>
    );
}
