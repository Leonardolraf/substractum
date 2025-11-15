# 💊 Substractum — Gestão de Manipulados  
### React + Vite + Supabase + Tailwind + shadcn/ui

<div align="center">

![Status](https://img.shields.io/badge/STATUS-ATIVO-brightgreen?style=for-the-badge)
![Private](https://img.shields.io/badge/REPOSIT%C3%93RIO-PRIVADO-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-38BDF8?style=for-the-badge&logo=tailwindcss)


</div>

---

# 📝 Descrição

O **Substractum** é um sistema web destinado a **farmácias de manipulação**, oferecendo:

- Gestão de **pedidos**  
- Controle de **fórmulas e insumos**  
- Acompanhamento de **produção** e etapas  
- Rastreabilidade e auditoria  
- Perfis com diferentes permissões  
- UI moderna e responsiva  

---

# 🧭 Arquitetura — Diagramas (Mermaid)

## 📌 1. Arquitetura Geral
```mermaid
flowchart LR
    A[Frontend React] --> B[Vite Build]
    A --> C[Supabase Auth]
    A --> D[Supabase Database]
    A --> E[Supabase Storage]
    D --> F[RLS Policies]
```

## 📌 2. Fluxo Completo: Pedido → Produção → Entrega
```mermaid
flowchart LR
    A[Cliente cria pedido] --> B[Recepção valida pedido]
    B --> C[Farmacêutico revisa fórmula]
    C --> D[Manipulação]
    D --> E[Controle de Qualidade]
    E --> F[Liberação]
    F --> G[Entrega ao Cliente]
```

## 📌 3. Fluxo de Autenticação
```mermaid
sequenceDiagram
    Usuario->>Frontend: Login (email/senha)
    Frontend->>Supabase Auth: requestToken()
    Supabase Auth-->>Frontend: JWT Token
    Frontend->>Supabase DB: query with JWT
    Supabase DB-->>Frontend: data
```

## 📌 4. ERD do Banco (Supabase)
```mermaid
erDiagram
    USERS ||--o{ ORDERS : "cria"
    ORDERS ||--|{ FORMULAS : "possui"
    FORMULAS ||--|{ INGREDIENTS : "usa"
    ORDERS {
        uuid id
        uuid user_id
        text status
        timestamp created_at
    }
    FORMULAS {
        uuid id
        uuid order_id
        text name
        text description
    }
    INGREDIENTS {
        uuid id
        uuid formula_id
        text name
        numeric quantity
        text unit
    }
```

## 📌 5. Diagrama de Componentes Frontend
```mermaid
flowchart TB
    App[App.tsx] --> Router[Rotas]
    Router --> DashboardPage
    Router --> OrdersPage
    Router --> FormulaPage
    DashboardPage --> StatsWidget
    OrdersPage --> OrderCard
    FormulaPage --> IngredientList
```

---

# 🧪 Testes Automatizados (Vitest)

### Instalar
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Configuração
```ts
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/tests/setup.ts"
}
```

### Exemplo
```tsx
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Substractum title", () => {
  render(<App />);
  expect(screen.getByText(/Substractum/i)).toBeInTheDocument();
});
```

---

# 🚀 Como rodar localmente

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

# 🇺🇸 English Version

## 💊 Substractum — Compounding Pharmacy Management System

This system was designed for compounding pharmacies to manage:

- Orders, formulas, ingredients  
- Production workflow  
- Traceability & auditing  

---

# 📄 License

Private proprietary repository.

