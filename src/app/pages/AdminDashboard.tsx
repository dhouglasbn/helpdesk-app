import { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined,
  ToolOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useListServices } from '../../http/use-list-services'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { LogoutButton } from '../components/logout-button';
import { UserProfile } from '../components/sections/user-profile';
import { env } from '../../env';
import { AdminTechManager } from '../components/sections/admin-tech-manager';
import { AdminServiceManager } from '../components/sections/admin-service-manager';
import { AdminClientManager } from '../components/sections/admin-client-manager';
import { AdminTicketManager } from '../components/sections/admin-ticket-manager';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function AdminDashboard() {
  const { data: serviceList } = useListServices();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('technicians');

  useEffect(() => {
    if (!user || user?.role !== "admin") navigate("/", { replace: true })
  }, [user, navigate])

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
                label: 'Todos os Chamados',
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

            {selectedMenu === 'clients' && <AdminClientManager />}

            {selectedMenu === 'tickets' && <AdminTicketManager />}

            {selectedMenu === 'profile' && <UserProfile user={user} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}