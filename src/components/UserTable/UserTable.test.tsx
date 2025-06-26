import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserTable } from './UserTable';
import { User } from '../../interfaces';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
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
    email: 'maria@email.com',
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
];

const defaultProps = {
  users: mockUsers,
  loading: false,
  totalRows: 2,
  currentPage: 1,
  perPage: 10,
  searchTerm: '',
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onView: vi.fn(),
  onPageChange: vi.fn(),
  onPerRowsChange: vi.fn(),
  onSearchChange: vi.fn(),
};

describe('UserTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user data correctly', () => {
    render(<UserTable {...defaultProps} />);
    
    // Check if user names are displayed
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    
    // Check if emails are displayed
    expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('maria@email.com')).toBeInTheDocument();
    
    // Check if formatted CPFs are displayed
    expect(screen.getByText('123.456.789-01')).toBeInTheDocument();
    expect(screen.getByText('987.654.321-09')).toBeInTheDocument();
    
    // Check if formatted phones are displayed
    expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    expect(screen.getByText('(21) 88888-8888')).toBeInTheDocument();
    
    // Check if cities and UFs are displayed
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('RJ')).toBeInTheDocument();
    
    // Check if formatted birth dates are displayed
    expect(screen.getByText('15/05/1990')).toBeInTheDocument();
    expect(screen.getByText('03/12/1985')).toBeInTheDocument();
  });

  it('displays search input with correct placeholder', () => {
    render(<UserTable {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome, email, CPF ou telefone...');
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    render(<UserTable {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome, email, CPF ou telefone...');
    fireEvent.change(searchInput, { target: { value: 'João' } });
    
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('João');
  });

  it('shows clear search button when search term exists', () => {
    render(<UserTable {...defaultProps} searchTerm="João" />);
    
    const clearButton = screen.getByTitle('Limpar busca');
    expect(clearButton).toBeInTheDocument();
  });

  it('calls onSearchChange with empty string when clear button is clicked', () => {
    render(<UserTable {...defaultProps} searchTerm="João" />);
    
    const clearButton = screen.getByTitle('Limpar busca');
    fireEvent.click(clearButton);
    
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
  });

  it('displays correct pagination info', () => {
    render(<UserTable {...defaultProps} />);
    
    expect(screen.getByText('Mostrando 1 a 2 de 2 registros')).toBeInTheDocument();
  });

  it('displays filtered pagination info when search is active', () => {
    render(<UserTable {...defaultProps} searchTerm="João" totalRows={1} />);
    
    expect(screen.getByText('Mostrando 1 a 1 de 1 registros (filtrados)')).toBeInTheDocument();
  });

  it('renders action buttons for each user', () => {
    render(<UserTable {...defaultProps} />);
    
    // Should have 2 sets of action buttons (view, edit, delete) for 2 users
    const viewButtons = screen.getAllByTitle('Visualizar');
    const editButtons = screen.getAllByTitle('Editar');
    const deleteButtons = screen.getAllByTitle('Excluir');
    
    expect(viewButtons).toHaveLength(2);
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onView when view button is clicked', () => {
    render(<UserTable {...defaultProps} />);
    
    const viewButtons = screen.getAllByTitle('Visualizar');
    fireEvent.click(viewButtons[0]);
    
    expect(defaultProps.onView).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<UserTable {...defaultProps} />);
    
    const editButtons = screen.getAllByTitle('Editar');
    fireEvent.click(editButtons[0]);
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<UserTable {...defaultProps} />);
    
    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('shows loading state', () => {
    render(<UserTable {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Carregando usuários...')).toBeInTheDocument();
  });

  it('shows no data message when users array is empty', () => {
    render(<UserTable {...defaultProps} users={[]} totalRows={0} />);
    
    expect(screen.getByText('Nenhum usuário cadastrado')).toBeInTheDocument();
    expect(screen.getByText('Clique em "Novo Usuário" para começar')).toBeInTheDocument();
  });

  it('shows no results message when search returns no results', () => {
    render(<UserTable {...defaultProps} users={[]} totalRows={0} searchTerm="NonExistent" />);
    
    expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
    expect(screen.getByText('Tente ajustar os termos de busca')).toBeInTheDocument();
  });

  it('displays table headers correctly', () => {
    render(<UserTable {...defaultProps} />);
    
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('CPF')).toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
    expect(screen.getByText('Cidade/UF')).toBeInTheDocument();
    expect(screen.getByText('Data Nascimento')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
  });

  it('handles pagination controls', () => {
    render(<UserTable {...defaultProps} />);
    
    // Check if pagination controls are present
    expect(screen.getByLabelText('First Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Page')).toBeInTheDocument();
  });

  it('displays rows per page selector', () => {
    render(<UserTable {...defaultProps} />);
    
    expect(screen.getByText('Linhas por página:')).toBeInTheDocument();
  });
});

