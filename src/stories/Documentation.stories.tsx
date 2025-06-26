import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Documentation/Overview',
  component: () => null, // Add a dummy component
  parameters: {
    docs: {
      page: () => (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>Sistema de Cadastro de Usuários</h1>
          
          <h2>Visão Geral</h2>
          <p>
            Este é um sistema completo de cadastro de usuários desenvolvido em React com TypeScript,
            seguindo os princípios da Arquitetura Limpa e boas práticas de desenvolvimento frontend.
          </p>

          <h2>Tecnologias Utilizadas</h2>
          <ul>
            <li><strong>React 19</strong> - Biblioteca principal para construção da interface</li>
            <li><strong>TypeScript</strong> - Tipagem estática para maior segurança</li>
            <li><strong>Bootstrap 5</strong> - Framework CSS para estilização</li>
            <li><strong>React Bootstrap</strong> - Componentes Bootstrap para React</li>
            <li><strong>Formik + Yup</strong> - Gerenciamento e validação de formulários</li>
            <li><strong>Axios</strong> - Cliente HTTP para requisições à API</li>
            <li><strong>React Data Table Component</strong> - Tabela com funcionalidades avançadas</li>
            <li><strong>Context API</strong> - Gerenciamento de estado global</li>
            <li><strong>React Testing Library</strong> - Testes de componentes</li>
            <li><strong>Vitest</strong> - Framework de testes</li>
            <li><strong>Storybook</strong> - Documentação de componentes</li>
          </ul>

          <h2>Arquitetura do Projeto</h2>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
{`/src
├── components/          # Componentes reutilizáveis
│   ├── ModalUser/      # Modal para CRUD de usuários
│   ├── UserTable/      # Tabela de usuários
│   └── Loader/         # Componentes de carregamento
├── context/            # Context API para estado global
├── interfaces/         # Definições de tipos TypeScript
├── services/           # Serviços e utilitários
├── hooks/              # Hooks customizados (opcional)
├── App.tsx            # Componente principal
└── main.tsx           # Ponto de entrada`}
          </pre>

          <h2>Funcionalidades Principais</h2>
          
          <h3>✅ CRUD Completo</h3>
          <ul>
            <li>Criar novos usuários</li>
            <li>Visualizar detalhes dos usuários</li>
            <li>Editar informações existentes</li>
            <li>Excluir usuários com confirmação</li>
          </ul>

          <h3>✅ Integração ViaCEP</h3>
          <ul>
            <li>Preenchimento automático de endereço via CEP</li>
            <li>Validação de formato de CEP</li>
            <li>Tratamento de erros da API</li>
          </ul>

          <h3>✅ Validação Robusta</h3>
          <ul>
            <li>Validação de CPF com algoritmo oficial</li>
            <li>Validação de e-mail</li>
            <li>Validação de telefone</li>
            <li>Campos obrigatórios</li>
            <li>Formatação automática de campos</li>
          </ul>

          <h3>✅ Interface Responsiva</h3>
          <ul>
            <li>Design adaptável para desktop, tablet e mobile</li>
            <li>Componentes Bootstrap otimizados</li>
            <li>Experiência de usuário consistente</li>
          </ul>

          <h3>✅ Funcionalidades Avançadas</h3>
          <ul>
            <li>Busca em tempo real</li>
            <li>Paginação configurável</li>
            <li>Ordenação de colunas</li>
            <li>Estados de carregamento</li>
            <li>Tratamento de erros</li>
          </ul>

          <h2>Padrões de Desenvolvimento</h2>
          
          <h3>Arquitetura Limpa</h3>
          <p>
            O projeto segue os princípios da Arquitetura Limpa com separação clara de responsabilidades:
          </p>
          <ul>
            <li><strong>Components</strong> - Responsáveis apenas pela UI</li>
            <li><strong>Services</strong> - Lógica de negócio e integração com APIs</li>
            <li><strong>Interfaces</strong> - Contratos e tipagem</li>
            <li><strong>Context</strong> - Gerenciamento de estado global</li>
          </ul>

          <h3>Componentização</h3>
          <p>
            Todos os componentes são:
          </p>
          <ul>
            <li>Reutilizáveis e modulares</li>
            <li>Bem tipados com TypeScript</li>
            <li>Testados com React Testing Library</li>
            <li>Documentados com Storybook</li>
          </ul>

          <h2>Testes</h2>
          <p>
            O projeto inclui testes abrangentes para:
          </p>
          <ul>
            <li>Componentes React</li>
            <li>Context API</li>
            <li>Funções utilitárias</li>
            <li>Validações de formulário</li>
            <li>Interações do usuário</li>
          </ul>

          <h2>Como Usar</h2>
          
          <h3>Desenvolvimento</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
{`# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Executar testes
pnpm test

# Executar Storybook
pnpm storybook`}
          </pre>

          <h3>Produção</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
{`# Build para produção
pnpm build

# Preview do build
pnpm preview`}
          </pre>

          <h2>Estrutura de Dados</h2>
          <p>
            O sistema trabalha com a seguinte estrutura de usuário:
          </p>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
{`interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    uf: string;
  };
  createdAt: string;
  updatedAt: string;
}`}
          </pre>

          <h2>Próximos Passos</h2>
          <p>
            Possíveis melhorias e funcionalidades futuras:
          </p>
          <ul>
            <li>Integração com backend real</li>
            <li>Autenticação e autorização</li>
            <li>Upload de foto do usuário</li>
            <li>Exportação de dados (PDF, Excel)</li>
            <li>Filtros avançados</li>
            <li>Histórico de alterações</li>
            <li>Notificações em tempo real</li>
          </ul>
        </div>
      ),
    },
  },
};

export default meta;

export const ProjectOverview = {};

