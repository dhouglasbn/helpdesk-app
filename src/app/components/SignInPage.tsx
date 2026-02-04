import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { Page, User } from '@/app/App';

const { Title, Paragraph, Link } = Typography;

interface SignInPageProps {
  onNavigate: (page: Page) => void;
  onSignIn: (user: User) => void;
}

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'João Silva', email: 'client@example.com', role: 'client', phone: '11999999999', address: 'Rua A, 123' },
  { id: '2', name: 'Maria Santos', email: 'tech@example.com', role: 'technician', phone: '11988888888' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', phone: '11977777777' },
];

export default function SignInPage({ onNavigate, onSignIn }: SignInPageProps) {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === values.email);
      
      if (user && values.password === 'password') {
        message.success('Login realizado com sucesso!');
        onSignIn(user);
      } else {
        message.error('Email ou senha incorretos');
      }
      
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">Entrar</Title>
          <Paragraph type="secondary">Acesse sua conta HelpDesk Pro</Paragraph>
        </div>

        <Form
          name="signin"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira seu email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="seu@email.com" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: 'Por favor, insira sua senha' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Sua senha" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <Paragraph>
            Não tem uma conta?{' '}
            <Link onClick={() => onNavigate('signup')}>Cadastre-se</Link>
          </Paragraph>
          <Paragraph>
            <Link onClick={() => onNavigate('landing')}>Voltar para início</Link>
          </Paragraph>
        </div>

        <Card size="small" className="mt-6 bg-gray-50">
          <Title level={5} className="!mb-3">Contas de Teste:</Title>
          <Paragraph className="!text-xs !mb-1">
            <strong>Cliente:</strong> client@example.com
          </Paragraph>
          <Paragraph className="!text-xs !mb-1">
            <strong>Técnico:</strong> tech@example.com
          </Paragraph>
          <Paragraph className="!text-xs !mb-1">
            <strong>Admin:</strong> admin@example.com
          </Paragraph>
          <Paragraph className="!text-xs !mb-0">
            <strong>Senha:</strong> password
          </Paragraph>
        </Card>
      </Card>
    </div>
  );
}
