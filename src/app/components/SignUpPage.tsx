import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Upload, Avatar } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CameraOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import type { UploadProps, UploadFile } from 'antd';
import type { Page } from '@/app/App';

const { Title, Paragraph, Link } = Typography;

interface SignUpPageProps {
  onNavigate: (page: Page) => void;
}

export default function SignUpPage({ onNavigate }: SignUpPageProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [form] = Form.useForm();

  const uploadProps: UploadProps = {
    name: 'avatar',
    listType: 'picture-circle',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Você só pode enviar arquivos de imagem!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('A imagem deve ter menos de 5MB!');
        return Upload.LIST_IGNORE;
      }
      
      // Preview the image
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageUrl(reader.result as string);
      });
      reader.readAsDataURL(file);
      
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setImageUrl('');
    },
  };

  const onFinish = (values: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      message.success('Conta criada com sucesso! Faça login para continuar.');
      setLoading(false);
      onNavigate('signin');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6 py-8">
      <Card className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">Criar Conta</Title>
          <Paragraph type="secondary">Cadastre-se como cliente no HelpDesk Pro</Paragraph>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          {/* Profile Picture Upload - Circular */}
          <Form.Item
            name="picture"
            valuePropName="file"
            className="flex justify-center mb-8"
            rules={[{ required: true, message: 'Por favor, envie sua foto de perfil' }]}
          >
            <div className="flex flex-col items-center gap-4">
              <ImgCrop
                rotationSlider
                quality={1}
                aspectSlider
                showReset
                modalTitle="Editar Foto de Perfil"
                modalOk="Confirmar"
                modalCancel="Cancelar"
                cropShape="round"
              >
                <Upload {...uploadProps}>
                  <div className="relative cursor-pointer group">
                    {imageUrl ? (
                      <div className="relative">
                        <Avatar
                          size={150}
                          src={imageUrl}
                          className="border-4 border-dashed border-blue-400 transition-all group-hover:border-blue-600"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                          <CameraOutlined className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-[150px] h-[150px] rounded-full border-4 border-dashed border-gray-300 hover:border-blue-500 transition-all flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50">
                        <CameraOutlined className="text-4xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 text-center px-4">
                          Clique ou arraste sua foto
                        </span>
                      </div>
                    )}
                  </div>
                </Upload>
              </ImgCrop>
              <Paragraph type="secondary" className="!text-xs !mt-3 !mb-0 text-center">
                Arraste e solte ou clique para selecionar
              </Paragraph>
            </div>
          </Form.Item>

          <Form.Item
            name="name"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Seu nome completo" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira seu email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="seu@email.com" 
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
            rules={[{ required: true, message: 'Por favor, insira seu telefone' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="(11) 99999-9999" 
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Endereço"
            rules={[{ required: true, message: 'Por favor, insira seu endereço' }]}
          >
            <Input 
              prefix={<HomeOutlined />} 
              placeholder="Rua, número, bairro" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[
              { required: true, message: 'Por favor, insira sua senha' },
              { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mínimo 6 caracteres" 
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Senha"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Por favor, confirme sua senha' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('As senhas não coincidem'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirme sua senha" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Criar Conta
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <Paragraph>
            Já tem uma conta?{' '}
            <Link onClick={() => onNavigate('signin')}>Entrar</Link>
          </Paragraph>
          <Paragraph>
            <Link onClick={() => onNavigate('landing')}>Voltar para início</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
