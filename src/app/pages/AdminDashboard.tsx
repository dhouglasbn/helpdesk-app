import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Table, Tag, Modal, Form, Input, Avatar, Typography, message, Popconfirm, Space, Switch, InputNumber } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined,
  ToolOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useListServices } from '../../http/use-list-services'
import type { User, Service, Ticket } from '@/app/App';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { LogoutButton } from '../components/logout-button';
import { UserProfile } from '../components/sections/user-profile';
import { env } from '../../env';
import { AdminTechManager } from '../components/sections/admin-tech-manager';
import { AdminServiceManager } from '../components/sections/admin-service-manager';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

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
  const { data: serviceList } = useListServices();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('technicians');
  const [clients, setClients] = useState<User[]>(mockClients);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  useEffect(() => {
    if (!user || user?.role !== "admin") navigate("/", { replace: true })
  }, [user, navigate])
  
  const getClientById = (id: string) => clients.find(c => c.id === id);

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    message.success('Cliente excluído com sucesso!');
  };

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
      render: (_techId: string) => {},
    },
    { title: 'Descrição', dataIndex: 'description', key: 'description' },
    {
      title: 'Serviços',
      dataIndex: 'services',
      key: 'services',
      render: (serviceIds: string[]) => (
        <>
          {}
        </>
      ),
    },
    {
      title: 'Total',
      key: 'total',
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
            {selectedMenu === 'technicians' && <AdminTechManager />}

            {selectedMenu === 'services' && <AdminServiceManager serviceList={serviceList} />}

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