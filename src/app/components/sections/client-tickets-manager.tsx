import { DollarOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, message, Modal, Table, Tag, Typography, Select, Space, Card } from "antd";
import { useState } from "react";
import { useClientTicketHistory } from "../../../http/use-client-ticket-history";
import { TicketStatusTag } from "../ticket-status-tag";
import type { ServiceData } from "../../../http/types/service-data";
import type { UserInTicketData } from "../../../http/types/ticket-data";
import { useListTechs } from "../../../http/use-list-techs";
import { env } from "../../../env";
import type { UserData } from "../../../http/types/userData";
import { z } from 'zod'
import { useCreateTicket } from "../../../http/use-create-ticket";
import { useListServices } from "../../../http/use-list-services";
import { TechInfoModal } from "../tech-info-modal";


const { Title, Paragraph } = Typography;
const { Option } = Select;

const createTicketSchema = z.object({
  techId: z.string(),
  servicesIds: z.array(z.coerce.string())
})

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export function ClientTicketManager() {
  const { data: techList } = useListTechs();
  const { data: clientTicketHistory, isPending } = useClientTicketHistory();
  const { data: servicesList } = useListServices();
  const { mutateAsync: createTicket } = useCreateTicket();
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<UserData | null>(null);
  const [form] = Form.useForm<CreateTicketFormData>();

  const showPhoneNumber = (phoneNumber: string) => {
    return `(${phoneNumber.slice(0,2)})${phoneNumber.slice(2,7)}-${phoneNumber.slice(7, 11)}`
  }

  const calculateTicketTotal = (serviceIds: string[]) => {
    return String(serviceIds.reduce((total, id) => {
      const service = servicesList?.find(s => s.id === id);
      return total + (Number(service?.price) || 0);
    }, 0));
  };

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
      render: (tech: UserInTicketData) => (
        <Button
          onClick={() => {
            const techInfo = techList?.find(t => t.id === tech.id);
            if(!techInfo) return;
            setSelectedTech(techInfo)
          }} 
          className='flex gap-2 !items-center !p-0 !border-0 !bg-transparent !shadow-none !h-auto'>
          <Avatar
            size={40}
            src={`${env.VITE_API_URL}${tech.picturePath}`}
          />
          <span className='font-medium p-2'>{tech.name}</span>
        </Button>
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
      render: (status: string) => <TicketStatusTag status={status} />,
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

        return <div className="flex flex-col items-center gap-0">
          <Paragraph className="!m-0">{time}</Paragraph>
          <Paragraph className="!m-0">{day}</Paragraph>
        </div>
      },
    },
  ];

  const handleCreateTicket = async ({ techId, servicesIds }: CreateTicketFormData) => {
    await createTicket({techId, servicesIds});

    message.success('Chamado criado com sucesso!')
    form.resetFields();
    setIsCreateTicketModalOpen(false);
  };
  
  return (
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
                          <Option key={tech.id} value={tech.id} label={tech.name}>
                            <Space direction="vertical" size={6} style={{ width: "100%" }}>
                              
                              {/* Header */}
                              <Space align="center">
                                <Avatar
                                  size={40}
                                  src={`${env.VITE_API_URL}${tech.picturePath}`}
                                />
                                <Typography.Text strong>
                                  {tech.name}
                                </Typography.Text>
                              </Space>

                              {/* Informações */}
                              <Typography.Text type="secondary">
                                {tech.email}
                              </Typography.Text>

                              <Typography.Text type="secondary">
                                {showPhoneNumber(tech.phone)}
                              </Typography.Text>

                              {/* Disponibilidades */}
                              <Space wrap>
                                {tech.availabilities?.map((availability) => (
                                  <Tag color="green" key={availability}>
                                    {availability}
                                  </Tag>
                                ))}
                              </Space>

                            </Space>
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
                <TechInfoModal
                  isTechInfoModalOpen={!!selectedTech}
                  onCancel={() => setSelectedTech(null)}
                  tech={selectedTech}
                />
              </>
  )
}