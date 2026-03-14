import { Modal, Form } from "antd";
import type { FormInstance } from "antd";
import type { ReactNode } from "react";

type FormModalProps<T> = {
  title: string;
  open: boolean;
  form: FormInstance<T>;
  onCancel: () => void;
  onFinish: (values: T) => void;
  children: ReactNode;
};

export function FormModal<T>({
  title,
  open,
  form,
  onCancel,
  onFinish,
  children
}: FormModalProps<T>) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form<T>
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {children}
      </Form>
    </Modal>
  );
}