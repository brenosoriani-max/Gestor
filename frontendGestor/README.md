# Gestor Frontend

Frontend para o sistema de gerenciamento financeiro Gestor, seguindo os padrões e arquitetura do projeto HelpDesk_FrontEnd.

## 🛠️ Stack Tecnológico

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Roteamento
- **Axios** - HTTP client
- **Context API** - State management (autenticação)
- **CSS Modules** - Estilização
- **React Toastify** - Notificações
- **Lucide React** - Ícones
- **Framer Motion** - Animações

## 📁 Estrutura do Projeto

```
src/
├── types/              # TypeScript interfaces
├── context/            # Context API
├── providers/          # Provedores (Auth)
├── services/           # API services
├── hooks/              # Custom hooks
├── components/         # Componentes reutilizáveis
├── pages/              # Páginas
├── router/             # Configuração de rotas
├── styles/             # Estilos globais
├── utils/              # Utilitários
└── index.css           # Estilos globais
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Backend rodando em `http://localhost:3000`

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

### Build

```bash
npm run build
```

## 🔐 Autenticação

O sistema usa JWT para autenticação:

1. Login → POST `/auth/login`
2. Token armazenado em localStorage
3. Token decodificado no AuthProvider
4. Usuário carregado via GET `/auth/me`
5. Rotas protegidas com PrivateRoute e AdminRoute

## 📋 Rotas Principais

### Públicas
- `/login` - Login
- `/register` - Registro

### Privadas
- `/dashboard` - Dashboard principal
- `/operations` - Gerenciar operações
- `/categories` - Gerenciar categorias
- `/banks` - Gerenciar bancos
- `/reports` - Visualizar relatórios
- `/profile` - Perfil do usuário

### Admin
- `/admin` - Painel administrativo

## 🎨 Design

- Paleta: Azul (#2e3da3), Cinza (#1e2024)
- Layout: Sidebar fixo + conteúdo responsivo
- Animações: Framer Motion
- Notificações: Toast alerts

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```
VITE_API_URL=http://localhost:3000
```

## 🔧 Padrões de Código

### Componentes

```typescript
import styles from './Component.module.css';

export function Component() {
  return <div className={styles.container}>...</div>;
}
```

### Hooks

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### API Calls

```typescript
try {
  const data = await operationsService.getAll();
  setOperations(data);
} catch (error: any) {
  toast.error(error.response?.data?.error || 'Erro');
}
```

### Rotas Protegidas

```typescript
<Route
  path="/operations"
  element={
    <PrivateRoute>
      <Operations />
    </PrivateRoute>
  }
/>
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do backend ou abra um issue no repositório.
