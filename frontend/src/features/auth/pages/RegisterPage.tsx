import AuthLayout from "../../../layouts/AuthLayout";
import { Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRegister } from "../hooks/useRegister";
import AppButton from "../../../components/ui/AppButton";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const mutation = useRegister();
  const navigate = useNavigate();

  function onFinish(values: { email: string; password: string }) {
    mutation.mutate(values, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  }

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <Typography.Title level={3}>Create Account</Typography.Title>
        <p className="text-[--colorTextSecondary]">
          Start managing your portfolio
        </p>
      </div>

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
            placeholder="••••••"
            size="large"
          />
        </Form.Item>

        <AppButton
          kind="primary"
          htmlType="submit"
          block
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Register"}
        </AppButton>
      </Form>
    </AuthLayout>
  );
}
