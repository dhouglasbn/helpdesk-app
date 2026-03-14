import { useState } from "react";
import { Button, Modal, Card, Descriptions, Popconfirm, Typography, Form, Input, message, Tag, Select } from "antd";
import { DeleteOutlined, LockOutlined } from "@ant-design/icons";
import type { UserData } from '../../../http/types/user-data';
import { AvatarUploader } from "../avatar-uploader";
import { z } from 'zod';
import { useUpdateUser } from "../../../http/use-update-user";
import { useDeleteClient } from "../../../http/use-delete-client";
import { useUpdateUserPassword } from "../../../http/use-update-user-password";
import { useUpdateTechAvailabilities } from "../../../http/use-update-tech-availabilities";
import { FormModal } from "../form-modal";
import { useModal } from "../../hooks/use-modal";
import { AddressField, AvailabilitiesField, ConfirmButton, EmailField, NameField, PasswordField, PhoneField } from "../form-modal-fields";

const { Title } = Typography;
const { Option } = Select;

interface UserProfileProps {
  user: UserData | null,
  logout?: () => void,
}

const updateUserSchema = z.object({
  newName: z.string().min(3),
	newEmail: z.email(),
	newPhone: z.string().min(10),
	newAddress: z.string().min(5),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

const updateAvailabilitiesSchema = z.object({
  newAvailabilities: z.array(z.string())
})

type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
type UpdateAvailabilitiesFormData = z.infer<typeof updateAvailabilitiesSchema>

export function UserProfile({user, logout}: UserProfileProps) {
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const { mutateAsync: deleteClient, isPending: isDeletionPending } = useDeleteClient();
  const { mutateAsync: updateUserPassword, isPending: isUpdatePassPending } = useUpdateUserPassword();
  const { mutateAsync: updateTechAvailabilities, isPending: isUpdateAvPending} = useUpdateTechAvailabilities();
  
  const editProfileModal = useModal();
  const updatePasswordModal = useModal();
  const updateAvailabilitiesModal = useModal();

  const [profileForm] = Form.useForm<UpdateUserFormData>();
  const [passwordForm] = Form.useForm<UpdatePasswordFormData>();
  const [availabilitiesForm] = Form.useForm<UpdateAvailabilitiesFormData>();

  const handleUpdateProfile = async ({
    newName,
    newEmail,
    newAddress,
    newPhone
  }: UpdateUserFormData) => {
    if (!user) return message.error("Você não está mais autenticado")
    await updateUser({
      userId: user.id,
      role: user.role,
      newName,
      newEmail,
      newAddress,
      newPhone,
    })

    message.success('Perfil atualizado com sucesso!');
    editProfileModal.closeModal()
  };

  const handleUpdatePassword = async ({
    currentPassword,
    newPassword
  }: UpdatePasswordFormData) => {
    if (!user) return message.error("Sua sessão de autenticação encerrou");

    await updateUserPassword({
      userId: user.id,
      currentPassword,
      newPassword
    });

    message.success("Senha atualizada com sucesso!")
    updatePasswordModal.closeModal()
  }

  const handleDeleteAccount = async () => {
    if (!user) return message.error("Sua sessão de autenticação está encerrada.")
    if (!logout) return message.error("Ocorreu um erro inesperado.")

    await deleteClient({userId: user.id})
    message.success("Conta excluída!")
    logout();
  };

  const handleUpdateAvailabilities = async ({
    newAvailabilities
  }: UpdateAvailabilitiesFormData) => {
    if (!user) return message.error("Sua sessão de autenticação encerrou!");
    await updateTechAvailabilities({techId: user.id, newAvailabilities});

    message.success("Disponibilidades alteradas com sucesso!");
    availabilitiesForm.resetFields();
    updateAvailabilitiesModal.closeModal()
  }
  

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

  const showPhoneNumber = (phoneNumber?: string) => {
    return `(${phoneNumber?.slice(0,2)})${phoneNumber?.slice(2,7)}-${phoneNumber?.slice(7, 11)}`
  }

  const availabilities = () => Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, "0")}:00`
  );

  return (
    <>
      <Title level={2} className="mb-6">Meu Perfil</Title>
      <div className="flex w-full justify-center">
        <AvatarUploader user={user} />
      </div>
                
      <Card>
        <Descriptions title="Informações Pessoais" bordered column={1}>
          <Descriptions.Item label="Nome">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Telefone">{showPhoneNumber(user?.phone) || 'Não informado'}</Descriptions.Item>
          <Descriptions.Item label="Endereço">{user?.address || 'Não informado'}</Descriptions.Item>
          <Descriptions.Item label="Função">{getRoleLabel(user?.role)}</Descriptions.Item>
          {user?.role === "tech" && (
            <Descriptions.Item label="Disponibilidades">
              {user.availabilities?.map((availability) => (
                <Tag color="green" key={availability}>
                  {availability}
                </Tag>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
                  
        <div className="mt-6 flex gap-4">
          <Button 
            type="primary" 
            onClick={() => {
              profileForm.setFieldsValue({
                newName: user?.name,
                newEmail: user?.email,
                newAddress: user?.address,
                newPhone: user?.phone
              });
              editProfileModal.openModal()
            }}
          >
            Editar Perfil
          </Button>
          <Button 
            type="primary" 
            onClick={() => updatePasswordModal.openModal()}
          >
            Atualizar Senha
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
              <Button loading={isDeletionPending} danger icon={<DeleteOutlined />}>
                Excluir Conta
              </Button>
            </Popconfirm>
          )}
          {user?.role === "tech" && (
            <Button 
              type="primary" 
              onClick={() => {
                updateAvailabilitiesModal.openModal()
                availabilitiesForm.setFieldsValue({
                  newAvailabilities: user.availabilities
                })
              }}
            >
              Atualizar Disponibilidades
            </Button>
          )}
        </div>
      </Card>

      <FormModal
        title="Editar Perfil"
        open={editProfileModal.open}
        onCancel={() => editProfileModal.closeModal()}
        onFinish={handleUpdateProfile}
        form={profileForm}
      >
        <NameField name="newName" />
        <EmailField name="newEmail" />
        <PhoneField name="newPhone" />
        <AddressField name="newAddress" />
        <ConfirmButton innerText="Salvar Alterações" loading={isPending} />
      </FormModal>

      {/* ATUALIZAÇÃO DE SENHA */}
      <FormModal
        title="Atualizar Senha"
        open={updatePasswordModal.open}
        onCancel={() => updatePasswordModal.closeModal()}
        onFinish={handleUpdatePassword}
        form={passwordForm}
      >
        <PasswordField name="currentPassword" />
        <PasswordField name="newPassword" />
        <ConfirmButton loading={isUpdatePassPending} innerText="Alterar Senha" />
      </FormModal>

      {/* ATUALIZAÇÃO DE DISPONIBILIDADES DO TÉCNICO */}

      <FormModal
        title="Atualizar Disponibilidades"
        open={updateAvailabilitiesModal.open}
        onCancel={() => updateAvailabilitiesModal.closeModal()}
        onFinish={handleUpdateAvailabilities}
        form={availabilitiesForm}
      >
        <AvailabilitiesField name="newAvailabilities" />
        <ConfirmButton loading={isUpdateAvPending} />
      </FormModal>
    </>
  )
}