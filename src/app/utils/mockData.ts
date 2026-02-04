import { User, Service, Ticket } from '@/app/App';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@client.com',
    role: 'client',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@tech.com',
    role: 'technician',
    phone: '(11) 91234-5678'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@tech.com',
    role: 'technician',
    phone: '(11) 95555-1234'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@helpdesk.com',
    role: 'admin'
  }
];

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Instalação de Software',
    description: 'Instalação e configuração de softwares',
    price: 150,
    active: true
  },
  {
    id: 's2',
    name: 'Manutenção de Hardware',
    description: 'Reparo e manutenção de equipamentos',
    price: 200,
    active: true
  },
  {
    id: 's3',
    name: 'Suporte Remoto',
    description: 'Atendimento remoto para resolução de problemas',
    price: 100,
    active: true
  },
  {
    id: 's4',
    name: 'Configuração de Rede',
    description: 'Configuração de redes e dispositivos',
    price: 250,
    active: true
  },
  {
    id: 's5',
    name: 'Backup de Dados',
    description: 'Serviço de backup e recuperação',
    price: 180,
    active: false
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 't1',
    clientId: '1',
    technicianId: '2',
    services: ['s1', 's3'],
    status: 'Em atendimento',
    createdAt: '2026-01-20T10:00:00',
    description: 'Preciso instalar um novo sistema e suporte para configuração'
  },
  {
    id: 't2',
    clientId: '1',
    technicianId: '3',
    services: ['s2'],
    status: 'Aberto',
    createdAt: '2026-01-25T14:30:00',
    description: 'Computador apresentando problemas de hardware'
  },
  {
    id: 't3',
    clientId: '1',
    technicianId: '2',
    services: ['s4'],
    status: 'Encerrado',
    createdAt: '2026-01-15T09:00:00',
    description: 'Configuração da rede sem fio'
  }
];
