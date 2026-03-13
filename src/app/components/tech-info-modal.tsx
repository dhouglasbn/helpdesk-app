import { Avatar, Descriptions, Divider, Modal, Space, Tag, Typography } from "antd";
import { env } from "../../env";
import type { UserData } from "../../http/types/userData";

const { Title, Text } = Typography;

interface TechInfoModalProps {
  isTechInfoModalOpen: boolean
  onCancel: () => void
  tech: UserData | null
}


export function TechInfoModal({
  isTechInfoModalOpen,
  onCancel,
  tech
}: TechInfoModalProps) {
  if (!tech) return null;

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }

  return (
    <Modal
  title={`Informações do técnico`}
  open={isTechInfoModalOpen}
  onCancel={onCancel}
  footer={null}
>
  <Space direction="vertical" size="large" style={{ width: "100%" }}>
    
    {/* Header */}
    <div className="flex flex-col items-center">
      <Avatar
        size={180}
        src={`${env.VITE_API_URL}${tech.picturePath}`}
      />
      <Title level={4} style={{ marginTop: 12 }}>
        {tech.name}
      </Title>
    </div>

    <Divider size="small" />

    {/* Informações */}
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Email">
        <Text strong>{tech.email}</Text>
      </Descriptions.Item>

      <Descriptions.Item label="Telefone">
        <Text strong>{showPhoneNumber(tech.phone)}</Text>
      </Descriptions.Item>

      <Descriptions.Item label="Endereço">
        <Text strong>{tech.address}</Text>
      </Descriptions.Item>

      <Descriptions.Item label="Disponibilidades">
        <Space wrap>
          {tech.availabilities?.map((availability) => (
            <Tag color="green" key={availability}>
              {availability}
            </Tag>
          ))}
        </Space>
      </Descriptions.Item>
    </Descriptions>

  </Space>
</Modal>
  )
}