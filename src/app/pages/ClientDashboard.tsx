import { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from '../components/logout-button';
import { UserProfile } from '../components/sections/user-profile';
import { env } from '../../env';
import { ClientTicketManager } from '../components/sections/client-tickets-manager';


const { Header, Content, Sider } = Layout;
const { Title } = Typography;



export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('tickets');

  useEffect(() => {
    if (!user || user?.role !== "client") {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between bg-[#001529] px-6">
        <Title level={3} className="!text-white !m-0">HelpDesk Pro</Title>
        <div className='flex items-center gap-5'>
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
                label: 'Meus Chamados',
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
            {selectedMenu === 'tickets' && <ClientTicketManager />}

            {selectedMenu === 'profile' && <UserProfile user={user} logout={logout} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
