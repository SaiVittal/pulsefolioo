
import { useLogin } from "../hooks/useLogin";
import { Button, Form, Input, Card, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import useForm from "antd/es/form/hooks/useForm";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form] = useForm<FormValues>();
  const mutation = useLogin();
  const navigate = useNavigate();

  function onFinish(values: FormValues) {
    console.log("Submitting login form", values);
    mutation.mutate(values);
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      navigate("/", { replace: true });
    }
  }, [mutation.isSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md w-full p-6 shadow-md">
        <Typography.Title level={3} className="text-center mb-6">
          Login to Pulsefolio
        </Typography.Title>

<Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="Email" required>
            <Input
              placeholder="you@example.com"
            />
          </Form.Item>

          <Form.Item name="password" label="Password" required>
            <Input.Password
              placeholder="••••••••"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            loading={mutation.isPending}
            className="w-full"
          >
            Login
          </Button>

          {mutation.isError && (
            <div className="text-red-600 text-sm mt-2">
              {(mutation.error as Error).message ?? "Login failed"}
            </div>
          )}

          {/* REGISTER LINK */}
          <div className="text-center mt-4">
            <span className="text-gray-500">Don’t have an account? </span>
            <Link to="/register" className="text-blue-600 hover:underline">
              Create Account
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
