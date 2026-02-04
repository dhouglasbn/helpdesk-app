import { useState } from 'react';
import { Layout, Menu, Button, Card, Table, Tag, Modal, Form, Input, Select, Typography, Descriptions, message, Space } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  FileTextOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import type { User, Service, Ticket } from '@/app/App';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface TechnicianDashboardProps {
  user: User;
  onSignOut: () => void;
}

// Mock data
const mockServices: Service[] = [
  { id: '1', name: 'Instalação de Software', description: 'Instalação e configuração de software', price: 150, active: true },
  { id: '2', name: 'Manutenção de Hardware', description: 'Reparo e manutenção de hardware', price: 200, active: true },
  { id: '3', name: 'Consultoria', description: 'Consultoria técnica especializada', price: 300, active: true },
  { id: '4', name: 'Treinamento', description: 'Treinamento de usuários', price: 250, active: true },
];

const mockClients = [
  { id: '1', name: 'João Silva' },
  { id: '3', name: 'Pedro Costa' },
];

const mockTickets: Ticket[] = [
  {
    id: '1',
    clientId: '1',
    technicianId: '2',
    services: ['1'],
    status: 'Aberto',
    createdAt: '2026-01-28',
    description: 'Preciso instalar o Office 365'
  },
  {
    id: '2',
    clientId: '1',
    technicianId: '2',
    services: ['2', '3'],
    status: 'Em atendimento',
    createdAt: '2026-01-25',
    description: 'Computador não liga'
  },
  {
    id: '3',
    clientId: '1',
    technicianId: '2',
    services: ['4'],
    status: 'Encerrado',
    createdAt: '2026-01-20',
    description: 'Treinamento para a equipe'
  },
  {
    id: '4',
    clientId: '3',
    technicianId: '2',
    services: ['1', '2'],
    status: 'Aberto',
    createdAt: '2026-01-27',
    description: 'Instalação e manutenção urgente'
  },
];

export default function TechnicianDashboard({ user, onSignOut }: TechnicianDashboardProps) {
  const [selectedMenu, setSelectedMenu] = useState('tickets');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [serviceForm] = Form.useForm();
  const [statusForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const getServiceById = (id: string) => mockServices.find(s => s.id === id);
  const getClientById = (id: string) => mockClients.find(c => c.id === id);

  const calculateTicketTotal = (serviceIds: string[]) => {
    return serviceIds.reduce((total, id) => {
      const service = getServiceById(id);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleAddService = (values: any) => {
    if (selectedTicket) {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === selectedTicket.id) {
          return {
            ...ticket,
            services: [...ticket.services, ...values.services],
          };
        }
        return ticket;
      });
      setTickets(updatedTickets);
      message.success('Serviços adicionados com sucesso!');
      setIsAddServiceModalOpen(false);
      serviceForm.resetFields();
    }
  };

  const handleUpdateStatus = (values: any) => {
    if (selectedTicket) {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === selectedTicket.id) {
          return {
            ...ticket,
            status: values.status,
          };
        }
        return ticket;
      });
      setTickets(updatedTickets);
      message.success('Status atualizado com sucesso!');
      setIsUpdateStatusModalOpen(false);
      statusForm.resetFields();
    }
  };

  const handleUpdateProfile = (values: any) => {
    message.success('Perfil atualizado com sucesso!');
    setIsEditProfileModalOpen(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Cliente',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (clientId: string) => getClientById(clientId)?.name || 'Desconhecido',
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Serviços',
      dataIndex: 'services',
      key: 'services',
      render: (services: string[]) => (
        <>
          {services.map(serviceId => {
            const service = getServiceById(serviceId);
            return service ? <Tag key={serviceId}>{service.name}</Tag> : null;
          })}
        </>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: Ticket) => (
        <span>R$ {calculateTicketTotal(record.services).toFixed(2)}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Em atendimento') color = 'orange';
        if (status === 'Encerrado') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Ticket) => (
        <Space>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedTicket(record);
              setIsAddServiceModalOpen(true);
            }}
          >
            Serviço
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTicket(record);
              statusForm.setFieldsValue({ status: record.status });
              setIsUpdateStatusModalOpen(true);
            }}
          >
            Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-[#001529] px-6">
        <Title level={3} className="!text-white !m-0">HelpDesk Pro - Técnico</Title>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />} 
          onClick={onSignOut}
        >
          Sair
        </Button>
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
                <Title level={2} className="mb-6">Tickets Atribuídos</Title>
                
                <Table 
                  columns={columns} 
                  dataSource={tickets.filter(t => t.technicianId === user.id)} 
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
                      <Card size="small" className="mb-4 bg-gray-50">
                        <p><strong>Ticket:</strong> #{selectedTicket.id}</p>
                        <p><strong>Cliente:</strong> {getClientById(selectedTicket.clientId)?.name}</p>
                        <p><strong>Descrição:</strong> {selectedTicket.description}</p>
                      </Card>

                      <Form
                        form={serviceForm}
                        layout="vertical"
                        onFinish={handleAddService}
                      >
                        <Form.Item
                          name="services"
                          label="Serviços Adicionais"
                          rules={[{ required: true, message: 'Selecione pelo menos um serviço' }]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Selecione os serviços"
                            optionFilterProp="children"
                          >
                            {mockServices
                              .filter(s => !selectedTicket.services.includes(s.id))
                              .map(service => (
                                <Option key={service.id} value={service.id}>
                                  {service.name} - R$ {service.price.toFixed(2)}
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
                      <Card size="small" className="mb-4 bg-gray-50">
                        <p><strong>Ticket:</strong> #{selectedTicket.id}</p>
                        <p><strong>Cliente:</strong> {getClientById(selectedTicket.clientId)?.name}</p>
                        <p className="!mb-0">
                          <strong>Total:</strong>{' '}
                          <span className="text-blue-500 text-base">
                            R$ {calculateTicketTotal(selectedTicket.services).toFixed(2)}
                          </span>
                        </p>
                      </Card>

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
                            <Option value="Aberto">Aberto</Option>
                            <Option value="Em atendimento">Em atendimento</Option>
                            <Option value="Encerrado">Encerrado</Option>
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
              </>
            )}

            {selectedMenu === 'profile' && (
              <>
                <Title level={2} className="mb-6">Meu Perfil</Title>
                
                <Card>
                  <Descriptions title="Informações Pessoais" bordered column={1}>
                    <Descriptions.Item label="Nome">{user.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Telefone">{user.phone || 'Não informado'}</Descriptions.Item>
                    <Descriptions.Item label="Função">Técnico</Descriptions.Item>
                  </Descriptions>
                  
                  <div className="mt-6">
                    <Button 
                      type="primary" 
                      onClick={() => {
                        profileForm.setFieldsValue(user);
                        setIsEditProfileModalOpen(true);
                      }}
                    >
                      Editar Perfil
                    </Button>
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

                    <Form.Item className="!mb-0">
                      <Button type="primary" htmlType="submit" block>
                        Salvar Alterações
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
