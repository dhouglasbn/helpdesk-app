import { Avatar, Descriptions, Divider, Modal, Space, Typography } from "antd";
import { env } from "../../env";
import type { UserInTicketData } from '../../http/types/ticket-data'

const { Title, Text } = Typography;

interface ClientInfoModalProps {
  isClientInfoModalOpen: boolean
  onCancel: () => void
  client?: UserInTicketData
}


export function ClientInfoModal({
  isClientInfoModalOpen,
  onCancel,
  client
}: ClientInfoModalProps) {
  if (!client) return null;

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }

  return (
    <Modal
      title={`Informações do Cliente`}
      open={isClientInfoModalOpen}
      onCancel={onCancel}
      footer={null}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        
        {/* Header */}
        <div className="flex flex-col items-center">
          <Avatar
            size={180}
            src={`${env.VITE_API_URL}${client.picturePath}`}
          />
          <Title level={4} style={{ marginTop: 12 }}>
            {client.name}
          </Title>
        </div>

        <Divider size="small" />

        {/* Informações */}
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Email">
            <Text strong>{client.email}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Telefone">
            <Text strong>{showPhoneNumber(client.phone)}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Endereço">
            <Text strong>{client.address}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Modal>
  )
}