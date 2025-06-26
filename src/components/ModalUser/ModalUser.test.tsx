import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModalUser } from './ModalUser';
import { UserProvider } from '../../context';
import { userService } from '../../services';

// Mock the services
vi.mock('../../services', () => ({
  userService: {
    getUserById: vi.fn(),
  },
  viaCepService: {
    getAddressByCep: vi.fn(),
    validateCep: vi.fn(),
    formatCep: vi.fn(),
  },
  formatCpf: vi.fn((cpf) => cpf),
  formatPhone: vi.fn((phone) => phone),
  formatCep: vi.fn((cep) => cep),
  onlyNumbers: vi.fn((value) => value.replace(/\D/g, '')),
}));

// Mock the hooks
vi.mock('../../hooks', () => ({
  useUserOperations: () => ({
    createUser: vi.fn(),
    editUser: vi.fn(),
  }),
  useViaCep: () => ({
    searchAddress: vi.fn(),
  }),
}));

const mockUser = {
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
};

const defaultProps = {
  show: true,
  mode: 'create' as const,
  onHide: vi.fn(),
  onSuccess: vi.fn(),
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <UserProvider>
      {component}
    </UserProvider>
  );
};

describe('ModalUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create modal with correct title', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="create" />);
    
    expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
  });

  it('renders edit modal with correct title', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="edit" userId="1" />);
    
    expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
  });

  it('renders view modal with correct title', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="view" userId="1" />);
    
    expect(screen.getByText('Visualizar Usuário')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    renderWithProvider(<ModalUser {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Novo Usuário')).not.toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    // Personal data fields
    expect(screen.getByLabelText('Nome Completo *')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail *')).toBeInTheDocument();
    expect(screen.getByLabelText('CPF *')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefone *')).toBeInTheDocument();
    expect(screen.getByLabelText('Data de Nascimento *')).toBeInTheDocument();
    
    // Address fields
    expect(screen.getByLabelText('CEP *')).toBeInTheDocument();
    expect(screen.getByLabelText('Logradouro *')).toBeInTheDocument();
    expect(screen.getByLabelText('Número *')).toBeInTheDocument();
    expect(screen.getByLabelText('Complemento')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro *')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade *')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado *')).toBeInTheDocument();
    expect(screen.getByLabelText('UF *')).toBeInTheDocument();
  });

  it('renders section headers', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    expect(screen.getByText('Dados Pessoais')).toBeInTheDocument();
    expect(screen.getByText('Endereço')).toBeInTheDocument();
  });

  it('renders action buttons for create mode', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="create" />);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Criar Usuário')).toBeInTheDocument();
  });

  it('renders action buttons for edit mode', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="edit" userId="1" />);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
  });

  it('renders only close button for view mode', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="view" userId="1" />);
    
    expect(screen.getByText('Fechar')).toBeInTheDocument();
    expect(screen.queryByText('Salvar Alterações')).not.toBeInTheDocument();
  });

  it('calls onHide when cancel button is clicked', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
  });

  it('calls onHide when close button is clicked', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
  });

  it('loads user data for edit mode', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser);
    
    renderWithProvider(<ModalUser {...defaultProps} mode="edit" userId="1" />);
    
    await waitFor(() => {
      expect(userService.getUserById).toHaveBeenCalledWith('1');
    });
  });

  it('shows loading state when loading user data', () => {
    vi.mocked(userService.getUserById).mockImplementation(() => new Promise(() => {}));
    
    renderWithProvider(<ModalUser {...defaultProps} mode="edit" userId="1" />);
    
    expect(screen.getByText('Carregando dados do usuário...')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const submitButton = screen.getByText('Criar Usuário');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const emailInput = screen.getByLabelText('E-mail *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText('E-mail deve ter um formato válido')).toBeInTheDocument();
    });
  });

  it('validates CPF format', async () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const cpfInput = screen.getByLabelText('CPF *');
    fireEvent.change(cpfInput, { target: { value: '123' } });
    fireEvent.blur(cpfInput);
    
    await waitFor(() => {
      expect(screen.getByText('CPF deve ter o formato XXX.XXX.XXX-XX')).toBeInTheDocument();
    });
  });

  it('validates phone format', async () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const phoneInput = screen.getByLabelText('Telefone *');
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);
    
    await waitFor(() => {
      expect(screen.getByText('Telefone deve ter o formato (XX) XXXXX-XXXX')).toBeInTheDocument();
    });
  });

  it('validates CEP format', async () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const cepInput = screen.getByLabelText('CEP *');
    fireEvent.change(cepInput, { target: { value: '123' } });
    fireEvent.blur(cepInput);
    
    await waitFor(() => {
      expect(screen.getByText('CEP deve ter o formato XXXXX-XXX')).toBeInTheDocument();
    });
  });

  it('makes fields readonly in view mode', () => {
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser);
    
    renderWithProvider(<ModalUser {...defaultProps} mode="view" userId="1" />);
    
    waitFor(() => {
      const nameInput = screen.getByLabelText('Nome Completo *');
      expect(nameInput).toHaveAttribute('readonly');
    });
  });

  it('allows editing fields in create mode', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="create" />);
    
    const nameInput = screen.getByLabelText('Nome Completo *');
    expect(nameInput).not.toHaveAttribute('readonly');
  });

  it('allows editing fields in edit mode', () => {
    renderWithProvider(<ModalUser {...defaultProps} mode="edit" userId="1" />);
    
    const nameInput = screen.getByLabelText('Nome Completo *');
    expect(nameInput).not.toHaveAttribute('readonly');
  });

  it('formats UF input to uppercase', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const ufInput = screen.getByLabelText('UF *');
    fireEvent.change(ufInput, { target: { value: 'sp' } });
    
    expect(ufInput).toHaveValue('SP');
  });

  it('limits UF input to 2 characters', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const ufInput = screen.getByLabelText('UF *');
    expect(ufInput).toHaveAttribute('maxLength', '2');
  });

  it('limits CPF input to 14 characters', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const cpfInput = screen.getByLabelText('CPF *');
    expect(cpfInput).toHaveAttribute('maxLength', '14');
  });

  it('limits phone input to 15 characters', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const phoneInput = screen.getByLabelText('Telefone *');
    expect(phoneInput).toHaveAttribute('maxLength', '15');
  });

  it('limits CEP input to 9 characters', () => {
    renderWithProvider(<ModalUser {...defaultProps} />);
    
    const cepInput = screen.getByLabelText('CEP *');
    expect(cepInput).toHaveAttribute('maxLength', '9');
  });
});

