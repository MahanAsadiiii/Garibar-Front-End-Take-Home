import { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import {
  useCreateCargoOrder,
  useUpdateCargoOrder,
} from "../hooks/useCargoOrders";
import {
  CARGO_ORDER_STATUS_OPTIONS,
  DEFAULT_CARGO_ORDER_STATUS,
  type CargoOrder,
  type CreateCargoOrderPayload,
} from "../types/cargo";

type Props = {
  open: boolean;
  order: CargoOrder | null; // null = create, otherwise edit
  onClose: () => void;
};

const CargoOrderFormModal = ({ open, order, onClose }: Props) => {
  const [form] = Form.useForm<CreateCargoOrderPayload>();
  const createOrder = useCreateCargoOrder();
  const updateOrder = useUpdateCargoOrder();
  const isEdit = order !== null;
  const isPending = createOrder.isPending || updateOrder.isPending;

  // Prefill on edit; reset defaults on create
  useEffect(() => {
    if (!open) return;

    if (order) {
      form.setFieldsValue({
        goods_name: order.goods_name,
        origin_city: order.origin_city,
        destination_city: order.destination_city,
        weight_ton: order.weight_ton,
        price_rial: order.price_rial,
        status: order.status,
        description: order.description,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: DEFAULT_CARGO_ORDER_STATUS });
    }
  }, [open, order, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: CreateCargoOrderPayload = {
        ...values,
        description: values.description?.trim() || undefined,
      };

      if (isEdit) {
        await updateOrder.mutateAsync({ id: order.id, payload });
        message.success("Cargo order updated");
      } else {
        await createOrder.mutateAsync(payload);
        message.success("Cargo order created");
      }

      onClose();
    } catch (err) {
      // Form validation errors are shown inline; only toast API failures
      if (err && typeof err === "object" && "errorFields" in err) return;
      message.error(err instanceof Error ? err.message : "Request failed");
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit cargo order" : "Add cargo order"}
      open={open}
      onCancel={onClose}
      onOk={() => void handleOk()}
      okText={isEdit ? "Save" : "Create"}
      confirmLoading={isPending}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="goods_name"
          label="Goods name"
          rules={[{ required: true, message: "Goods name is required" }]}
        >
          <Input placeholder="e.g. Steel coils" />
        </Form.Item>

        <Form.Item
          name="origin_city"
          label="Origin city"
          rules={[{ required: true, message: "Origin city is required" }]}
        >
          <Input placeholder="e.g. Tehran" />
        </Form.Item>

        <Form.Item
          name="destination_city"
          label="Destination city"
          rules={[{ required: true, message: "Destination city is required" }]}
        >
          <Input placeholder="e.g. Isfahan" />
        </Form.Item>

        <Form.Item
          name="weight_ton"
          label="Weight (ton)"
          rules={[
            { required: true, message: "Weight is required" },
            {
              type: "number",
              min: 0.01,
              message: "Weight must be greater than 0",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0.01} step={0.1} />
        </Form.Item>

        <Form.Item
          name="price_rial"
          label="Price (rial)"
          rules={[
            { required: true, message: "Price is required" },
            {
              type: "number",
              min: 1,
              message: "Price must be greater than 0",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={1} step={1000} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Status is required" }]}
        >
          <Select options={CARGO_ORDER_STATUS_OPTIONS} />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Optional" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CargoOrderFormModal;
