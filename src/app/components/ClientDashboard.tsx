import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Card, Table, Tag, Modal, Form, Input, Select, Typography, Descriptions, message, Popconfirm } from 'antd';
import { 
  LogoutOutlined, 
  PlusOutlined, 
  UserOutlined, 
  FileTextOutlined,
  DeleteOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { User, Service, Ticket } from '@/app/App';
import { useAuth } from './context/UserContext';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


// Mock data
const mockServices: Service[] = [
  { id: '1', name: 'Instalação de Software', description: 'Instalação e configuração de software', price: 150, active: true },
  { id: '2', name: 'Manutenção de Hardware', description: 'Reparo e manutenção de hardware', price: 200, active: true },
  { id: '3', name: 'Consultoria', description: 'Consultoria técnica especializada', price: 300, active: true },
  { id: '4', name: 'Treinamento', description: 'Treinamento de usuários', price: 250, active: true },
  { id: '5', name: 'Serviço Desativado', description: 'Este serviço está desativado', price: 100, active: false },
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
];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('tickets');
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();

  useEffect(() => {
    if (!user) navigate("/", { replace: true })
  }, [user, navigate])

  const activeServices = mockServices.filter(s => s.active);

  const getServiceById = (id: string) => mockServices.find(s => s.id === id);

  const calculateTicketTotal = (serviceIds: string[]) => {
    return serviceIds.reduce((total, id) => {
      const service = getServiceById(id);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleCreateTicket = (values: any) => {
    const newTicket: Ticket = {
      id: String(tickets.length + 1),
      clientId: user?.id,
      technicianId: '2',
      services: values.services,
      status: 'Aberto',
      createdAt: new Date().toISOString().split('T')[0],
      description: values.description,
    };
    
    setTickets([newTicket, ...tickets]);
    message.success('Ticket criado com sucesso!');
    setIsCreateTicketModalOpen(false);
    form.resetFields();
  };

  const handleUpdateProfile = (values: any) => {
    message.success('Perfil atualizado com sucesso!');
    setIsEditProfileModalOpen(false);
  };

  const handleDeleteAccount = () => {
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-[#001529] px-6">
        <Title level={3} className="!text-white !m-0">HelpDesk Pro</Title>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />} 
          onClick={logout}
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
                label: 'Meus Tickets',
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
                <div className="flex justify-between items-center mb-6">
                  <Title level={2} className="!m-0">Meus Tickets</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsCreateTicketModalOpen(true)}
                    size="large"
                  >
                    Criar Ticket
                  </Button>
                </div>
                
                <Table 
                  columns={columns} 
                  dataSource={tickets} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />

                <Modal
                  title="Criar Novo Ticket"
                  open={isCreateTicketModalOpen}
                  onCancel={() => {
                    setIsCreateTicketModalOpen(false);
                    form.resetFields();
                  }}
                  footer={null}
                  width={600}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateTicket}
                  >
                    <Form.Item
                      name="description"
                      label="Descrição do Problema"
                      rules={[{ required: true, message: 'Por favor, descreva o problema' }]}
                    >
                      <TextArea rows={4} placeholder="Descreva detalhadamente o problema" />
                    </Form.Item>

                    <Form.Item
                      name="services"
                      label="Serviços Necessários"
                      rules={[{ required: true, message: 'Selecione pelo menos um serviço' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Selecione os serviços"
                        optionFilterProp="children"
                      >
                        {activeServices.map(service => (
                          <Option key={service.id} value={service.id}>
                            {service.name} - R$ {service.price.toFixed(2)}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => prevValues.services !== currentValues.services}
                    >
                      {({ getFieldValue }) => {
                        const selectedServices = getFieldValue('services') || [];
                        const total = calculateTicketTotal(selectedServices);
                        return total > 0 ? (
                          <Card size="small" className="mb-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <span><DollarOutlined /> Total Estimado:</span>
                              <strong className="text-lg text-blue-500">R$ {total.toFixed(2)}</strong>
                            </div>
                          </Card>
                        ) : null;
                      }}
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Button type="primary" htmlType="submit" block size="large">
                        Criar Ticket
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}

            {selectedMenu === 'profile' && (
              <>
                <Title level={2} className="mb-6">Meu Perfil</Title>
                
                <Card>
                  <Descriptions title="Informações Pessoais" bordered column={1}>
                    <Descriptions.Item label="Nome">{user?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                    <Descriptions.Item label="Telefone">{user?.phone || 'Não informado'}</Descriptions.Item>
                    <Descriptions.Item label="Endereço">{user?.address || 'Não informado'}</Descriptions.Item>
                    <Descriptions.Item label="Função">Cliente</Descriptions.Item>
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
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
