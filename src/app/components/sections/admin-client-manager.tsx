import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, message, Popconfirm, Space, Table, Typography } from "antd";
import { useState } from "react";
import type { UserData } from "../../../http/types/user-data";
import { useListClients } from "../../../http/use-list-clients";
import { z } from 'zod'
import { env } from "../../../env";
import { useUpdateUser } from '../../../http/use-update-user';
import { useModal } from "../../hooks/use-modal";
import { FormModal } from "../form-modal";
import { AddressField, ConfirmButton, EmailField, NameField, PasswordField, PhoneField } from "../form-modal-fields";
import { useUpdateUserPassword } from "../../../http/use-update-user-password";
import { UserInfoModal } from "../user-info-modal";
import { useDeleteClient } from '../../../http/use-delete-client'

const { Title } = Typography;

const updateClientSchema = z.object({
	newName: z.string().min(3),
	newEmail: z.email(),
	newPhone: z.string().length(11),
	newAddress: z.string().min(5),
})
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

type UpdateClientFormData = z.infer<typeof updateClientSchema>
type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>


export function AdminClientManager() {
  const { data: clients } = useListClients();
  const { mutateAsync: updateClient, isPending: isUpdatePending } = useUpdateUser();
  const { mutateAsync: updatePassword, isPending: isUpdatePassPending } = useUpdateUserPassword();
  const { mutateAsync: deleteClient, isPending: isDeletionPending } = useDeleteClient();
  const [selectedClient, setSelectedClient] = useState<UserData | null>(null);

  const editClientModal = useModal();
  const editClientPasswordModal = useModal();
  const clientInfoModal = useModal();

  const [editClientForm] = Form.useForm<UpdateClientFormData>();
  const [editClientPasswordForm] = Form.useForm<UpdatePasswordFormData>();
  
  const handleUpdateClient = async ({
    newName,
    newEmail,
    newPhone,
    newAddress,
  }: UpdateClientFormData) => {
    if (!selectedClient) return message.error("Nenhum Cliente foi selecionado para edição!")
    await updateClient({
      userId: selectedClient.id,
      role: selectedClient.role,
      newName,
      newEmail,
      newPhone,
      newAddress,
    })

    message.success("Conta de Cliente atualizada!")
    editClientForm.resetFields();
    setSelectedClient(null)
    editClientModal.closeModal()
  }

  const handleUpdateClientPassword = async ({
    currentPassword,
    newPassword
  }: UpdatePasswordFormData) => {
    if (!selectedClient) return message.error("Nenhum Cliente foi selecionado!");
    await updatePassword({
      userId: selectedClient.id,
      currentPassword,
      newPassword
    })

    message.success("Senha alterada com sucesso!");
    editClientPasswordForm.resetFields();
    editClientPasswordModal.closeModal()
  }

  const handleDeleteClient = async (clientId: string) => {
    await deleteClient({userId: clientId});

    message.success("Conta excluída!")
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, client: UserData) => <Button
          onClick={() => {
            const clientInfo = clients?.find(c => c.id === client.id);
            if(!clientInfo) return;
            setSelectedClient(clientInfo)
            clientInfoModal.openModal()
          }} 
          className='flex gap-2 !items-center !p-0 !border-0 !bg-transparent !shadow-none !h-auto'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${client.picturePath}?t=${Date.now()}`}
          />
          <span className='font-medium p-2'>{client.name}</span>
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
      title: 'Ações',
      key: 'actions',
      render: (_: any, client: UserData) => (
        <Space className="flex flex-col items-center">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedClient(client)
              editClientForm.setFieldsValue({
                newName: client.name,
                newEmail: client.email,
                newPhone: client.phone,
                newAddress: client.address,
              });
              editClientModal.openModal()
            }}
          >
            Editar
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedClient(client)
              editClientPasswordModal.openModal()
            }}
          >
            Alterar Senha
          </Button>
          <Popconfirm
            title="Excluir conta"
            description="Tem certeza que deseja excluir a conta deste cliente?"
            onConfirm={() => handleDeleteClient(client.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button 
              className="!font-medium"
              loading={isDeletionPending} 
              size="small" 
              danger 
              icon={<DeleteOutlined  />}>
              Excluir conta
            </Button>
          </Popconfirm>
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
        <Title level={2} className="!m-0">Gerenciar Clientes</Title>
      </div>
                
      <Table 
        columns={columns} 
        dataSource={clients} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* EDITAR CLIENTE */}
      <FormModal
        title="Editar Cliente"
        open={editClientModal.open}
        onCancel={() => {
          setSelectedClient(null)
          editClientModal.closeModal()
          editClientForm.resetFields();
        }}
        onFinish={handleUpdateClient}
        form={editClientForm}
      >
        <NameField name="newName" />
        <EmailField name="newEmail" />
        <PhoneField name="newPhone" />
        <AddressField name="newAddress" />
        <ConfirmButton loading={isUpdatePending} />
      </FormModal>

      {/* ATUALIZAÇÃO DE SENHA DO CLIENTE */}
      <FormModal
        title="Atualizar Senha"
        open={editClientPasswordModal.open}
        onCancel={() => {
          setSelectedClient(null)
          editClientPasswordModal.closeModal()
        }}
        onFinish={handleUpdateClientPassword}
        form={editClientPasswordForm}
      >
        <PasswordField name="currentPassword" />
        <PasswordField name="newPassword" />
        <ConfirmButton loading={isUpdatePassPending} />
      </FormModal>

      <UserInfoModal 
        isUserInfoModalOpen={clientInfoModal.open} 
        onCancel={() => clientInfoModal.closeModal()}
        user={selectedClient}
        updatable
      />
    </>
  )
}