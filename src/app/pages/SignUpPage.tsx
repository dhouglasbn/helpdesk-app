import { z } from 'zod'
import { Form, Input, Button, Card, Typography, message, Upload } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CameraOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useCreateClient } from '../../http/use-create-client';
import { useLogin } from '../../http/use-login';
import type { UploadFile, UploadProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import { useUpdatePicture } from '../../http/use-update-picture';
import Cookies from 'js-cookie'
import { useQueryClient } from '@tanstack/react-query';


const { Title, Paragraph } = Typography;


const createClientSchema = z.object({
			name: z.string().min(3),
			email: z.email(),
			password: z.string().min(6),
			phone: z.string().min(10),
			address: z.string().min(5),
		})

type CreateClientFormData = z.infer<typeof createClientSchema> & {
  picture: UploadFile[]
}

export default function SignUpPage() {
  const { 
    isPending: isCreationPending,
    mutateAsync: createClient
  } = useCreateClient();
  const {
    isPending: isUpdatePicturePending,
    mutateAsync: updatePicture,
  } = useUpdatePicture();
  const {mutateAsync: login} = useLogin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateClientFormData>();
  const fileList = Form.useWatch("picture", form) || []

  const uploadProps: UploadProps = {
    name: 'avatar',
    listType: 'picture-circle',
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Você só pode enviar arquivos de imagem!');
        return Upload.LIST_IGNORE;
      }
      const isLowerThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLowerThan5MB) {
        message.error('A imagem deve ter menos de 5MB!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto upload
    },
    previewFile: async (file) => {
      return URL.createObjectURL(file)
    },
    onChange: ({ fileList }) => {
      form.setFieldValue("picture", fileList.slice(-1))
    }
  };

  const handleCreateClient = async ({
    name,
    email,
    password,
    phone,
    address,
    picture
  }: CreateClientFormData) => {
    
    const { newClient } = await createClient({
      name,
      email,
      password,
      phone,
      address
    });

    const { token } = await login({email, password});
    Cookies.set("access_token", token, {
      expires: 1,
      sameSite: "Strict"
    })

    await updatePicture({
      userId: newClient.id,
      picture
    })
    message.success("Usuário cadastrado com sucesso !")
    form.resetFields()
    await queryClient.invalidateQueries({ queryKey: ["me"]})
    navigate('/clientDashboard')
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
          onFinish={handleCreateClient}
          layout="vertical"
          size="large"
        >
          {/* Profile Picture Upload - Circular */}
          <Form.Item
            name="picture"
            valuePropName="fileList"
            getValueFromEvent={e => e?.fileList?.slice(-1)}
            className="flex justify-center mb-8"
            rules={[{ required: true, message: 'Por favor, envie sua foto de perfil' }]}
          >
            <div className="flex flex-col items-center gap-4">
              <ImgCrop
                quality={1}
                showReset
                modalTitle="Editar Foto de Perfil"
                modalOk="Confirmar"
                modalCancel="Cancelar"
                cropShape="round"
              >
                <Upload fileList={fileList} {...uploadProps} className="
                  [&_.ant-upload-select]:!w-[180px]
                  [&_.ant-upload-select]:!h-[180px]
                  [&_.ant-upload-list-item]:!w-[180px]
                  [&_.ant-upload-list-item]:!h-[180px]
                  [&_.ant-upload-list-item-container]:!w-[180px]
                  [&_.ant-upload-list-item-container]:!h-[180px]
                  [&_.ant-upload-list-item-thumbnail_img]:!w-full
                  [&_.ant-upload-list-item-thumbnail_img]:!h-full
                  [&_.ant-upload-list-item-thumbnail_img]:!object-cover
                  [&_.ant-upload-list-item-thumbnail_img]:!rounded-full
                  [&_.anticon]:!text-3xl
                ">
                  {fileList.length < 1 && (
                    <div className="relative cursor-pointer group">
                      <CameraOutlined />
                      <div className="mt-4">Enviar Foto</div>
                    </div>
                  )}
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
            <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={isCreationPending || isUpdatePicturePending}>
              Criar Conta
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <Paragraph>
            Já tem uma conta?{' '}
            <Link to='/signIn'>Entrar</Link>
          </Paragraph>
          <Paragraph>
            <Link to='/'>Voltar para início</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}
