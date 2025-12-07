import AuthLayout from "../../../layouts/AuthLayout";
import { Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "../hooks/useLogin";
import AppButton from "../../../components/ui/AppButton";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const mutation = useLogin();
  const navigate = useNavigate();

  function onFinish(values: { email: string; password: string }) {
    mutation.mutate(values);
  }

  useEffect(() => {
    if (mutation.isSuccess) navigate("/", { replace: true });
  }, [mutation.isSuccess]);

  return (
    <AuthLayout>
      <Typography.Title level={3} className="text-center mb-4">
        Login to Pulsefolio
      </Typography.Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input
            prefix={<MailOutlined />}
            placeholder="you@example.com"
            size="large"
          />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="•••••••"
            size="large"
          />
        </Form.Item>

        <AppButton kind="primary" block htmlType="submit" disabled={mutation.isPending}>
          Login
        </AppButton>

        {mutation.isError && (
          <p className="text-red-500 mt-2 text-center">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="text-center mt-4">
          <span className="text-[--colorTextSecondary]">
            Don’t have an account?
          </span>{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create Account
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
}
