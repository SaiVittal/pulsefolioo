import { Modal, Form, Input, message } from "antd";
import { z } from "zod";
import { useCreatePortfolio } from "../hooks/useCreatePortfolio";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

interface CreatePortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePortfolioModal({
  open,
  onClose,
}: CreatePortfolioModalProps) {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useCreatePortfolio();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const parsed = schema.parse(values);

      await mutateAsync({ name: parsed.name });
      message.success("Portfolio created");
      form.resetFields();
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        message.error(err.message ?? "Validation failed");
      }
    }
  };

  return (
    <Modal
      title="Create Portfolio"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={isPending}
      okText="Create"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Portfolio Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="e.g., Long-Term Equity" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
