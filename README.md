# 💊 Substractum — Plataforma de Gestão para Farmácias de Manipulação

Aplicação web voltada para **farmácias de manipulação**, permitindo gerenciar:

- Catálogo de produtos manipulados e suplementos  
- Carrinho de compras e pedidos de clientes  
- Envio e controle de **receitas médicas em anexo**  
- Painéis de acompanhamento para **vendedores**  
- Área administrativa para **gestão de usuários e visão geral do negócio**

O projeto foi desenvolvido em **React + Vite + TypeScript**, usando **Supabase** como backend (auth, banco e storage).

---

## 🧱 Tecnologias Principais

- **Frontend**
  - React 18
  - TypeScript
  - Vite
  - React Router DOM
  - React Hook Form + Zod (validação)
  - Tailwind CSS
  - shadcn/ui (biblioteca de componentes)
  - Lucide Icons

- **Backend / Banco**
  - Supabase  
    - Autenticação de usuários  
    - Banco PostgreSQL (tabelas como `products`, `orders`, `order_items`, `profiles`, `user_roles`, `prescription_requests` etc.)  
    - Storage (bucket `prescriptions` para arquivos de receitas)

---

## 🧭 Visão Geral das Funcionalidades

### 👤 Perfil Cliente (usuário comum)

- **Página inicial (Landing / Home)**  
  - Banner de destaque apresentando a farmácia de manipulação  
  - Seções com benefícios, estatísticas e diferenciais da farmácia  

- **Catálogo de Produtos (`/products`)**
  - Lista de produtos manipulados e suplementos
  - Busca por texto
  - Filtros por categoria
  - Exibição de preço, fornecedor, disponibilidade, avaliações etc.
  - Botão **“Adicionar ao carrinho”** integrado ao contexto global de carrinho

- **Detalhe do Produto (`/product/:id`)**
  - Informações detalhadas do produto
  - Preço, descrição, categoria, fornecedor
  - Ação de adicionar ao carrinho

- **Carrinho de Compras (`/cart`)**
  - Lista de itens adicionados
  - Aumento/diminuição de quantidade
  - Remoção de itens
  - Cálculo de subtotal, frete e total
  - **Upload opcional de receita/anexo** diretamente no carrinho  
  - Botão **“Finalizar pedido”** que redireciona para a tela de pagamento, levando os dados do carrinho

- **Envio de Receita com Anexo (`/send-prescription`)**
  - Formulário com:
    - Nome
    - Telefone
    - Mensagem opcional
    - Upload de arquivo (receita/orçamento) até 5MB
  - Validação dos campos (Zod)
  - Upload automático do arquivo para o bucket `prescriptions` no Supabase Storage
  - Registro do pedido de receita na tabela `prescription_requests`
  - Gera uma mensagem pré-formatada para WhatsApp com os dados do cliente

- **Meus Pedidos (`/my-orders`)**
  - Lista dos pedidos do usuário autenticado (status, total, datas etc.)
  - Link para detalhe de cada pedido

- **Detalhe do Pedido (`/order/:orderId`)**
  - Visualização dos itens, valores e status do pedido

---

### 🧾 Perfil Vendedor (`role = "seller"`)

Algumas rotas são protegidas e só podem ser acessadas por usuários com papel de vendedor, através do componente `ProtectedRoute`.

- **Dashboard do Vendedor (`/seller-dashboard`)**
  - Visão geral de vendas, pedidos recentes e métricas (parte dos dados pode ser mockada para demonstração)

- **Gerenciar Produtos (`/my-products`)**
  - Lista de produtos cadastrados no Supabase (`products`)
  - Busca e filtro por nome/categoria
  - Base para gestão do catálogo (edição/criação pode ser incrementada a partir desta tela)

- **Pedidos do Sistema (`/orders`)**
  - Tabela de pedidos com:
    - Cliente
    - Data
    - Status (pendente, em andamento, concluído, cancelado etc.)
    - Valor total
    - Método de pagamento
  - Filtros por status e busca por cliente  
  - Alguns dados de exemplo são mockados, servindo como tela de referência para futura integração completa com o banco.

- **Criar Pedido Manualmente (`/create-order`)**
  - Fluxo voltado para que o vendedor registre um pedido diretamente no sistema
  - Facilita atendimento presencial ou telefônico

- **Solicitações de Receitas (`/prescription-requests`)**
  - Lista de solicitações enviadas pelos clientes em `/send-prescription`
  - Filtro por status e busca por nome/telefone
  - Possibilidade de:
    - Alterar o status (pendente, em progresso, concluído, cancelado)
    - **Baixar o arquivo de receita** diretamente do Supabase Storage (`prescriptions`)
    - Visualizar detalhes da solicitação em um diálogo/modal

- **Página de Vendas / Relatórios (`/vendas`, `/sales-report`)**
  - Telas de exemplo para visão de vendas, gráficos e relatórios
  - Grande parte dos dados está mockada, servindo como protótipo de interface

---

### 🛠️ Perfil Administrador (`role = "admin"`)

- **Dashboard Administrativo (`/admin`)**
  - Visão geral do sistema
  - Espaço para acompanhar usuários, papéis (roles) e dados globais
  - Pode ser expandido para incluir criação/edição de vendedores, permissões etc.

- **Perfis Específicos**
  - `/profile-admin` — visão de perfil para administrador
  - `/profile-seller` — visão de perfil para vendedor

---

### 🔒 Autenticação e Autorização

- Autenticação feita via **Supabase Auth**:
  - Login com e-mail e senha na tela `/login`
  - Após o login, o backend do Supabase retorna a sessão e o `user_id`
  - A função `fetchUserRole` busca a função (`admin`, `seller`, `user`) na tabela `user_roles`
  - O `AuthContext` guarda o usuário atual e seu papel, e o `ProtectedRoute` usa essas informações para restringir rotas

> ⚠️ Obs.: a tela de **cadastro** (`/signup`) atualmente funciona como fluxo de demonstração.  
> Para ambiente real, a criação de usuários e atribuição de roles deve ser feita via painel do Supabase ou endpoints próprios.

---

## 📂 Estrutura de Pastas (Resumo)

```text
substractum/
  ├─ src/
  │  ├─ assets/          # Imagens e ícones (produtos, branding etc.)
  │  ├─ components/      # Componentes reutilizáveis e layout (Header, Footer, etc.)
  │  ├─ contexts/        # Contextos globais (AuthContext, CartContext)
  │  ├─ hooks/           # Hooks auxiliares (use-toast, use-mobile)
  │  ├─ integrations/
  │  │  └─ supabase/     # Cliente Supabase e tipos do banco
  │  ├─ lib/             # utilitários (queryClient, funções gerais)
  │  ├─ pages/           # Páginas de rota (Home, Products, Cart, Dashboards, etc.)
  │  └─ types/           # Tipagens compartilhadas
  ├─ supabase/
  │  └─ migrations/      # Scripts SQL gerados pelo Supabase CLI
  ├─ .env                # Variáveis de ambiente (NÃO versionar em repositório público)
  ├─ package.json
  ├─ vite.config.ts
  └─ tsconfig.json
```

---

## ✅ Pré-requisitos

Antes de executar o projeto, você precisa ter instalado:

- **Node.js** (recomendado: versão LTS mais recente — 18 ou 20)  
- **npm** (vem junto com o Node) ou outro gerenciador de pacotes (yarn/pnpm, se preferir)  
- Uma conta e um projeto configurado no **Supabase**:
  - Banco de dados com as tabelas usadas pela aplicação (products, orders, order_items, profiles, user_roles, prescription_requests, etc.)
  - Bucket de Storage chamado `prescriptions` (para armazenar os arquivos de receita)
  - Auth habilitado (e-mail/senha)

---

## 🔐 Configuração das Variáveis de Ambiente

Na raiz do projeto (pasta `substractum/`), crie um arquivo chamado **`.env`** (se ele ainda não existir) com o seguinte conteúdo básico:

```env
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="SUA_CHAVE_ANON_PUBLIC"
```

Opcionalmente, você pode guardar também o ID do projeto:

```env
VITE_SUPABASE_PROJECT_ID="SEU_PROJECT_ID"
```

### Onde encontrar esses valores no Supabase?

- `VITE_SUPABASE_URL`  
  - No painel do Supabase, em **Project Settings → API → Project URL**.

- `VITE_SUPABASE_PUBLISHABLE_KEY`  
  - Também em **Project Settings → API → anon public key**.

> 🔒 **Importante:**  
> Nunca exponha esse arquivo `.env` em repositórios públicos.  
> Se você já recebeu o projeto com um `.env` pronto, utilize-o somente em ambiente interno/seguro.

---

## 📦 Instalação e Execução em Desenvolvimento

1. **Clonar ou extrair o projeto**

   ```bash
   # Se estiver usando git:
   git clone <url-do-repositorio.git>
   cd substractum

   # Se recebeu um .zip:
   # - Extraia o arquivo
   # - Entre na pasta extraída:
   cd substractum
   ```

2. **Instalar as dependências**

   ```bash
   npm install
   ```

3. **Configurar o `.env`**

   - Verifique se o arquivo `.env` existe na raiz do projeto.
   - Preencha os valores de `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os dados do seu projeto Supabase.

4. **Rodar o servidor de desenvolvimento**

   O Vite já está configurado no arquivo `vite.config.ts` para usar a porta **8080**.

   ```bash
   npm run dev
   ```

   Depois, acesse no navegador:

   ```text
   http://localhost:8080
   ```

5. **Login / Teste de acesso**

   - Crie usuários diretamente no painel do Supabase (Auth → Users) ou via script/migration.
   - Defina o papel (role) desses usuários na tabela `user_roles` (`admin`, `seller` ou `user`).
   - Use a tela de **Login** (`/login`) para entrar com o e-mail e senha configurados no Supabase.
   - A partir do papel do usuário, o sistema direciona para:
     - `/admin` → administrador  
     - `/seller-dashboard` → vendedor  
     - `/home` / demais páginas → usuário comum

---

## 🧪 Outros Scripts Disponíveis

No `package.json` você encontra alguns scripts úteis:

- **`npm run dev`**  
  Inicia o servidor de desenvolvimento na porta 8080.

- **`npm run build`**  
  Gera o build de produção da aplicação (saída em `dist/`).

- **`npm run build:dev`**  
  Gera um build em modo desenvolvimento (útil para testes específicos).

- **`npm run preview`**  
  Sobe um servidor local para visualizar o build de produção.

- **`npm run lint`**  
  Executa o ESLint para checagem de qualidade do código.

---

## 🚀 Próximos Passos e Possíveis Extensões

- Ligar todas as telas de dashboard e relatórios diretamente às tabelas do Supabase, removendo os dados mockados.  
- Criar uma tela administrativa para:
  - Gerenciar usuários
  - Definir papéis (`admin`, `seller`, `user`)
  - Gerenciar catálogo de produtos (CRUD completo)
- Implementar fluxo real de cadastro de usuário (`/signup`) integrado ao Supabase Auth.  
- Integrar meios de pagamento reais (ex.: integração com APIs de pagamento reais).
