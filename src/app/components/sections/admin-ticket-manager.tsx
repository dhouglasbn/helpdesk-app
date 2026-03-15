import { Avatar, Button, Form, message, Space, Table, Tag, Typography } from "antd";
import type { ServiceData } from "../../../http/types/service-data";
import type { TechTicketListData } from "../../../http/types/ticket-data";
import { useState } from "react";
import { env } from "../../../env";
import { TicketStatusTag } from "../ticket-status-tag";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { z } from 'zod';
import { TicketCard } from "../ticket-card";
import { useAdminTicketList } from '../../../http/use-admin-ticket-list'
import { useListServices } from "../../../http/use-list-services";
import { useAddServicesToTicket } from "../../../http/use-add-services-to-ticket";
import { useUpdateTicketStatus } from "../../../http/use-update-ticket-status";
import { FormModal } from '../form-modal'
import { ConfirmButton, ServicesField, TicketStatusField } from "../form-modal-fields";
import { useModal } from '../../hooks/use-modal'
import { UserInfoModal } from "../user-info-modal";
import { AdminTicketListData } from '../../../http/types/ticket-data'
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "../../../http/use-get-user";

const { Title, Paragraph } = Typography;

const addServiceSchema = z.object({
  servicesIds: z.array(z.uuid())
})

const updateStatusSchema = z.object({
  status: z.string()
})

type AddServiceFormData = z.infer<typeof addServiceSchema>
type UpdateTicketStatusFormData = z.infer<typeof updateStatusSchema>

export function AdminTicketManager() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const queryClient = useQueryClient();
  const { data: ticketList } = useAdminTicketList();
  const { data: serviceList } = useListServices();
  const { data: selectedUser, isPending: loadingUser } = useGetUser(selectedUserId);
  const { mutateAsync: addServicesToTicket, isPending: isAddServicesPending } = useAddServicesToTicket();
  const { mutateAsync: updateTicketStatus, isPending: isUpdateStatusPending } = useUpdateTicketStatus();

  const addServiceModal = useModal();
  const updateStatusModal = useModal();
  const userInfoModal = useModal();

  const [selectedTicket, setSelectedTicket] = useState<AdminTicketListData | null>(null);
  const [serviceForm] = Form.useForm<AddServiceFormData>();
  const [statusForm] = Form.useForm<UpdateTicketStatusFormData>();

  const columns = [
    {
      title: 'Serviços',
      dataIndex: 'services',
      key: 'services',
      render: (services: ServiceData[]) => (
        <>
          {services.map(service => {
            return service ? <Tag key={service.id}>{service.title}</Tag> : null;
          })}
        </>
      ),
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client.id',
      render: (_: any, ticket: AdminTicketListData) => (
        <Button
          onClick={() => handleOpenUserModal(ticket.client.id)} 
          className='flex gap-2 !items-center !p-0 !border-0 !bg-transparent !shadow-none !h-auto'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${ticket.client.picturePath}`}
          />
          <span className='font-medium p-2'>{ticket.client.name}</span>
        </Button>
      )
    },
    {
      title: 'Técnico',
      dataIndex: 'tech',
      key: 'tech.id',
      render: (_: any, ticket: AdminTicketListData) => (
        <Button
          onClick={() => handleOpenUserModal(ticket.tech.id)} 
          className='flex gap-2 !items-center !p-0 !border-0 !bg-transparent !shadow-none !h-auto'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${ticket.tech.picturePath}`}
          />
          <span className='font-medium p-2'>{ticket.tech.name}</span>
        </Button>
      )
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 100,
      render: (price: string) => `R$ ${price}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <TicketStatusTag status={status} />,
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (value: string) => {
        const date = new Date(value);

        const time = date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const day = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        });

        return <div className="flex flex-col items-center gap-0">
          <Paragraph className="!m-0">{time}</Paragraph>
          <Paragraph className="!m-0">{day}</Paragraph>
        </div>
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, ticket: AdminTicketListData) => (
        <Space className='flex flex-col'>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedTicket(ticket);
              addServiceModal.openModal()
            }}
          >
            Adicionar Serviço
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTicket(ticket);
              statusForm.setFieldsValue({ status: ticket.status });
              updateStatusModal.openModal()
            }}
          >
            Alterar Status
          </Button>
        </Space>
      ),
    },
  ];

  const handleOpenUserModal = async (userId: string) => {
    setSelectedUserId(userId);
    await queryClient.invalidateQueries({ queryKey: ["user-data", selectedUserId]})
    userInfoModal.openModal()
  }

  const handleAddService = async ({ servicesIds }: AddServiceFormData) => {
        if (!selectedTicket) return message.error("Nenhum Chamado foi selecionado.")
  
        await addServicesToTicket({
          ticketId: selectedTicket.id,
          servicesIds
        })
        message.success('Serviços adicionados com sucesso!');
        addServiceModal.closeModal()
        serviceForm.resetFields();
      }
  
    const handleUpdateStatus = async ({ status }: UpdateTicketStatusFormData) => {
      if (!selectedTicket) return message.error("Nenhum chamado foi selecionado")
  
      await updateTicketStatus({ ticketId: selectedTicket.id, status });
  
      message.success('Status atualizado com sucesso!');
      updateStatusModal.closeModal();
      statusForm.resetFields();
    };

  return (
    <>
      <Title level={2} className="mb-6">Chamados</Title>
                
      <Table 
        columns={columns} 
        dataSource={ticketList} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
        {selectedTicket && (
          <FormModal
            title="Adicionar Serviços"
            open={addServiceModal.open}
            onCancel={() => {
              addServiceModal.closeModal()
              serviceForm.resetFields();
              setSelectedTicket(null);
            }}
            onFinish={handleAddService}
            form={serviceForm}
          >
            <TicketCard ticket={selectedTicket} />
            <ServicesField serviceList={serviceList} />
            <ConfirmButton loading={isAddServicesPending} innerText="Adicionar Serviços" />
          </FormModal>
        )}

        {selectedTicket && (
          <FormModal
            title="Atualizar Status do Chamado"
            open={updateStatusModal.open}
            onCancel={() => {
              setSelectedTicket(null);
              updateStatusModal.closeModal()
              statusForm.resetFields();
            }}
            onFinish={handleUpdateStatus}
            form={statusForm}
          >
            <TicketCard ticket={selectedTicket} />
            <TicketStatusField />
            <ConfirmButton loading={isUpdateStatusPending} innerText="Atualizar Status" />
          </FormModal>
        )}

      {selectedUser && (
        <UserInfoModal
          loading={loadingUser}
          isUserInfoModalOpen={userInfoModal.open}
          onCancel={() => {
            queryClient.invalidateQueries({ queryKey: ['user-data']})
            userInfoModal.closeModal()
          }}
          user={selectedUser}
        />
      )}
    </>
  )
}