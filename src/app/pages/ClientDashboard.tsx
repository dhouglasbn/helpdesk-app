import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Table, Tag, Modal, Form, message, Typography, Select, Card, Avatar } from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from '../components/logout-button';
import { UserProfile } from '../components/user-profile';
import { useClientTicketHistory } from "../../http/use-client-ticket-history";
import type { ServiceData } from '../../http/types/service-data';
import { useListServices } from '../../http/use-list-services';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateTicket } from '../../http/use-create-ticket';
import type { techInTicketData } from '../../http/types/ticket-data';
import { env } from '../../env';
import { useListTechs } from '../../http/use-list-techs';


const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select

const createTicketSchema = z.object({
  techId: z.string(),
  servicesIds: z.array(z.coerce.string())
})

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export default function ClientDashboard() {
  const { data: clientTicketHistory, isPending } = useClientTicketHistory();
  const { data: servicesList } = useListServices();
  const { data: techList } = useListTechs();
  const { mutateAsync: createTicket } = useCreateTicket();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('tickets');
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [form] = Form.useForm<CreateTicketFormData>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || user?.role !== "client") {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  const handleCreateTicket = async ({ techId, servicesIds }: CreateTicketFormData) => {
    await createTicket({techId, servicesIds});

    message.success('Chamado criado com sucesso!')
    form.resetFields();
    setIsCreateTicketModalOpen(false);
  };

  const calculateTicketTotal = (serviceIds: string[]) => {
    return String(serviceIds.reduce((total, id) => {
      const service = servicesList?.find(s => s.id === id);
      return total + (Number(service?.price) || 0);
    }, 0));
  };

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }

  const columns = [
    {
      title: 'Serviços',
      dataIndex: 'services',
      key: 'services',
      width: 450,
      render: (services: ServiceData[]) => (
        <>
          {services.map(service => {
            return service ? <Tag key={service.id}>{service.title}</Tag> : null;
          })}
        </>
      ),
    },
    {
      title: 'Técnico',
      dataIndex: 'tech',
      key: 'tech.id',
      render: (tech: techInTicketData) => (
        <div className='flex gap-2'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${tech.picturePath}`}
          />
          <p className='font-medium p-2'>{tech.name}</p>
        </div>
      )
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: string) => `R$ ${price}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Em atendimento') color = 'orange';
        if (status === 'Encerrado') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => {
        const date = new Date(value);

        const time = date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const day = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        });

        return `${time} ${day}`
      },
    },
  ];

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
            {selectedMenu === 'tickets' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <Title level={2} className="!m-0">Meus Chamados</Title>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setIsCreateTicketModalOpen(true)}
                    size="large"
                  >
                    Criar Chamado
                  </Button>
                </div>
                
                {
                  !isPending && <Table 
                    columns={columns} 
                    dataSource={clientTicketHistory} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                }

                <Modal
                  title="Criar Novo Ticket"
                  open={isCreateTicketModalOpen}
                  onCancel={() => {
                    setIsCreateTicketModalOpen(false);
                    form.resetFields();
                  }}
                  footer={null}
                  width={600}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateTicket}
                  >
                    <Form.Item
                      name="techId"
                      label="Técnico responsável"
                      rules={[{ required: true, message: 'Selecione pelo um técnico' }]}
                    >
                      <Select
                        placeholder="Selecione um técnico"
                      >
                        {techList?.map(tech => (
                          <Option key={tech.id} value={tech.id}>
                            <div className='flex gap-2'>
                              <Avatar
                                size={50}
                                src={`${env.VITE_API_URL}${tech.picturePath}`}
                              />
                              <Paragraph className='font-medium text-center p-3'>{tech.name}</Paragraph>
                            </div>
                            <Paragraph>Email: <strong>{tech.email}</strong></Paragraph>
                            <Paragraph>Telefone: <strong>{showPhoneNumber(tech.phone)}</strong></Paragraph>
                            <Paragraph className='m-0'>Disponibilidades:</Paragraph>
                            <div className='flex gap-2'>
                              {tech.availabilities?.map(availability => <Tag color='green' key={availability}>{availability}</Tag>)}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="servicesIds"
                      label="Serviços Necessários"
                      rules={[{ required: true, message: 'Selecione pelo menos um serviço' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Selecione os serviços"
                        optionFilterProp="children"
                      >
                        {servicesList?.map(service => (
                          <Option key={service.id} value={service.id}>
                            {service.title} - R$ {service.price}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => prevValues.servicesIds !== currentValues.servicesIds}
                    >
                      {({ getFieldValue }) => {
                        const selectedServices = getFieldValue('servicesIds') || [];
                        const total = calculateTicketTotal(selectedServices)
                        return total !== "0" ? (
                          <Card size="small" className="mb-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <span><DollarOutlined /> Total Estimado:</span>
                              <strong className="text-lg text-blue-500">R$ {total}</strong>
                            </div>
                          </Card>
                        ) : null;
                      }}
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Button type="primary" htmlType="submit" block size="large">
                        Criar Ticket
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            )}

            {selectedMenu === 'profile' && <UserProfile user={user} />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
