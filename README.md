# Sistema de Cadastro de Usuários

Um sistema completo de cadastro de usuários desenvolvido em React com TypeScript, seguindo os princípios da Arquitetura Limpa e boas práticas de desenvolvimento frontend.

## 🚀 Funcionalidades

### ✅ CRUD Completo
- **Criar** novos usuários com validação robusta
- **Visualizar** detalhes dos usuários em modal
- **Editar** informações existentes
- **Excluir** usuários com confirmação

### ✅ Integração ViaCEP
- Preenchimento automático de endereço via CEP
- Validação de formato de CEP
- Tratamento de erros da API
- Formatação automática de campos

### ✅ Validação Robusta
- Validação de CPF com algoritmo oficial
- Validação de e-mail
- Validação de telefone
- Campos obrigatórios
- Formatação automática (CPF, telefone, CEP)

### ✅ Interface Responsiva
- Design adaptável para desktop, tablet e mobile
- Componentes Bootstrap otimizados
- Experiência de usuário consistente

### ✅ Funcionalidades Avançadas
- Busca em tempo real
- Paginação configurável
- Ordenação de colunas
- Estados de carregamento
- Tratamento de erros

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca principal para construção da interface
- **TypeScript** - Tipagem estática para maior segurança
- **Bootstrap 5** - Framework CSS para estilização
- **React Bootstrap** - Componentes Bootstrap para React
- **Formik + Yup** - Gerenciamento e validação de formulários
- **Axios** - Cliente HTTP para requisições à API
- **React Data Table Component** - Tabela com funcionalidades avançadas
- **Context API** - Gerenciamento de estado global
- **React Testing Library** - Testes de componentes
- **Vitest** - Framework de testes
- **Storybook** - Documentação de componentes

## 📁 Arquitetura do Projeto

```
/src
├── components/          # Componentes reutilizáveis
│   ├── ModalUser/      # Modal para CRUD de usuários
│   ├── UserTable/      # Tabela de usuários
│   └── Loader/         # Componentes de carregamento
├── context/            # Context API para estado global
├── interfaces/         # Definições de tipos TypeScript
├── services/           # Serviços e utilitários
├── hooks/              # Hooks customizados (opcional)
├── test/               # Configuração de testes
├── stories/            # Documentação Storybook
├── App.tsx            # Componente principal
└── main.tsx           # Ponto de entrada
```

## 🏗️ Padrões de Desenvolvimento

### Arquitetura Limpa
O projeto segue os princípios da Arquitetura Limpa com separação clara de responsabilidades:

- **Components** - Responsáveis apenas pela UI
- **Services** - Lógica de negócio e integração com APIs
- **Interfaces** - Contratos e tipagem
- **Context** - Gerenciamento de estado global

### Componentização
Todos os componentes são:
- Reutilizáveis e modulares
- Bem tipados com TypeScript
- Testados com React Testing Library
- Documentados com Storybook

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm (recomendado) ou npm

### Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd user-registration-app

# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Executar em modo desenvolvimento
npm dev

# Executar testes
npm test

# Executar testes em modo watch
npm test:watch

# Executar Storybook
npm storybook

# Build para produção
npm build

# Preview do build
npm preview
```
### Produção
```bash
# Limpar a pasta dist
rm -rf dist

# Criar o build do projeto
npm run build

# Instalar serve para rodar o projeto
npm install -g serve

# Rodar o projeto
serve -s dist
```
## 🧪 Testes

O projeto inclui testes abrangentes para:

- **Componentes React** - Renderização e interações
- **Context API** - Gerenciamento de estado
- **Funções utilitárias** - Validações e formatações
- **Validações de formulário** - Esquemas Yup
- **Interações do usuário** - Eventos e fluxos

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes com coverage
npm test:coverage

```

## 📚 Documentação

### Storybook
A documentação completa dos componentes está disponível no Storybook:

```bash
npm storybook
```

Acesse: http://localhost:6006

### Componentes Documentados
- **Loader** - Componentes de carregamento
- **UserTable** - Tabela de usuários com funcionalidades
- **ModalUser** - Modal para CRUD de usuários
- **Documentation** - Visão geral do projeto

## 📊 Estrutura de Dados

### Interface User
```typescript
interface User {
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
}
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# API ViaCEP (já configurada)
VITE_VIACEP_API_URL=https://viacep.com.br/ws
```

### Scripts Disponíveis

- `npm dev` - Inicia o servidor de desenvolvimento
- `npm build` - Gera build de produção
- `npm preview` - Preview do build de produção
- `npm test` - Executa testes
- `npm test:watch` - Executa testes em modo watch
- `npm test:coverage` - Executa testes com coverage
- `npm storybook` - Inicia o Storybook
- `npm build-storybook` - Gera build do Storybook
- `npm lint` - Executa linting
- `npm type-check` - Verifica tipos TypeScript

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Atendidos

1. **Arquitetura Limpa** - Separação clara de responsabilidades
2. **Componentização** - Componentes reutilizáveis e modulares
3. **Context API** - Gerenciamento de estado global
4. **TypeScript** - Tipagem completa do projeto
5. **Validação Robusta** - Formik + Yup com validações customizadas
6. **Integração ViaCEP** - Preenchimento automático de endereço
7. **CRUD Completo** - Operações em memória
8. **Busca e Paginação** - Funcionalidades avançadas da tabela
9. **Testes Completos** - React Testing Library
10. **Documentação** - Storybook com stories detalhadas
11. **Responsividade** - Design adaptável
12. **UX Otimizada** - Estados de carregamento e feedback

### 🎨 Interface e UX

- Design moderno com Bootstrap 5
- Feedback visual para todas as ações
- Estados de carregamento
- Validação em tempo real
- Mensagens de erro claras
- Confirmações para ações destrutivas

### 🔒 Validações Implementadas

- **CPF** - Algoritmo oficial de validação
- **E-mail** - Formato válido
- **Telefone** - Formato brasileiro
- **CEP** - Formato e existência via API
- **Campos obrigatórios** - Validação completa
- **Datas** - Formato e validação de idade

## 🚀 Próximos Passos

Possíveis melhorias e funcionalidades futuras:

- [ ] Integração com backend real
- [ ] Autenticação e autorização
- [ ] Upload de foto do usuário
- [ ] Exportação de dados (PDF, Excel)
- [ ] Filtros avançados
- [ ] Histórico de alterações
- [ ] Notificações em tempo real
- [ ] Temas personalizáveis
- [ ] Internacionalização (i18n)
- [ ] PWA (Progressive Web App)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido por

Sistema desenvolvido seguindo as melhores práticas de desenvolvimento React com TypeScript, arquitetura limpa e testes abrangentes.

---

**Nota**: Este é um projeto de demonstração que implementa todas as funcionalidades solicitadas na prova prática, incluindo arquitetura limpa, componentização, Context API, validações robustas, integração ViaCEP, testes completos e documentação com Storybook.

