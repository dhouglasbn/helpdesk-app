import { Button, Form, message, Popconfirm, Space, Switch, Table, Tag, Typography } from "antd";
import type { ServiceData } from "../../../http/types/service-data";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useModal } from "../../hooks/use-modal";
import { z } from 'zod'
import { useCreateService } from '../../../http/use-create-service'
import { FormModal } from "../form-modal";
import { ConfirmButton, PriceField, TitleField } from "../form-modal-fields";
import { useDeactivateService } from '../../../http/use-deactivate-service'

const { Title } = Typography

const serviceSchema = z.object({
	title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
	price: z.number().min(0, "O preço deve ser um número positivo"),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface AdminServiceManagerProps {
  serviceList?: ServiceData[];
}

export function AdminServiceManager({serviceList}: AdminServiceManagerProps) {
  const { mutateAsync: createService, isPending: isCreationPending } = useCreateService();
  const { mutateAsync: deactivateService, isPending: isDeactivationPending } = useDeactivateService();
  const createServiceModal = useModal();
  const editServiceModal = useModal();
  
  const [serviceForm] = Form.useForm<ServiceFormData>();

  const columns = [
    { title: 'Título', dataIndex: 'title', key: 'title' },
    { 
      title: 'Preço', 
      dataIndex: 'price', 
      key: 'price',
      render: (price: number) => `R$ ${price}`
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => <Tag 
        className="font-medium !text-sm" 
        color='blue'>{active ? 'Ativo' : 'Desativado'}
      </Tag>,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, service: ServiceData) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              serviceForm.setFieldsValue({
                title: service.title,
                price: Number(service.price)
              });
              editServiceModal.openModal()
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Desativar serviço"
            description="Tem certeza que deseja desativar este serviço?"
            onConfirm={() => handleDeactivateService(service.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Desativar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCreateService = async ({title, price}: ServiceFormData) => {
    await createService({title, price});

    message.success("Serviço Criado!")
    serviceForm.resetFields()
    createServiceModal.closeModal()
  }

  const handleDeactivateService = async (serviceId: string) => {
    await deactivateService({serviceId});
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!m-0">Gerenciar Serviços</Title>
        <Button
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            createServiceModal.openModal()
          }}
          size="large"
        >
          Adicionar Serviço
        </Button>
      </div>
      
      <Table
        columns={columns} 
        dataSource={serviceList} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <FormModal
        title='Adicionar Serviço'
        open={createServiceModal.open}
        onCancel={() => {
          createServiceModal.closeModal()
          serviceForm.resetFields();
        }}
        onFinish={handleCreateService}
        form={serviceForm}
      >
        <TitleField />
        <PriceField />
        <ConfirmButton loading={isCreationPending} />
      </FormModal>
    </>
  )
}