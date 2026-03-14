import { EditOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import type { UserData } from "../../../http/types/userData";
import { useListTechs } from "../../../http/use-list-techs";
import { z } from 'zod'
import { useCreateTech } from "../../../http/use-create-tech";
import { env } from "../../../env";
import { TechInfoModal } from "../tech-info-modal";
import { useUpdateUser } from '../../../http/use-update-user';
import { useUpdateTechAvailabilities } from "../../../http/use-update-tech-availabilities";

const { Title } = Typography;
const { Option } = Select

const createTechSchema = z.object({
	name: z.string().min(3),
	email: z.email(),
	password: z.string().min(6),
	phone: z.string().length(11),
	address: z.string().min(5),
})
const updateTechSchema = z.object({
	newName: z.string().min(3),
	newEmail: z.email(),
	newPhone: z.string().length(11),
	newAddress: z.string().min(5),
})
const updateTechAvailabilitiesSchema = z.object({
  newAvailabilities: z.array(z.string())
})

type CreateTechFormData = z.infer<typeof createTechSchema>
type UpdateTechFormData = z.infer<typeof updateTechSchema>
type UpdateTechAvailabilitiesFormData = z.infer<typeof updateTechAvailabilitiesSchema>


export function AdminTechManager() {
  const { data: technicians } = useListTechs();
  const { mutateAsync: createTechnician, isPending: isCreationPending } = useCreateTech();
  const { mutateAsync: updateTechnician, isPending: isUpdatePending } = useUpdateUser();
  const { mutateAsync: updateAvailabilities, isPending: isUpdateAvPending } = useUpdateTechAvailabilities();
  const [isCreateTechModalOpen, setIsCreateTechModalOpen] = useState(false);
  const [isEditTechModalOpen, setIsEditTechModalOpen] = useState(false);
  const [isEditTechAvModalOpen, setIsEditTechAvModalOpen] = useState(false);
  const [isTechInfoModalOpen, setIsTechInfoModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<UserData | null>(null);
  const [createTechForm] = Form.useForm<CreateTechFormData>();
  const [editTechForm] = Form.useForm<UpdateTechFormData>();
  const [editTechPasswordForm] = Form.useForm<CreateTechFormData>();
  const [editTechAvailabilitiesForm] = Form.useForm<UpdateTechAvailabilitiesFormData>();


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
    setSelectedTech(null)
    setIsCreateTechModalOpen(false);
  };

  const handleUpdateTechnician = async ({
    newName,
    newEmail,
    newPhone,
    newAddress,
  }: UpdateTechFormData) => {
    if (!selectedTech) return message.error("Nenhum Técnico foi selecionado para edição!")
    await updateTechnician({
      userId: selectedTech.id,
      role: selectedTech.role,
      newName,
      newEmail,
      newPhone,
      newAddress,
    })

    message.success("Conta de Técnico atualizada!")
    editTechForm.resetFields();
    setSelectedTech(null)
    setIsEditTechModalOpen(false);
  }

  const handleUpdateTechAvailabilities = async ({
      newAvailabilities
    }: UpdateTechAvailabilitiesFormData) => {
      if (!selectedTech) return message.error("Nenhum Técnico foi selecionado!");
      await updateAvailabilities({techId: selectedTech.id, newAvailabilities});
  
      message.success("Disponibilidades alteradas com sucesso!");
      editTechAvailabilitiesForm.resetFields();
      setIsEditTechAvModalOpen(false);
    }

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
      render: (_: any, tech: UserData) => (
        <Space className="flex flex-col items-center">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTech(tech)
              editTechForm.setFieldsValue({
                newName: tech.name,
                newEmail: tech.email,
                newPhone: tech.phone,
                newAddress: tech.address,
              });
              setIsEditTechModalOpen(true);
            }}
          >
            Editar
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTech(tech)
              editTechAvailabilitiesForm.setFieldsValue({
                newAvailabilities: tech.availabilities,
              });
              setIsEditTechAvModalOpen(true);
            }}
          >
            Alterar Disponibilidades
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {}}
          >
            Alterar Senha
          </Button>
        </Space>
      ),
    },
  ];

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }

  const availabilities = () => Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, "0")}:00`
  );
  
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

      {/* CRIAR TÉCNICO */}
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
            <Button loading={isCreationPending} type="primary" htmlType="submit" block>
              Confirmar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDITAR TÉCNICO */}
      <Modal
        title='Editar Técnico'
        open={isEditTechModalOpen}
        onCancel={() => {
          setSelectedTech(null)
          setIsEditTechModalOpen(false);
          editTechForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={editTechForm}
          layout="vertical"
          onFinish={handleUpdateTechnician}
        >
          <Form.Item
            name="newName"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="newEmail"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="newPhone"
            label="Telefone"
            rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="newAddress"
            label="Endereço"
            rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button loading={isUpdatePending} type="primary" htmlType="submit" block>
              Confirmar
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ATUALIZAÇÃO DE DISPONIBILIDADES DO TÉCNICO */}
      
      <Modal
        title="Atualizar Disponibilidades"
        open={isEditTechAvModalOpen}
        onCancel={() => {
          setSelectedTech(null)
          setIsEditTechAvModalOpen(false)
        }}
        footer={null}
      >
        <Form
          form={editTechAvailabilitiesForm}
          layout="vertical"
          onFinish={handleUpdateTechAvailabilities}
        >
          <Form.Item
            name="newAvailabilities"
            label="Disponibilidades"
            rules={[
              { required: true, message: 'Por favor, insira ao menos um horário' },
            ]}
            
          >
            <Select
              mode="multiple"
              placeholder="Selecione as disponibilidades"
              optionFilterProp="children"
            >
              {availabilities().map(availability => (
                <Option key={availability} value={availability}>
                  {availability}
                </Option>
              ))}
            </Select>
          </Form.Item>
      
          <Form.Item className="!mb-0">
            <Button loading={isUpdateAvPending} type="primary" htmlType="submit" block>
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