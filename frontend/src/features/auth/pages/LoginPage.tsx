import AuthLayout from "../../../layouts/AuthLayout";
import { Form, Input, ConfigProvider, theme } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "../hooks/useLogin";
import AppButton from "../../../components/ui/AppButton";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const mutation = useLogin();
  const navigate = useNavigate();

  function onFinish(values: { email: string; password: string }) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (mutation.isSuccess) navigate("/", { replace: true });
  }, [mutation.isSuccess]);

  // Force dark theme for the login card components to match the dark layout
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-semibold text-white tracking-tight">
            Welcome Back
          </h3>
          <p className="text-gray-400 mt-2 text-sm">
            Enter your credentials to access your workspace.
          </p>
        </motion.div>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Form.Item
              name="email"
              label={<span className="text-gray-300">Email Address</span>}
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-500" />}
                placeholder="name@company.com"
                className="!bg-white/5 !border-white/10 !text-white hover:!border-blue-500 focus:!border-blue-500 placeholder:!text-gray-600 rounded-xl py-3"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Form.Item
              name="password"
              label={<span className="text-gray-300">Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-500" />}
                placeholder="••••••••"
                className="!bg-white/5 !border-white/10 !text-white hover:!border-blue-500 focus:!border-blue-500 placeholder:!text-gray-600 rounded-xl py-3"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <AppButton
              kind="primary"
              block
              htmlType="submit"
              disabled={mutation.isPending}
              className="!h-12 !rounded-xl !bg-gradient-to-r !from-blue-600 !to-blue-500 hover:!from-blue-500 hover:!to-blue-400 !border-0 !text-base !font-medium"
            >
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </AppButton>
          </motion.div>

          {mutation.isError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-4 text-center text-sm bg-red-500/10 py-2 rounded-lg"
            >
              {(mutation.error as Error).message}
            </motion.p>
          )}

          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm">
              Don’t have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
            >
              Create Account
            </Link>
          </div>
        </Form>
      </AuthLayout>
    </ConfigProvider>
  );
}
