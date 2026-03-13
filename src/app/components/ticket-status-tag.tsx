import { Tag } from "antd";

interface TicketStatusProps {
  status: string;
}

export function TicketStatusTag ({ status }: TicketStatusProps) {
  let color = 'blue';
  if (status === 'em_atendimento') color = 'orange';
  if (status === 'encerrado') color = 'red';
  return <Tag color={color}>{status}</Tag>;
}