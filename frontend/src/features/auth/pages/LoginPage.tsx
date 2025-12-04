// src/features/auth/pages/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Input, Card, Typography } from "antd";

type FormValues = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const mutation = useLogin();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { username: "", password: "" },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      // redirect after successful login
      navigate("/", { replace: true });
    }
  }, [mutation.isSuccess, navigate]);

  async function onSubmit(values: FormValues) {
    mutation.mutate(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <Typography.Title level={3} className="text-center">
          Sign in to Pulsefolio
        </Typography.Title>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Form.Item label="Username" required>
            <Input {...register("username", { required: true })} />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input.Password {...register("password", { required: true })} />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={mutation.isPending}>
              Sign in
            </Button>
          </div>

          {mutation.isError && (
            <div className="text-red-600 mt-2">
              {(mutation.error as Error).message ?? "Login failed"}
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
