import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useLogin } from '../../http/use-login';
import z from 'zod';
import Cookies from 'js-cookie'
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/UserContext';
import { useEffect } from 'react';

const { Title, Paragraph } = Typography;
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

type LoginFormData = z.infer<typeof loginSchema>

export default function SignInPage() {
  const { isPending, mutateAsync: login } = useLogin();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormData>();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    navigate(`/${user.role}Dashboard`)
  }, [user, loading, navigate])

  const handleLogin = async ({ email, password }: LoginFormData) => {
    const { token } = await login({email, password});
    Cookies.set("access_token", token, {
      expires: 1,
      sameSite: "Strict"
    })

    await queryClient.invalidateQueries({ queryKey: ["me"]})
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6">
      <ToastContainer />
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">Entrar</Title>
          <Paragraph type="secondary">Acesse sua conta HelpDesk Pro</Paragraph>
        </div>

        <Form
          form={form}
          name="signin"
          onFinish={handleLogin}
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
            rules={[
              { required: true, message: 'Por favor, insira sua senha' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Sua senha" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <Paragraph>
            Não tem uma conta?{' '}
            <Link to='/signUp'>Cadastre-se</Link>
          </Paragraph>
          <Paragraph>
            <Link to="/">Voltar para início</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
