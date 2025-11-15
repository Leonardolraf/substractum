# 💊 Substractum — Gestão de Manipulados (React + Vite + Supabase)

O **Substractum** é um sistema web criado para apoiar a **Substractum**, empresa farmacêutica de **medicamentos manipulados**, na organização e rastreabilidade de pedidos, fórmulas e etapas produtivas.  
Este repositório contém um front‑end **React + TypeScript** com **Vite**, **Tailwind CSS** e componentes **shadcn/ui**, integrado ao **Supabase** para autenticação e dados.

---

## 🎯 Motivação do Projeto

A Substractum enfrentava desafios como:
- Falta de **controle centralizado** de fórmulas e pedidos;
- Dificuldade em acompanhar **status de produção/entrega** e insumos;
- Processos manuais suscetíveis a **erros de digitação** e **inconsistências**;
- Exigência de **rastreabilidade** para atender às normas sanitárias.

O projeto nasceu para **reduzir erros**, **acelerar o atendimento** e garantir **confiabilidade e auditoria** dos registros, oferecendo uma base tecnológica moderna e escalável.

---

## 🧪 Como este projeto ajuda a Substractum

- **Rastreabilidade ponta a ponta**: pedidos, lotes, insumos e responsáveis por etapa;
- **Produtividade de equipe**: telas otimizadas, validações e automações;
- **Qualidade & Compliance**: registros consistentes, trilhas de auditoria e separação de perfis de acesso;
- **Relatórios/Indicadores**: base para métricas de produção, tempo de ciclo e perdas;
- **Integração**: arquitetura preparada para compor com estoque, fiscal ou CRM via APIs.

---

## 🧱 Stack Técnica (detectada no ZIP)

- **Vite + React + TypeScript** (`package.json`, `vite.config.ts`, `src/`)
- **Tailwind CSS** (`tailwind.config.ts`, `postcss.config.js`)
- **shadcn/ui** (`components.json`)
- **Supabase** (`supabase/`, variáveis `VITE_SUPABASE_*`)
- **ESLint** (`eslint.config.js`)
- Lockfile: **`package-lock.json`** (recomendado usar **npm**)

> Principais entradas: `src/main.tsx` e `src/App.tsx`.

---

## ⚙️ Pré‑requisitos

- **Node.js** 18 ou 20 (LTS recomendado).  
- **npm** 9+ (use npm para respeitar o `package-lock.json`).

> Opcional: **Bun** também está presente (`bun.lockb`), mas o lockfile oficial é do npm — mantenha consistência usando **npm**.

---

## 🔐 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves (não exponha valores sensíveis):

```bash
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

**Dicas**
- Nunca commitar `.env` em repositórios públicos;
- Para ambientes diferentes (dev/homolog/prod), use arquivos `.env.*` do Vite ou variáveis de ambiente no servidor.

---

## 🚀 Como rodar localmente (compilar/executar)

1) **Instalar dependências**
```bash
npm install
```

2) **Executar em desenvolvimento**
```bash
npm run dev
```
- A aplicação ficará disponível por padrão em **http://localhost:8080**.

3) **Build de produção**
```bash
npm run build
```
- Artefatos gerados em `dist/`.

4) **Pré‑visualização do build**
```bash
npm run preview
```
- Servidor de preview em **http://localhost:8080**.

5) **Lint (opcional)**
```bash
npm run lint
```

---

## 📁 Estrutura relevante

```
substractum/
├─ .env                         # variáveis locais (não commitar)
├─ package.json                 # scripts: dev, build, preview, lint
├─ vite.config.ts               # Vite config
├─ tailwind.config.ts           # Tailwind config
├─ postcss.config.js
├─ components.json              # shadcn/ui
├─ public/                      # assets estáticos
├─ src/
│  ├─ main.tsx                  # bootstrap do app
│  ├─ App.tsx                   # raiz da aplicação
│  └─ ...                       # componentes/páginas
└─ supabase/
   ├─ config.toml               # config do Supabase CLI (se usado)
   └─ migrations/               # migrações (se aplicável)
```

---

## 🧰 Deploy (visão geral)

- **Static hosting** para `dist/`: Vercel, Netlify, Cloudflare Pages, S3+CloudFront etc.
- **Variáveis de ambiente**: configure `VITE_SUPABASE_*` no painel do provedor de deploy.
- **Headers de segurança**: aplique CSP, X-Frame-Options, HSTS quando possível.
- **Supabase**: garanta políticas RLS apropriadas e chaves rotacionadas.

---

## ✅ Boas práticas para ambiente farmacêutico

- **Logs de auditoria** para ações críticas (criar/editar fórmula, liberar lote, ajustes de estoque).
- **Controles de acesso** (RBAC): separar papéis (manipulador, farmacêutico responsável, atendimento, auditoria).
- **Validações** de campos críticos (unidades, concentrações, datas de validade, lote/partida).
- **Backups e restauração** testados regularmente.
- **Conformidade** com requisitos da vigilância sanitária local (procedimentos padrão, registros assinados e carimbados quando necessário).

---

## 🗺️ Roadmap sugerido

- [ ] Trilhas de auditoria visíveis por lote/pedido
- [ ] Integração com módulo de estoque/insumos
- [ ] Assinatura eletrônica para etapas críticas
- [ ] Relatórios de tempo de ciclo, perdas e retrabalho
- [ ] Alertas de validade e rastreabilidade por lote

---

## 📄 Licença / Uso

Este projeto foi desenvolvido para a **Substractum**. O uso, distribuição e reprodução são **restritos** e dependem de autorização da empresa.

---
