import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Layout, Menu, Button, Table, Tag, Modal, Form, Select, Avatar, Typography, message, Space } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useTechTicketList } from '../../http/use-tech-ticket-list'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { LogoutButton } from '../components/logout-button';
import { UserProfile } from '../components/user-profile';
import { env } from '../../env';
import type { TechTicketListData, UserInTicketData } from '../../http/types/ticket-data';
import type { ServiceData } from '../../http/types/service-data';
import { useListServices } from '../../http/use-list-services';
import { TicketStatusTag } from '../components/ticket-status-tag';
import { ServiceCard } from '../components/service-card';
import { useAddServicesToTicket } from '../../http/use-add-services-to-ticket';
import { useUpdateTicketStatus } from '../../http/use-update-ticket-status';
import { ClientInfoModal } from '../components/client-info-modal';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

const addServiceSchema = z.object({
  servicesIds: z.array(z.uuid())
})

const updateStatusSchema = z.object({
  status: z.string()
})

type AddServiceFormData = z.infer<typeof addServiceSchema>
type UpdateTicketStatusFormData = z.infer<typeof updateStatusSchema>

export default function TechnicianDashboard() {
  const { mutateAsync: addServicesToTicket } = useAddServicesToTicket();
  const { mutateAsync: updateTicketStatus } = useUpdateTicketStatus();
  const { data: ticketList } = useTechTicketList();
  const { data: serviceList } = useListServices();
  const navigate = useNavigate();
  const { user } = useAuth();


  const [selectedMenu, setSelectedMenu] = useState('tickets');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TechTicketListData | null>(null);
  const [serviceForm] = Form.useForm<AddServiceFormData>();
  const [statusForm] = Form.useForm<UpdateTicketStatusFormData>();

  useEffect(() => {
    if (!user || user?.role !== "tech") navigate("/", { replace: true })
  }, [user, navigate])

  const handleAddService = async ({ servicesIds }: AddServiceFormData) => {
      if (!selectedTicket) return message.error("Nenhum Chamado foi selecionado.")

      await addServicesToTicket({
        ticketId: selectedTicket.id,
        servicesIds
      })
      message.success('Serviços adicionados com sucesso!');
      setIsAddServiceModalOpen(false);
      serviceForm.resetFields();
    }

  const handleUpdateStatus = async ({ status }: UpdateTicketStatusFormData) => {
    if (!selectedTicket) return message.error("Nenhum chamado foi selecionado")

    await updateTicketStatus({ ticketId: selectedTicket.id, status });

    message.success('Status atualizado com sucesso!');
    setIsUpdateStatusModalOpen(false);
    statusForm.resetFields();
  };

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
            setIsUserInfoModalOpen(true)
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
      width: 140,
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

        return `${time} ${day}`
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
              setIsAddServiceModalOpen(true);
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
              setIsUpdateStatusModalOpen(true);
            }}
          >
            Alterar Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-[#001529] px-6">
        <Title level={3} className="!text-white !m-0">HelpDesk Pro - Técnico</Title>
        <div className='flex gap-5 items-center'>
          <Avatar
            size={50}
            src={`${env.VITE_API_URL}${user?.picturePath}?t=${Date.now()}`}
          />
          <LogoutButton />
        </div>
      </Header>
      
      <Layout>
        <Sider width={250} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onClick={({ key }) => setSelectedMenu(key)}
            className="h-full border-r-0"
            items={[
              {
                key: 'tickets',
                icon: <FileTextOutlined />,
                label: 'Tickets Atribuídos',
              },
              {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'Perfil',
              },
            ]}
          />
        </Sider>
        
        <Layout className="p-6">
          <Content className="bg-white p-6 min-h-[280px]">
            {selectedMenu === 'tickets' && (
              <>
                <Title level={2} className="mb-6">Chamados Atribuídos</Title>
                
                <Table 
                  columns={columns} 
                  dataSource={ticketList} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />

                <Modal
                  title="Adicionar Serviços"
                  open={isAddServiceModalOpen}
                  onCancel={() => {
                    setIsAddServiceModalOpen(false);
                    serviceForm.resetFields();
                    setSelectedTicket(null);
                  }}
                  footer={null}
                  width={500}
                >
                  {selectedTicket && (
                    <>
                      <ServiceCard ticket={selectedTicket} />

                      <Form
                        form={serviceForm}
                        layout="vertical"
                        onFinish={handleAddService}
                      >
                        <Form.Item
                          name="servicesIds"
                          label="Serviços Adicionais"
                          rules={[{ required: true, message: 'Selecione pelo menos um serviço' }]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Selecione os serviços"
                            optionFilterProp="children"
                          >
                            {serviceList?.map(service => (
                                <Option key={service.id} value={service.id}>
                                  {service.title} - R$ {service.price}
                                </Option>
                              ))}
                          </Select>
                        </Form.Item>

                        <Form.Item className="!mb-0">
                          <Button type="primary" htmlType="submit" block>
                            Adicionar Serviços
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  )}
                </Modal>

                <Modal
                  title="Atualizar Status do Ticket"
                  open={isUpdateStatusModalOpen}
                  onCancel={() => {
                    setIsUpdateStatusModalOpen(false);
                    statusForm.resetFields();
                    setSelectedTicket(null);
                  }}
                  footer={null}
                >
                  {selectedTicket && (
                    <>
                      <ServiceCard ticket={selectedTicket} />

                      <Form
                        form={statusForm}
                        layout="vertical"
                        onFinish={handleUpdateStatus}
                      >
                        <Form.Item
                          name="status"
                          label="Novo Status"
                          rules={[{ required: true, message: 'Selecione um status' }]}
                        >
                          <Select placeholder="Selecione o status">
                            <Option value="aberto">Aberto</Option>
                            <Option value="em_atendimento">Em atendimento</Option>
                            <Option value="encerrado">Encerrado</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item className="!mb-0">
                          <Button type="primary" htmlType="submit" block>
                            Atualizar Status
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  )}
                </Modal>
                <ClientInfoModal
                  isClientInfoModalOpen={isUserInfoModalOpen}
                  onCancel={() => {
                    setSelectedTicket(null)
                    setIsUserInfoModalOpen(false)
                  }}
                  client={selectedTicket?.client}
                />
              </>
            )}

            {selectedMenu === 'profile' && <UserProfile user={user} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
