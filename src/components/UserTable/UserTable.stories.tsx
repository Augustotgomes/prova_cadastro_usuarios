import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UserTable } from './UserTable';
import { User } from '../../interfaces';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-01',
    birthDate: '1990-05-15',
    address: {
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 101',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'São Paulo',
      uf: 'SP',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(21) 88888-8888',
    cpf: '987.654.321-09',
    birthDate: '1985-12-03',
    address: {
      cep: '22071-900',
      street: 'Avenida Atlântica',
      number: '500',
      complement: '',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      uf: 'RJ',
    },
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(31) 77777-7777',
    cpf: '456.789.123-45',
    birthDate: '1988-08-20',
    address: {
      cep: '30112-000',
      street: 'Rua da Bahia',
      number: '1200',
      complement: 'Sala 301',
      neighborhood: 'Centro',
      city: 'Belo Horizonte',
      state: 'Minas Gerais',
      uf: 'MG',
    },
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(85) 66666-6666',
    cpf: '789.123.456-78',
    birthDate: '1992-11-10',
    address: {
      cep: '60160-230',
      street: 'Avenida Beira Mar',
      number: '800',
      complement: '',
      neighborhood: 'Meireles',
      city: 'Fortaleza',
      state: 'Ceará',
      uf: 'CE',
    },
    createdAt: '2023-01-04T00:00:00Z',
    updatedAt: '2023-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    phone: '(47) 55555-5555',
    cpf: '321.654.987-32',
    birthDate: '1987-03-25',
    address: {
      cep: '89010-100',
      street: 'Rua XV de Novembro',
      number: '600',
      complement: 'Loja 2',
      neighborhood: 'Centro',
      city: 'Blumenau',
      state: 'Santa Catarina',
      uf: 'SC',
    },
    createdAt: '2023-01-05T00:00:00Z',
    updatedAt: '2023-01-05T00:00:00Z',
  },
];

const meta: Meta<typeof UserTable> = {
  title: 'Components/UserTable',
  component: UserTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Tabela de usuários com funcionalidades de busca, paginação e ações CRUD.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    users: {
      description: 'Array de usuários para exibir na tabela',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento da tabela',
    },
    totalRows: {
      control: { type: 'number' },
      description: 'Total de registros (para paginação)',
    },
    currentPage: {
      control: { type: 'number' },
      description: 'Página atual',
    },
    perPage: {
      control: { type: 'number' },
      description: 'Registros por página',
    },
    searchTerm: {
      control: { type: 'text' },
      description: 'Termo de busca atual',
    },
  },
  args: {
    onEdit: fn(),
    onDelete: fn(),
    onView: fn(),
    onPageChange: fn(),
    onPerRowsChange: fn(),
    onSearchChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    users: mockUsers,
    loading: false,
    totalRows: mockUsers.length,
    currentPage: 1,
    perPage: 10,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    users: [],
    loading: true,
    totalRows: 0,
    currentPage: 1,
    perPage: 10,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    users: [],
    loading: false,
    totalRows: 0,
    currentPage: 1,
    perPage: 10,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithSearch: Story = {
  args: {
    users: mockUsers.filter(user => user.name.includes('João')),
    loading: false,
    totalRows: 1,
    currentPage: 1,
    perPage: 10,
    searchTerm: 'João',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const NoSearchResults: Story = {
  args: {
    users: [],
    loading: false,
    totalRows: 0,
    currentPage: 1,
    perPage: 10,
    searchTerm: 'Usuário Inexistente',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const SmallPerPage: Story = {
  args: {
    users: mockUsers.slice(0, 2),
    loading: false,
    totalRows: mockUsers.length,
    currentPage: 1,
    perPage: 2,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const SecondPage: Story = {
  args: {
    users: mockUsers.slice(2, 4),
    loading: false,
    totalRows: mockUsers.length,
    currentPage: 2,
    perPage: 2,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const SingleUser: Story = {
  args: {
    users: [mockUsers[0]],
    loading: false,
    totalRows: 1,
    currentPage: 1,
    perPage: 10,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const ManyUsers: Story = {
  args: {
    users: [...mockUsers, ...mockUsers.map(user => ({ ...user, id: user.id + '_copy' }))],
    loading: false,
    totalRows: mockUsers.length * 2,
    currentPage: 1,
    perPage: 10,
    searchTerm: '',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

