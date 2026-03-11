import { useState } from "react";
import { Button, Modal, Card, Descriptions, Popconfirm, Typography, Form, Input, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { UserData } from '../../http/types/userData';

const { Title } = Typography;

interface UserProfileProps {
  user: UserData | null
}


export function UserProfile({user}: UserProfileProps) {
  const [profileForm] = Form.useForm();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const handleUpdateProfile = (values: any) => {
    message.success('Perfil atualizado com sucesso!');
    setIsEditProfileModalOpen(false);
  };

  const handleDeleteAccount = () => {
  };

  const getRoleLabel = (role?: string) => {
    switch(role) {
      case "admin":
        return "Administrador";
      case "tech":
        return "Técnico"
      case "client":
        return "Cliente"
    }
  }

  return (
    <>
      <Title level={2} className="mb-6">Meu Perfil</Title>
                
      <Card>
        <Descriptions title="Informações Pessoais" bordered column={1}>
          <Descriptions.Item label="Nome">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Telefone">{user?.phone || 'Não informado'}</Descriptions.Item>
          <Descriptions.Item label="Endereço">{user?.address || 'Não informado'}</Descriptions.Item>
          <Descriptions.Item label="Função">{getRoleLabel(user?.role)}</Descriptions.Item>
          {user?.availabilities && (
            <Descriptions.Item label="Disponibilidades">
              {`[${user.availabilities}]`}
            </Descriptions.Item>
          )}
        </Descriptions>
                  
        <div className="mt-6 flex gap-4">
          <Button 
            type="primary" 
            onClick={() => {
              profileForm.setFieldsValue(user);
              setIsEditProfileModalOpen(true);
            }}
          >
            Editar Perfil
          </Button>
          {user?.role === 'client' && (
            <Popconfirm
              title="Excluir Conta"
              description="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
              onConfirm={handleDeleteAccount}
              okText="Sim, excluir"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Excluir Conta
              </Button>
            </Popconfirm>
          )}
        </div>
      </Card>

      <Modal
        title="Editar Perfil"
        open={isEditProfileModalOpen}
        onCancel={() => setIsEditProfileModalOpen(false)}
        footer={null}
      >
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Por favor, insira seu telefone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Endereço"
            rules={[{ required: true, message: 'Por favor, insira seu endereço' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Button type="primary" htmlType="submit" block>
              Salvar Alterações
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}