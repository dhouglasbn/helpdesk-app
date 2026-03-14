import { Avatar, Button, Form, message, Modal, Select, Space, Table, Tag, Typography } from "antd";
import type { ServiceData } from "../../../http/types/service-data";
import type { TechTicketListData } from "../../../http/types/ticket-data";
import { useState } from "react";
import { env } from "../../../env";
import { TicketStatusTag } from "../ticket-status-tag";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { z } from 'zod';
import { TicketCard } from "../ticket-card";
import { useTechTicketList } from "../../../http/use-tech-ticket-list";
import { useListServices } from "../../../http/use-list-services";
import { useAddServicesToTicket } from "../../../http/use-add-services-to-ticket";
import { useUpdateTicketStatus } from "../../../http/use-update-ticket-status";
import { ClientInfoModal } from "../client-info-modal";
import { FormModal } from '../../components/form-modal'
import { ConfirmButton, ServicesField, StatusField } from "../form-modal-fields";
import { useModal } from '../../hooks/use-modal'

const { Title, Paragraph } = Typography;
const { Option } = Select;

const addServiceSchema = z.object({
  servicesIds: z.array(z.uuid())
})

const updateStatusSchema = z.object({
  status: z.string()
})

type AddServiceFormData = z.infer<typeof addServiceSchema>
type UpdateTicketStatusFormData = z.infer<typeof updateStatusSchema>

export function TechTicketManager() {
  const { data: ticketList } = useTechTicketList();
  const { data: serviceList } = useListServices();
  const { mutateAsync: addServicesToTicket, isPending: isAddServicesPending } = useAddServicesToTicket();
  const { mutateAsync: updateTicketStatus, isPending: isUpdateStatusPending } = useUpdateTicketStatus();

  const addServiceModal = useModal();
  const updateStatusModal = useModal();
  const userInfoModal = useModal();

  const [selectedTicket, setSelectedTicket] = useState<TechTicketListData | null>(null);
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
      render: (_: any, ticket: TechTicketListData) => (
        <Button
          onClick={() => {
            userInfoModal.openModal()
            setSelectedTicket(ticket)
          }} 
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
      render: (_: any, ticket: TechTicketListData) => (
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
      <Title level={2} className="mb-6">Chamados Atribuídos</Title>
                
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
            title="Atualizar Status do Ticket"
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
            <StatusField />
            <ConfirmButton loading={isUpdateStatusPending} innerText="Atualizar Status" />
          </FormModal>
        )}
        
      <ClientInfoModal
        isClientInfoModalOpen={userInfoModal.open}
        onCancel={() => {
          setSelectedTicket(null)
          userInfoModal.closeModal()
        }}
        client={selectedTicket?.client}
      />
    </>
  )
}