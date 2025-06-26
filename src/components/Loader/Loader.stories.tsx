import type { Meta, StoryObj } from '@storybook/react';
import { Loader, LoadingButton, LoadingOverlay } from './Loader';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de carregamento com diferentes variações e tamanhos.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do spinner',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Cor do spinner',
    },
    text: {
      control: { type: 'text' },
      description: 'Texto exibido junto ao spinner',
    },
    overlay: {
      control: { type: 'boolean' },
      description: 'Se deve ser exibido como overlay',
    },
    className: {
      control: { type: 'text' },
      description: 'Classes CSS adicionais',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithText: Story = {
  args: {
    text: 'Carregando dados...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    text: 'Carregando...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    text: 'Processando...',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    text: 'Salvando...',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    text: 'Erro ao carregar',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    text: 'Aguarde...',
  },
};

export const Overlay: Story = {
  args: {
    overlay: true,
    text: 'Carregando aplicação...',
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '300px', position: 'relative', backgroundColor: '#f8f9fa' }}>
        <div style={{ padding: '20px' }}>
          <h3>Conteúdo da página</h3>
          <p>Este é o conteúdo que ficará por baixo do overlay.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

// LoadingButton Stories
const buttonMeta: Meta<typeof LoadingButton> = {
  title: 'Components/LoadingButton',
  component: LoadingButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botão com estado de carregamento integrado.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: { type: 'boolean' },
      description: 'Se o botão está em estado de carregamento',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary'],
      description: 'Variante do botão',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'lg'],
      description: 'Tamanho do botão',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Se o botão está desabilitado',
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Tipo do botão',
    },
  },
};

export const ButtonDefault: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Clique aqui',
    loading: false,
  },
};

export const ButtonLoading: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Salvando...',
    loading: true,
  },
};

export const ButtonPrimary: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Salvar',
    variant: 'primary',
    loading: false,
  },
};

export const ButtonDanger: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Excluir',
    variant: 'danger',
    loading: false,
  },
};

export const ButtonSmall: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Pequeno',
    size: 'sm',
    loading: false,
  },
};

export const ButtonLarge: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Grande',
    size: 'lg',
    loading: false,
  },
};

export const ButtonDisabled: StoryObj<typeof LoadingButton> = {
  ...buttonMeta,
  args: {
    children: 'Desabilitado',
    disabled: true,
    loading: false,
  },
};

// LoadingOverlay Stories
const overlayMeta: Meta<typeof LoadingOverlay> = {
  title: 'Components/LoadingOverlay',
  component: LoadingOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Overlay de carregamento que pode ser aplicado sobre qualquer conteúdo.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: { type: 'boolean' },
      description: 'Se o overlay está ativo',
    },
    text: {
      control: { type: 'text' },
      description: 'Texto exibido no overlay',
    },
  },
};

export const OverlayDefault: StoryObj<typeof LoadingOverlay> = {
  ...overlayMeta,
  args: {
    loading: false,
    children: (
      <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '300px' }}>
        <h2>Conteúdo da Página</h2>
        <p>Este é o conteúdo que pode ser coberto pelo overlay de carregamento.</p>
        <button className="btn btn-primary">Botão de Exemplo</button>
      </div>
    ),
  },
};

export const OverlayLoading: StoryObj<typeof LoadingOverlay> = {
  ...overlayMeta,
  args: {
    loading: true,
    children: (
      <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '300px' }}>
        <h2>Conteúdo da Página</h2>
        <p>Este é o conteúdo que pode ser coberto pelo overlay de carregamento.</p>
        <button className="btn btn-primary">Botão de Exemplo</button>
      </div>
    ),
  },
};

export const OverlayCustomText: StoryObj<typeof LoadingOverlay> = {
  ...overlayMeta,
  args: {
    loading: true,
    text: 'Processando dados...',
    children: (
      <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '300px' }}>
        <h2>Conteúdo da Página</h2>
        <p>Este é o conteúdo que pode ser coberto pelo overlay de carregamento.</p>
        <button className="btn btn-primary">Botão de Exemplo</button>
      </div>
    ),
  },
};

