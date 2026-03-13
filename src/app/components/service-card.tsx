import { Card, Descriptions, Space, Tag, Typography } from "antd";
import { TicketStatusTag } from "./ticket-status-tag";
import type { TechTicketListData } from "../../http/types/ticket-data";

const { Text } = Typography

interface ServiceCardProps {
  ticket: TechTicketListData;
}

export function ServiceCard({ ticket }: ServiceCardProps) {
  return (
    <Card size="small" className="mb-4">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Cliente">
          <Text strong>{ticket.client.name}</Text>
        </Descriptions.Item>
    
        <Descriptions.Item label="Serviços">
          <Space wrap>
            {ticket.services.map((service) =>
              service ? <Tag key={service.id}>{service.title}</Tag> : null
            )}
          </Space>
        </Descriptions.Item>
    
        <Descriptions.Item label="Total">
          <Text strong>R$ {ticket.totalPrice}</Text>
        </Descriptions.Item>
    
        <Descriptions.Item label="Status">
          <TicketStatusTag status={ticket.status} />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}