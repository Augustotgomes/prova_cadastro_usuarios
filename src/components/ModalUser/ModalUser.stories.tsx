import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ModalUser } from './ModalUser';
import { UserProvider } from '../../context';

const meta: Meta<typeof ModalUser> = {
  title: 'Components/ModalUser',
  component: ModalUser,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Modal para criação, edição e visualização de usuários com validação de formulário e integração ViaCEP.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    show: {
      control: { type: 'boolean' },
      description: 'Se o modal está visível',
    },
    mode: {
      control: { type: 'select' },
      options: ['create', 'edit', 'view'],
      description: 'Modo do modal',
    },
    userId: {
      control: { type: 'text' },
      description: 'ID do usuário (para modos edit e view)',
    },
  },
  args: {
    onHide: fn(),
    onSuccess: fn(),
  },
  decorators: [
    (Story) => (
      <UserProvider>
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
          <h1>Sistema de Cadastro de Usuários</h1>
          <p>Este é o conteúdo da página principal. O modal aparecerá sobre este conteúdo.</p>
          <Story />
        </div>
      </UserProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {
  args: {
    show: true,
    mode: 'create',
  },
};

export const CreateModeHidden: Story = {
  args: {
    show: false,
    mode: 'create',
  },
};

export const EditMode: Story = {
  args: {
    show: true,
    mode: 'edit',
    userId: '1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal em modo de edição. Carrega os dados do usuário automaticamente.',
      },
    },
  },
};

export const ViewMode: Story = {
  args: {
    show: true,
    mode: 'view',
    userId: '1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal em modo de visualização. Todos os campos ficam somente leitura.',
      },
    },
  },
};

// Exemplo com diferentes estados de carregamento
export const LoadingUserData: Story = {
  args: {
    show: true,
    mode: 'edit',
    userId: 'loading-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal mostrando estado de carregamento dos dados do usuário.',
      },
    },
  },
};

// Exemplo com erro ao carregar dados
export const ErrorLoadingUser: Story = {
  args: {
    show: true,
    mode: 'edit',
    userId: 'error-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal mostrando erro ao carregar dados do usuário.',
      },
    },
  },
};

// Exemplo com formulário preenchido (modo create)
export const CreateWithSampleData: Story = {
  args: {
    show: true,
    mode: 'create',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal de criação com dados de exemplo para demonstrar validação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Simula preenchimento de dados para demonstração
    const canvas = canvasElement;
    const nameInput = canvas.querySelector('input[name="name"]') as HTMLInputElement;
    const emailInput = canvas.querySelector('input[name="email"]') as HTMLInputElement;
    const cpfInput = canvas.querySelector('input[name="cpf"]') as HTMLInputElement;
    
    if (nameInput) nameInput.value = 'João Silva';
    if (emailInput) emailInput.value = 'joao.silva@email.com';
    if (cpfInput) cpfInput.value = '123.456.789-01';
  },
};

// Exemplo com validação de erro
export const ValidationErrors: Story = {
  args: {
    show: true,
    mode: 'create',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal mostrando erros de validação nos campos obrigatórios.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Simula tentativa de submissão com campos vazios
    const canvas = canvasElement;
    const submitButton = canvas.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (submitButton) {
      submitButton.click();
    }
  },
};

// Exemplo com CEP preenchido automaticamente
export const AutoFilledAddress: Story = {
  args: {
    show: true,
    mode: 'create',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal demonstrando preenchimento automático do endereço via CEP.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Simula preenchimento do CEP para demonstrar auto-complete
    const canvas = canvasElement;
    const cepInput = canvas.querySelector('input[name="address.cep"]') as HTMLInputElement;
    
    if (cepInput) {
      cepInput.value = '01310-100';
      cepInput.dispatchEvent(new Event('blur', { bubbles: true }));
    }
  },
};

// Exemplo responsivo (mobile)
export const MobileView: Story = {
  args: {
    show: true,
    mode: 'create',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Modal otimizado para visualização em dispositivos móveis.',
      },
    },
  },
};

// Exemplo com todos os campos preenchidos
export const FullyFilledForm: Story = {
  args: {
    show: true,
    mode: 'create',
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal com todos os campos preenchidos para demonstrar o formulário completo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Simula preenchimento completo do formulário
    const canvas = canvasElement;
    
    const fields = {
      'name': 'João Silva Santos',
      'email': 'joao.silva@email.com',
      'cpf': '123.456.789-01',
      'phone': '(11) 99999-9999',
      'birthDate': '1990-05-15',
      'address.cep': '01310-100',
      'address.street': 'Avenida Paulista',
      'address.number': '1000',
      'address.complement': 'Apto 101',
      'address.neighborhood': 'Bela Vista',
      'address.city': 'São Paulo',
      'address.state': 'São Paulo',
      'address.uf': 'SP',
    };
    
    Object.entries(fields).forEach(([name, value]) => {
      const input = canvas.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  },
};

