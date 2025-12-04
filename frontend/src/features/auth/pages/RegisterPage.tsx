import { useRegister } from "../hooks/useRegister";
import { Button, Input, Card, Typography, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const mutation = useRegister();

  const [form] = useForm<FormValues>();

function onFinish(values: FormValues) {
  console.log("Submitting register form", values);
  mutation.mutate(values, {
    onSuccess: () => navigate("/login", { replace: true }),
  });
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <Typography.Title level={3}>Create Account</Typography.Title>

<Form form={form} onFinish={onFinish} layout="vertical">
  <Form.Item name="email" label="Email" rules={[{ required: true }]}>
    <Input />
  </Form.Item>

  <Form.Item name="password" label="Password" rules={[{ required: true }]}>
    <Input.Password />
  </Form.Item>

  <Button type="primary" htmlType="submit" loading={mutation.isPending} className="w-full">
    Register
  </Button>

  {mutation.isError && (
    <p className="text-red-600">{(mutation.error as any).message}</p>
  )}
</Form>
      </Card>
    </div>
  );
}
