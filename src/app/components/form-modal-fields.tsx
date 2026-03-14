import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select } from "antd";
import type { ServiceData } from "../../http/types/service-data";

const { Option } = Select;

const availabilities = () => Array.from({ length: 24 }, (_, i) =>
    `${String(i).padStart(2, "0")}:00`
  );

interface FieldProps {
  name?: string;
  label?: string;
}
interface ServicesFieldProps extends FieldProps {
  serviceList?: ServiceData[]
}

interface FormButtonProps {
  loading: boolean;
  innerText?: string;
}

export const NameField = ({
  name = "name",
}: FieldProps) => (
  <Form.Item
    name={name}
    label="Nome"
    rules={[{ required: true, message: "Insira o nome" }]}
  >
    <Input placeholder="Digite seu nome" />
  </Form.Item>
);

export const EmailField = ({name = "email"}: FieldProps) => (
  <Form.Item
    name={name}
    label="Email"
    rules={[
      { required: true, message: "Insira o email" },
      { type: "email", message: "Email inválido" }
    ]}
  >
    <Input placeholder="john.doe@example.com" />
  </Form.Item>
);

export const PhoneField = ({name = "phone"}: FieldProps) => (
  <Form.Item
    name={name}
    label="Telefone"
    rules={[{ required: true, message: "Insira o telefone" }]}
  >
    <Input placeholder="(dd)xxxxx-yyyy" />
  </Form.Item>
);

export const AddressField = ({name = "address"}: FieldProps) => (
  <Form.Item
    name={name}
    label="Endereço"
    rules={[{ required: true, message: "Insira o endereço" }]}
  >
    <Input placeholder="Rua Getúlio Vargas, 99" />
  </Form.Item>
);

export const PasswordField = ({name = "password", label = "Senha"}: FieldProps) => (
  <Form.Item
    name={name}
    label={label}
    rules={[
      { required: true, message: 'Por favor, insira a senha' },
      { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
    ]}
    
  >
    <Input.Password 
      prefix={<LockOutlined />} 
      placeholder="Mínimo 6 caracteres"
    />
  </Form.Item>
)

export const AvailabilitiesField = ({name = "availabilities"}: FieldProps) => (
  <Form.Item
    name={name}
    label="Disponibilidades"
    rules={[
      { required: true, message: 'Por favor, insira ao menos um horário' },
    ]}
    
  >
    <Select
      mode="multiple"
      placeholder="Selecione as disponibilidades"
      optionFilterProp="children"
    >
      {availabilities().map(availability => (
        <Option key={availability} value={availability}>
          {availability}
        </Option>
      ))}
    </Select>
  </Form.Item>
)

export const ServicesField = ({ name = "servicesIds", serviceList }: ServicesFieldProps ) => (
  <Form.Item
    name={name}
    label="Serviços"
    rules={[{ required: true, message: 'Selecione pelo menos um serviço' }]}
  >
    <Select
      mode="multiple"
      placeholder="Selecione os serviços"
      optionFilterProp="children"
    >
      {serviceList?.map(service => (
          <Option key={service.id} value={service.id}>
            {service.title} - R$ {service.price}
          </Option>
        ))}
    </Select>
  </Form.Item>
)

export const TicketStatusField = ({name = "status"}: FieldProps) => (
  <Form.Item
    name={name}
    label="Status"
    rules={[{ required: true, message: 'Selecione um status' }]}
  >
    <Select placeholder="Selecione o status">
      <Option value="aberto">Aberto</Option>
      <Option value="em_atendimento">Em atendimento</Option>
      <Option value="encerrado">Encerrado</Option>
    </Select>
  </Form.Item>
)

export const TitleField = ({
  name = "title",
}: FieldProps) => (
  <Form.Item
    name={name}
    label="Título"
    rules={[{ required: true, message: "Insira o título" }]}
  >
    <Input placeholder="Digite o título" />
  </Form.Item>
);

export const PriceField = ({
  name = "price",
}: FieldProps) => (
  <Form.Item
    name={name}
    label="Preço (R$)"
    rules={[{ required: true, message: 'Por favor, insira o preço' }]}
  >
    <InputNumber
      style={{ width: '100%' }}
      min={0}
      precision={2}
      formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={value => value!.replace(/R\$\s?|(,*)/g, '') as any}
    />
  </Form.Item>
);

export const ConfirmButton = ({ loading, innerText = "Confirmar" }: FormButtonProps) => (
  <Form.Item className="!mb-0">
    <Button loading={loading} type="primary" htmlType="submit" block>
      {innerText}
    </Button>
  </Form.Item>
)