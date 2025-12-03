# 💊 Substractum — Plataforma de Gestão para Farmácias de Manipulação

Aplicação web voltada para **farmácias de manipulação**, permitindo:

- Exibir catálogo de produtos manipulados e suplementos  
- Gerenciar carrinho de compras, pagamento e pedidos  
- Enviar e controlar **receitas médicas com upload de arquivos**  
- Oferecer painéis de acompanhamento para **vendedores**  
- Disponibilizar uma área administrativa para **gestão de usuários e visão geral do negócio**

O frontend é construído com **React + Vite + TypeScript**, e o backend é provido pelo **Supabase** (auth, banco PostgreSQL e storage).

---

## 🧱 Tecnologias principais

**Frontend**

- React 18
- Vite (bundler / dev server)
- TypeScript
- React Router DOM (roteamento)
- @tanstack/react-query (caching de dados – já configurado)
- Tailwind CSS + tailwind-merge
- shadcn/ui (botões, cards, formulários, tabelas etc.)
- lucide-react (ícones)
- react-hook-form + Zod (validação de formulários em algumas telas)

**Backend / BaaS**

- Supabase
  - Autenticação de usuários (auth)
  - Banco PostgreSQL (tabelas como `products`, `orders`, `order_items`, `cart_items`, `profiles`, `user_roles`, `prescription_requests`, `product_reviews` etc.)
  - Storage (bucket `prescriptions` para upload/download de receitas)

**Ferramentas de desenvolvimento**

- ESLint (lint do código)
- Vite + SWC (@vitejs/plugin-react-swc) para build rápido

---

## 🧭 Arquitetura geral da aplicação

### Entrada da aplicação

- `src/main.tsx`  
  - Renderiza o app dentro da `<div id="root">`.
  - Envolve a aplicação em:
    - `<BrowserRouter>` (rotas)
    - `<QueryClientProvider>` (React Query)
    - `<AuthProvider>` (contexto de autenticação)
    - `<CartProvider>` (contexto de carrinho)

- `src/App.tsx`  
  - Define todas as rotas da SPA.
  - Usa o componente `ProtectedRoute` para proteger rotas que exigem login ou um papel específico (`admin` ou `seller`).

### Contextos principais

- `src/contexts/AuthContext.tsx`
  - Lida com:
    - Sessão do Supabase (`supabase.auth`).
    - Login (`supabase.auth.signInWithPassword`).
    - Cadastro (`supabase.auth.signUp`).
    - Logout (`supabase.auth.signOut`).
  - Após o login, busca o papel do usuário na tabela `user_roles`:
    - `admin`
    - `seller`
    - `user` (cliente)
  - Expõe:
    - `user` (id, email, role)
    - `session`
    - `login`, `signup`, `logout`
    - `isAuthenticated`, `loading`

- `src/contexts/CartContext.tsx`
  - Representa os itens do carrinho (`CartItem`) com:
    - `productId`, `name`, `price`, `quantity`, `imageUrl`, `product`
  - Funciona de duas formas:
    - **Usuário convidado (não logado)**  
      - Carrinho salvo em `localStorage` (chave `substractum_cart_guest`).
    - **Usuário logado**
      - Fonte de verdade passa a ser a tabela `cart_items` no Supabase.
      - Ao logar:
        - Carrega `cart_items` do Supabase.
      - Ao adicionar/alterar/remover:
        - Atualiza o estado local **e** sincroniza com a tabela `cart_items` (funções `syncItemToSupabase`, `syncClearSupabase`).
  - Expõe:
    - `items`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
    - `totalItems`, `totalPrice`, `isReady`

### Integração com Supabase

- `src/integrations/supabase/client.ts`
  - Cria o cliente tipado.
- `src/integrations/supabase/types.ts`
  - Tipos gerados a partir do schema do banco (`Database`).

### Layout e componentes compartilhados

- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/home/*`

---

## 🧩 Páginas e funcionalidades por perfil

(Conteúdo reduzido aqui para manter o arquivo gerenciável; o README completo com todas as seções principais, fluxos técnicos, estrutura de pastas, passos de execução e melhorias está descrito na conversa.)

