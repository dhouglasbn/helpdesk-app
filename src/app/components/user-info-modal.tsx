import { Avatar, Descriptions, Divider, Modal, Space, Tag, Typography } from "antd";
import { env } from "../../env";
import type { UserData } from "../../http/types/user-data";
import { AvatarUploader } from "./avatar-uploader";

const { Title, Text } = Typography;

interface UserInfoModalProps {
  isUserInfoModalOpen: boolean
  onCancel: () => void
  user: UserData | null,
  updatable?: boolean,
  loading?: boolean
}


export function UserInfoModal({
  isUserInfoModalOpen,
  onCancel,
  user,
  updatable,
  loading,
}: UserInfoModalProps) {
  if (!user) return null;

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }

  return (
    <Modal
      title={`Informações do usuário`}
      open={isUserInfoModalOpen}
      onCancel={onCancel}
      footer={null}
      loading={loading}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        
        {/* Header */}
        <div className="flex flex-col items-center">
          {
            updatable ? <AvatarUploader user={user}/> :
            <Avatar
              size={180}
              src={`${env.VITE_API_URL}${user.picturePath}?t=${Date.now()}`}
            />
          }
          <Title level={4} style={{ marginTop: 12 }}>
            {user.name}
          </Title>
        </div>

        <Divider size="small" />

        {/* Informações */}
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Email">
            <Text strong>{user.email}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Telefone">
            <Text strong>{showPhoneNumber(user.phone)}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Endereço">
            <Text strong>{user.address}</Text>
          </Descriptions.Item>

          {user.role === "tech" && (
            <Descriptions.Item label="Disponibilidades">
              <Space wrap>
                {user.availabilities?.map((availability) => (
                  <Tag color="green" key={availability}>
                    {availability}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>

      </Space>
    </Modal>
  )
}