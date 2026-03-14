import { EditOutlined, LockOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import type { UserData } from "../../../http/types/user-data";
import { useListTechs } from "../../../http/use-list-techs";
import { z } from 'zod'
import { useCreateTech } from "../../../http/use-create-tech";
import { env } from "../../../env";
import { useUpdateUser } from '../../../http/use-update-user';
import { useUpdateTechAvailabilities } from "../../../http/use-update-tech-availabilities";
import { useModal } from "../../hooks/use-modal";
import { FormModal } from "../form-modal";
import { AddressField, AvailabilitiesField, ConfirmButton, EmailField, NameField, PasswordField, PhoneField } from "../form-modal-fields";
import { useUpdateUserPassword } from "../../../http/use-update-user-password";
import { UserInfoModal } from "../user-info-modal";

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
const updateTechPasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

type CreateTechFormData = z.infer<typeof createTechSchema>
type UpdateTechFormData = z.infer<typeof updateTechSchema>
type UpdateTechAvailabilitiesFormData = z.infer<typeof updateTechAvailabilitiesSchema>
type UpdateTechPasswordFormData = z.infer<typeof updateTechPasswordSchema>


export function AdminTechManager() {
  const { data: technicians } = useListTechs();
  const { mutateAsync: createTechnician, isPending: isCreationPending } = useCreateTech();
  const { mutateAsync: updateTechnician, isPending: isUpdatePending } = useUpdateUser();
  const { mutateAsync: updateAvailabilities, isPending: isUpdateAvPending } = useUpdateTechAvailabilities();
  const { mutateAsync: updatePassword, isPending: isUpdatePassPending } = useUpdateUserPassword();
  const [selectedTech, setSelectedTech] = useState<UserData | null>(null);

  const createTechModal = useModal();
  const editTechModal = useModal();
  const editTechAvailabilitiesModal = useModal();
  const editTechPasswordModal = useModal();
  const techInfoModal = useModal();

  const [createTechForm] = Form.useForm<CreateTechFormData>();
  const [editTechForm] = Form.useForm<UpdateTechFormData>();
  const [editTechPasswordForm] = Form.useForm<UpdateTechPasswordFormData>();
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
    createTechModal.closeModal()
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
    editTechModal.closeModal()
  }

  const handleUpdateTechAvailabilities = async ({
      newAvailabilities
    }: UpdateTechAvailabilitiesFormData) => {
      if (!selectedTech) return message.error("Nenhum Técnico foi selecionado!");
      await updateAvailabilities({techId: selectedTech.id, newAvailabilities});
  
      message.success("Disponibilidades alteradas com sucesso!");
      editTechAvailabilitiesForm.resetFields();
      editTechAvailabilitiesModal.closeModal()
  }

  const handleUpdateTechPassword = async ({
    currentPassword,
    newPassword
  }: UpdateTechPasswordFormData) => {
    if (!selectedTech) return message.error("Nenhum Técnico foi selecionado!");
    await updatePassword({
      userId: selectedTech.id,
      currentPassword,
      newPassword
    })

    message.success("Senha alterada com sucesso!");
    editTechPasswordForm.resetFields();
    editTechPasswordModal.closeModal()
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
            techInfoModal.openModal()
          }} 
          className='flex gap-2 !items-center !p-0 !border-0 !bg-transparent !shadow-none !h-auto'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${tech.picturePath}?t=${Date.now()}`}
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
              editTechModal.openModal()
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
              editTechAvailabilitiesModal.openModal()
            }}
          >
            Alterar Disponibilidades
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTech(tech)
              editTechPasswordModal.openModal()
            }}
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

  
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!m-0">Gerenciar Técnicos</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            createTechModal.openModal()
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
      <FormModal
        title="Criar Técnico"
        open={createTechModal.open}
        onCancel={() => {
          createTechModal.closeModal();
          createTechForm.resetFields();
        }}
        onFinish={handleCreateTechnician}
        form={createTechForm}
      >
        <NameField />
        <EmailField />
        <PasswordField />
        <PhoneField />
        <AddressField />
        <ConfirmButton loading={isCreationPending} />
      </FormModal>

      {/* EDITAR TÉCNICO */}
      <FormModal
        title="Editar Técnico"
        open={editTechModal.open}
        onCancel={() => {
          setSelectedTech(null)
          editTechModal.closeModal()
          editTechForm.resetFields();
        }}
        onFinish={handleUpdateTechnician}
        form={editTechForm}
      >
        <NameField name="newName" />
        <EmailField name="newEmail" />
        <PhoneField name="newPhone" />
        <AddressField name="newAddress" />
        <ConfirmButton loading={isUpdatePending} />
      </FormModal>

      {/* ATUALIZAÇÃO DE DISPONIBILIDADES DO TÉCNICO */}
      <FormModal
        title="Atualizar Disponibilidades"
        open={editTechAvailabilitiesModal.open}
        onCancel={() => {
          setSelectedTech(null)
          editTechAvailabilitiesModal.closeModal()
        }}
        onFinish={handleUpdateTechAvailabilities}
        form={editTechAvailabilitiesForm}
      >
        <AvailabilitiesField name="newAvailabilities" />
        <ConfirmButton loading={isUpdateAvPending} />
      </FormModal>

      {/* ATUALIZAÇÃO DE SENHA DO TÉCNICO */}
      <FormModal
        title="Atualizar Senha"
        open={editTechPasswordModal.open}
        onCancel={() => {
          setSelectedTech(null)
          editTechPasswordModal.closeModal()
        }}
        onFinish={handleUpdateTechPassword}
        form={editTechPasswordForm}
      >
        <PasswordField name="currentPassword" />
        <PasswordField name="newPassword" />
        <ConfirmButton loading={isUpdatePassPending} />
      </FormModal>

      <UserInfoModal 
        isUserInfoModalOpen={techInfoModal.open} 
        onCancel={() => techInfoModal.closeModal()}
        user={selectedTech}
        updatable
      />
    </>
  )
}