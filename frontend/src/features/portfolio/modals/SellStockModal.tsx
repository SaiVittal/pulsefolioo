import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { z } from "zod";
import { useSellTransaction } from "../hooks/useBuySell";
import { useHoldings } from "../hooks/useHoldings";

const schema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  holdingId: z.string().optional().nullable(),
});

interface SellStockModalProps {
  open: boolean;
  portfolioId: string | null;
  onClose: () => void;
}

export default function SellStockModal({
  open,
  portfolioId,
  onClose,
}: SellStockModalProps) {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useSellTransaction();

  const { data: holdings = [] } = useHoldings(portfolioId);

  const handleOk = async () => {
    if (!portfolioId) {
      message.error("Please select a portfolio first");
      return;
    }

    try {
      const values = await form.validateFields();
      const parsed = schema.parse({
        ...values,
        quantity: Number(values.quantity),
        price: Number(values.price),
      });

      await mutateAsync({
        portfolioId,
        holdingId: parsed.holdingId || null,
        symbol: parsed.symbol,
        quantity: parsed.quantity,
        price: parsed.price,
        timestamp: new Date().toISOString(),
      });

      message.success("Sell order placed");
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
      title="Sell Stock"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Sell"
      confirmLoading={isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Symbol" name="symbol" rules={[{ required: true }]}>
          <Input placeholder="e.g., AAPL" />
        </Form.Item>

        <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
          <InputNumber min={0.0001} step={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Holding" name="holdingId">
          <Select
            allowClear
            placeholder="Select holding to sell from"
            options={holdings.map((h) => ({
              label: `${h.symbol} · ${h.quantity} @ ${h.averagePrice}`,
              value: h.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
