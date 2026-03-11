import { Button, Card, Row, Col, Typography } from 'antd';
import { CustomerServiceOutlined, ToolOutlined, TeamOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserContext';
import { useEffect } from 'react';

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(`/${user.role}Dashboard`)
  }, [user, navigate])

  const features = [
  {
    id: 0,
    icon: <CustomerServiceOutlined className="text-5xl text-[#667eea] mb-4" />,
    title: "Para Clientes",
    description: "Crie e acompanhe seus tickets de suporte de forma simples e rápida",
  },
  {
    id: 1,
    icon: <ToolOutlined className="text-5xl text-[#667eea] mb-4" />,
    title: "Para Técnicos",
    description: "Gerencie tickets atribuídos, adicione serviços e atualize status",
  },
  {
    id: 2,
    icon: <TeamOutlined className="text-5xl text-[#667eea] mb-4" />,
    title: "Para Administradores",
    description: "Controle total sobre usuários, serviços e todos os tickets",
  },
  {
    id: 3,
    icon: <SafetyOutlined className="text-5xl text-[#667eea] mb-4" />,
    title: "Seguro e Confiável",
    description: "Sistema robusto com controle de permissões por função",
  },
];
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Hero Section */}
      <div className="px-6 py-16 text-center text-white">
        <Title level={1} className="!text-white !text-5xl !mb-6">
          HelpDesk Pro
        </Title>
        <Paragraph className="!text-xl !text-white/90 max-w-2xl mx-auto mb-10">
          Sistema completo de gestão de tickets para conectar clientes, técnicos e administradores
        </Paragraph>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signUp">
            <Button 
              type="primary" 
              size="large" 
              className="!min-w-[150px] !h-12 !text-base"
            >
              Criar Conta
            </Button>
          </Link>
          <Link to="/signIn">
            <Button 
              size="large" 
              className="!min-w-[150px] !h-12 !text-base !bg-white"
            >
              Entrar
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="text-center !mb-12">
            Funcionalidades
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature) => (
              <Col key={feature.id} xs={24} sm={12} lg={6}>
                <Card hoverable className="text-center h-full">
                  {feature.icon}
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-10 text-center bg-gray-100">
        <Paragraph className="!mb-0">
          © 2026 HelpDesk Pro. Todos os direitos reservados.
        </Paragraph>
      </div>
    </div>
  );
}
