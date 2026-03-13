import { EditOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, Modal, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import type { UserData } from "../../../http/types/userData";
import { useListTechs } from "../../../http/use-list-techs";
import { z } from 'zod'
import { useCreateTech } from "../../../http/use-create-tech";
import { env } from "../../../env";
import { TechInfoModal } from "../tech-info-modal";

const { Title } = Typography;

const createTechSchema = z.object({
	name: z.string().min(3),
	email: z.email(),
	password: z.string().min(6),
	phone: z.string().length(11),
	address: z.string().min(5),
})

type CreateTechFormData = z.infer<typeof createTechSchema>

export function AdminTechManager() {
  const { data: technicians } = useListTechs();
  const { mutateAsync: createTechnician } = useCreateTech();
  const [isCreateTechModalOpen, setIsCreateTechModalOpen] = useState(false);
  const [isTechInfoModalOpen, setIsTechInfoModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<UserData | null>(null);
  const [createTechForm] = Form.useForm<CreateTechFormData>();


  const handleCreateTechnician = async ({
    name,
    email,
    password,
    phone,
    address
  }: CreateTechFormData) => {
    await createTechnician({
      name,
      email,
      password,
      phone,
      address
    });
    
    message.success("Conta de Técnico criada!")
    createTechForm.resetFields();
    setIsCreateTechModalOpen(false);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, tech: UserData) => <Button
          onClick={() => {
            const techInfo = technicians?.find(t => t.id === tech.id);
            if(!techInfo) return;
            setSelectedTech(techInfo)
            setIsTechInfoModalOpen(true);
          }} 
          className='flex gap-2 !items-center !p-0 !border-0 !bg-transparent !shadow-none !h-auto'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${tech.picturePath}`}
          />
          <span className='font-medium p-2'>{tech.name}</span>
        </Button>
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => showPhoneNumber(phone)
     },
    { title: 'Endereço', dataIndex: 'address', key: 'address'},
    {
      title: 'Disponibilidades',
      dataIndex: 'availabilities',
      key: 'availabilities',
      render: (availabilities: string[]) => availabilities?.map((availability) => (
        <Tag color="green" key={availability}>
          {availability}
        </Tag>
      ))
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: UserData) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              createTechForm.setFieldsValue(record);
              setIsCreateTechModalOpen(true);
            }}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!m-0">Gerenciar Técnicos</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setIsCreateTechModalOpen(true);
          }}
          size="large"
        >
          Criar Técnico
        </Button>
      </div>
                
      <Table 
        columns={columns} 
        dataSource={technicians} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* EDITAR TÉCNICO */}
      <Modal
        title='Criar Técnico'
        open={isCreateTechModalOpen}
        onCancel={() => {
          setIsCreateTechModalOpen(false);
          createTechForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={createTechForm}
          layout="vertical"
          onFinish={handleCreateTechnician}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { required: true, message: 'Por favor, insira a senha a ser repassada ao técnico' },
              { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
            ]}
            
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mínimo 6 caracteres"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Endereço"
            rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block>
              Confirmar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <TechInfoModal 
        isTechInfoModalOpen={isTechInfoModalOpen} 
        onCancel={() => setIsTechInfoModalOpen(false)}
        tech={selectedTech}
      />
    </>
  )
}