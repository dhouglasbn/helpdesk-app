import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Table, Tag, Modal, Form, Input, Select, Typography, message, Popconfirm, Space, Switch, InputNumber } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined,
  ToolOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { User, Service, Ticket } from '@/app/App';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { LogoutButton } from '../components/logout-button';
import { UserProfile } from '../components/user-profile';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Mock data
const mockTechnicians: User[] = [
  { id: '2', name: 'Maria Santos', email: 'tech@example.com', role: 'technician', phone: '11988888888' },
  { id: '4', name: 'Carlos Oliveira', email: 'tech2@example.com', role: 'technician', phone: '11966666666' },
];

const mockClients: User[] = [
  { id: '1', name: 'João Silva', email: 'client@example.com', role: 'client', phone: '11999999999', address: 'Rua A, 123' },
  { id: '3', name: 'Pedro Costa', email: 'client2@example.com', role: 'client', phone: '11955555555', address: 'Rua B, 456' },
];

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
    clientId: '3',
    technicianId: '4',
    services: ['4'],
    status: 'Encerrado',
    createdAt: '2026-01-20',
    description: 'Treinamento para a equipe'
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('technicians');
  const [technicians, setTechnicians] = useState<User[]>(mockTechnicians);
  const [clients, setClients] = useState<User[]>(mockClients);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  useEffect(() => {
    if (!user || user?.role !== "admin") navigate("/", { replace: true })
  }, [user, navigate])
  
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<User | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [techForm] = Form.useForm();
  const [serviceForm] = Form.useForm();

  const getServiceById = (id: string) => services.find(s => s.id === id);
  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getTechnicianById = (id: string) => technicians.find(t => t.id === id);

  const calculateTicketTotal = (serviceIds: string[]) => {
    return serviceIds.reduce((total, id) => {
      const service = getServiceById(id);
      return total + (service?.price || 0);
    }, 0);
  };

  // Technician CRUD
  const handleSaveTechnician = (values: any) => {
    if (editingTech) {
      setTechnicians(technicians.map(t => t.id === editingTech.id ? { ...t, ...values } : t));
      message.success('Técnico atualizado com sucesso!');
    } else {
      const newTech: User = {
        id: String(technicians.length + 5),
        ...values,
        role: 'technician' as const,
      };
      setTechnicians([...technicians, newTech]);
      message.success('Técnico criado com sucesso!');
    }
    setIsTechModalOpen(false);
    setEditingTech(null);
    techForm.resetFields();
  };

  const handleDeleteTechnician = (id: string) => {
    setTechnicians(technicians.filter(t => t.id !== id));
    message.success('Técnico excluído com sucesso!');
  };

  // Service CRUD
  const handleSaveService = (values: any) => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...values } : s));
      message.success('Serviço atualizado com sucesso!');
    } else {
      const newService: Service = {
        id: String(services.length + 1),
        ...values,
      };
      setServices([...services, newService]);
      message.success('Serviço criado com sucesso!');
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
    serviceForm.resetFields();
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
    message.success('Serviço excluído com sucesso!');
  };

  const handleToggleServiceStatus = (id: string, active: boolean) => {
    setServices(services.map(s => s.id === id ? { ...s, active } : s));
    message.success(`Serviço ${active ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    message.success('Cliente excluído com sucesso!');
  };

  // Table columns
  const technicianColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTech(record);
              techForm.setFieldsValue(record);
              setIsTechModalOpen(true);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir técnico"
            description="Tem certeza que deseja excluir este técnico?"
            onConfirm={() => handleDeleteTechnician(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const serviceColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    { 
      title: 'Preço', 
      dataIndex: 'price', 
      key: 'price',
      render: (price: number) => `R$ ${price.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: Service) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleServiceStatus(record.id, checked)}
          checkedChildren="Ativo"
          unCheckedChildren="Inativo"
        />
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Service) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingService(record);
              serviceForm.setFieldsValue(record);
              setIsServiceModalOpen(true);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Excluir serviço"
            description="Tem certeza que deseja excluir este serviço?"
            onConfirm={() => handleDeleteService(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const clientColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'phone', key: 'phone' },
    { title: 'Endereço', dataIndex: 'address', key: 'address' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: User) => (
        <Popconfirm
          title="Excluir cliente"
          description="Tem certeza que deseja excluir este cliente?"
          onConfirm={() => handleDeleteClient(record.id)}
          okText="Sim"
          cancelText="Não"
        >
          <Button size="small" danger icon={<DeleteOutlined />}>
            Excluir
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const ticketColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'Cliente',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (clientId: string) => getClientById(clientId)?.name || 'Desconhecido',
    },
    {
      title: 'Técnico',
      dataIndex: 'technicianId',
      key: 'technicianId',
      render: (techId: string) => getTechnicianById(techId)?.name || 'Desconhecido',
    },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    {
      title: 'Serviços',
      dataIndex: 'services',
      key: 'services',
      render: (serviceIds: string[]) => (
        <>
          {serviceIds.map(serviceId => {
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
    { title: 'Data', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-[#001529] px-6">
        <Title level={3} className="!text-white !m-0">HelpDesk Pro - Admin</Title>
        <LogoutButton />
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
                key: 'technicians',
                icon: <ToolOutlined />,
                label: 'Técnicos',
              },
              {
                key: 'services',
                icon: <TeamOutlined />,
                label: 'Serviços',
              },
              {
                key: 'clients',
                icon: <UserOutlined />,
                label: 'Clientes',
              },
              {
                key: 'tickets',
                icon: <FileTextOutlined />,
                label: 'Todos os Tickets',
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
            {selectedMenu === 'technicians' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <Title level={2} className="!m-0">Gerenciar Técnicos</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setEditingTech(null);
                      techForm.resetFields();
                      setIsTechModalOpen(true);
                    }}
                    size="large"
                  >
                    Adicionar Técnico
                  </Button>
                </div>
                
                <Table 
                  columns={technicianColumns} 
                  dataSource={technicians} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />

                <Modal
                  title={editingTech ? 'Editar Técnico' : 'Adicionar Técnico'}
                  open={isTechModalOpen}
                  onCancel={() => {
                    setIsTechModalOpen(false);
                    setEditingTech(null);
                    techForm.resetFields();
                  }}
                  footer={null}
                >
                  <Form
                    form={techForm}
                    layout="vertical"
                    onFinish={handleSaveTechnician}
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
                      name="phone"
                      label="Telefone"
                      rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button type="primary" htmlType="submit" block>
                        {editingTech ? 'Atualizar' : 'Criar'}
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}

            {selectedMenu === 'services' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <Title level={2} className="!m-0">Gerenciar Serviços</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setEditingService(null);
                      serviceForm.resetFields();
                      setIsServiceModalOpen(true);
                    }}
                    size="large"
                  >
                    Adicionar Serviço
                  </Button>
                </div>
                
                <Table 
                  columns={serviceColumns} 
                  dataSource={services} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />

                <Modal
                  title={editingService ? 'Editar Serviço' : 'Adicionar Serviço'}
                  open={isServiceModalOpen}
                  onCancel={() => {
                    setIsServiceModalOpen(false);
                    setEditingService(null);
                    serviceForm.resetFields();
                  }}
                  footer={null}
                >
                  <Form
                    form={serviceForm}
                    layout="vertical"
                    onFinish={handleSaveService}
                    initialValues={{ active: true }}
                  >
                    <Form.Item
                      name="name"
                      label="Nome do Serviço"
                      rules={[{ required: true, message: 'Por favor, insira o nome' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Descrição"
                      rules={[{ required: true, message: 'Por favor, insira a descrição' }]}
                    >
                      <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                      name="price"
                      label="Preço (R$)"
                      rules={[{ required: true, message: 'Por favor, insira o preço' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/R\$\s?|(,*)/g, '') as any}
                      />
                    </Form.Item>

                    <Form.Item
                      name="active"
                      label="Status"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button type="primary" htmlType="submit" block>
                        {editingService ? 'Atualizar' : 'Criar'}
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}

            {selectedMenu === 'clients' && (
              <>
                <Title level={2} className="mb-6">Gerenciar Clientes</Title>
                
                <Table 
                  columns={clientColumns} 
                  dataSource={clients} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </>
            )}

            {selectedMenu === 'tickets' && (
              <>
                <Title level={2} className="mb-6">Todos os Tickets</Title>
                
                <Table 
                  columns={ticketColumns} 
                  dataSource={tickets} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
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