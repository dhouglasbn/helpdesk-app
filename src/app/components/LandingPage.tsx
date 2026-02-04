import { Button, Card, Row, Col, Typography } from 'antd';
import { CustomerServiceOutlined, ToolOutlined, TeamOutlined, SafetyOutlined } from '@ant-design/icons';
import type { Page } from '@/app/App';

const { Title, Paragraph } = Typography;

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
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
          <Button 
            type="primary" 
            size="large" 
            onClick={() => onNavigate('signup')} 
            className="!min-w-[150px] !h-12 !text-base"
          >
            Criar Conta
          </Button>
          <Button 
            size="large" 
            onClick={() => onNavigate('signin')} 
            className="!min-w-[150px] !h-12 !text-base !bg-white"
          >
            Entrar
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="text-center !mb-12">
            Funcionalidades
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="text-center h-full">
                <CustomerServiceOutlined className="text-5xl text-[#667eea] mb-4" />
                <Title level={4}>Para Clientes</Title>
                <Paragraph>Crie e acompanhe seus tickets de suporte de forma simples e rápida</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="text-center h-full">
                <ToolOutlined className="text-5xl text-[#667eea] mb-4" />
                <Title level={4}>Para Técnicos</Title>
                <Paragraph>Gerencie tickets atribuídos, adicione serviços e atualize status</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="text-center h-full">
                <TeamOutlined className="text-5xl text-[#667eea] mb-4" />
                <Title level={4}>Para Administradores</Title>
                <Paragraph>Controle total sobre usuários, serviços e todos os tickets</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="text-center h-full">
                <SafetyOutlined className="text-5xl text-[#667eea] mb-4" />
                <Title level={4}>Seguro e Confiável</Title>
                <Paragraph>Sistema robusto com controle de permissões por função</Paragraph>
              </Card>
            </Col>
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
