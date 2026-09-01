# 💸 fintech-flow

O **fintech-flow** é uma aplicação web full-stack para gestão financeira pessoal e empresarial.

O sistema permite o controle de movimentações financeiras, visualização por períodos semanais e quinzenais, dashboard com indicadores financeiros, autenticação de usuários e persistência de dados em PostgreSQL.

🚀 **[Acessar Aplicação em Produção](https://fintechflow-demo.vercel.app/)**

### 🔑 Credenciais para Teste (Demo)
- **E-mail:** `teste@email.com`
- **Senha:** `123456`

---

## ✨ Tecnologias Utilizadas

### Front-End

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)

* **React**
* **Tailwind CSS**
* **Vite**
* **Lucide React** — Iconografia

### Back-End

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)

* **Node.js**
* **Express**
* **PostgreSQL**
* **Neon DB** — PostgreSQL Serverless
* **pg** — Driver PostgreSQL para Node.js
* **JWT** — Gerenciamento de sessões
* **Bcrypt** — Hash seguro de senhas

---

## 📁 Estrutura do Projeto

```text
fintech-flow/
├── api/                      # Backend Node.js / Express
│   ├── config/               # Configuração do banco (db.js com SSL Neon DB)
│   ├── controllers/          # Controladores das rotas de API
│   ├── middlewares/          # Middlewares (autenticação JWT, validações)
│   ├── routes/               # Definição dos endpoints REST
│   ├── services/             # Regras de negócio e queries PostgreSQL
│   └── server.js             # Entrada da API Express
├── scripts/                  # Scripts SQL do banco de dados
│   └── schema.sql            # Schema das tabelas (users, transactions)
├── src/                      # Frontend React (Vite + Tailwind CSS)
│   ├── components/           # Componentes de interface (layout, ui, FinanceDashboard)
│   ├── constants/            # Constantes da aplicação
│   ├── context/              # Contextos globais (AuthContext)
│   ├── hooks/                # Custom hooks (useTransactions)
│   ├── utils/                # Utilitários de cálculo, formatação e períodos
│   ├── views/                # Telas (WeeklyFinance, BiweeklyFinance, Dashboard, etc.)
│   ├── App.jsx               # Componente raiz
│   └── main.jsx              # Ponto de entrada do React
├── .env                      # Variáveis de ambiente
└── README.md                 # Documentação do projeto
```

---

## 🏗️ Destaques de Engenharia

### 1. Mapeamento de Domínio (PT-BR ↔ EN)

A interface trabalha com termos em Português, como:

* `entrada`
* `saída`
* `semanal`
* `quinzenal`

Enquanto a API utiliza valores em Inglês para persistência no PostgreSQL:

* `income`
* `expense`
* `weekly`
* `biweekly`

Essa camada de tradução mantém a experiência do usuário em Português sem comprometer a padronização dos dados no back-end.

---

### 2. PostgreSQL Serverless com Neon DB

O projeto utiliza PostgreSQL hospedado através do **Neon DB**.

O driver `pg` possui configuração de timeout para lidar com possíveis períodos de inicialização do banco serverless (*cold start*).

```javascript
connectionTimeoutMillis: 10000
```

---

### 3. Autenticação Segura

A aplicação utiliza:

* **Bcrypt** para armazenamento seguro das senhas;
* **JWT** para gerenciamento das sessões;
* Cookies com flag **HttpOnly** para reduzir a exposição dos tokens no navegador.

As credenciais e informações sensíveis são mantidas através de variáveis de ambiente.

---

### 4. Banco Reproduzível

A estrutura do banco de dados está versionada no repositório através do arquivo:

```text
scripts/schema.sql
```

Isso permite que qualquer pessoa que clone o projeto consiga recriar a estrutura necessária do PostgreSQL sem depender de uma cópia pré-existente do banco.

O script cria automaticamente as tabelas necessárias e suas respectivas restrições.

---

### 5. Layout Responsivo

A interface foi desenvolvida para diferentes tamanhos de tela.

Em telas maiores, as movimentações são apresentadas através de uma tabela financeira interativa.

Em dispositivos menores, os dados são adaptados para uma visualização em cartões, proporcionando uma experiência mais adequada para dispositivos móveis.

---

## 🚀 Funcionalidades

* [x] **Autenticação de usuários**
* [x] Login com senha protegida por Bcrypt
* [x] Sessão utilizando JWT
* [x] Cookies HttpOnly
* [x] **CRUD de movimentações financeiras**
* [x] Cadastro de entradas
* [x] Cadastro de saídas
* [x] Exclusão de movimentações
* [x] Listagem de movimentações
* [x] **Visualização por períodos**
* [x] Período semanal
* [x] Período quinzenal
* [x] **Dashboard financeiro**
* [x] Total de entradas
* [x] Total de saídas
* [x] Cálculo de saldo líquido
* [x] Formatação de valores em Real Brasileiro
* [x] Interface responsiva

---

##  Como Rodar o Projeto Localmente

### Pré-requisitos

Antes de iniciar, certifique-se de possuir:

* [Node.js](https://nodejs.org/) 18 ou superior
* npm ou pnpm
* PostgreSQL local ou uma conta no Neon DB

---

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/fintech-flow.git
cd fintech-flow
```

---

### 2. Instalar as dependências

```bash
npm install
```

---

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=verify-full"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

> ⚠️ **Nunca envie o arquivo `.env` para o GitHub.**
>
> As credenciais reais do banco e a chave JWT devem permanecer protegidas como variáveis de ambiente.

---

### 4. Criar a Estrutura do Banco

O schema também pode ser executado manualmente através de ferramentas como **DBeaver**, **pgAdmin** ou pelo console do **Neon DB**.

Para criar as tabelas, você pode copiar o conteúdo de `scripts/schema.sql` e executá-lo diretamente no seu cliente PostgreSQL.

---

### 5. Iniciar o Back-End

```bash
node api/server.js
```

O servidor será iniciado na porta configurada no arquivo `.env`.

---

### 6. Iniciar o Front-End

Abra um segundo terminal e execute:

```bash
npm run dev
```

O Vite disponibilizará a aplicação normalmente em:

```text
http://localhost:5173
```

---

## 🗄️ Estrutura do Banco de Dados

### `users`

Armazena os usuários cadastrados na aplicação.

| Campo           | Tipo      | Descrição                |
| --------------- | --------- | ------------------------ |
| `id`            | SERIAL    | Identificador único      |
| `name`          | VARCHAR   | Nome do usuário          |
| `email`         | VARCHAR   | E-mail único             |
| `password_hash` | VARCHAR   | Senha armazenada em hash |
| `created_at`    | TIMESTAMP | Data de criação          |

### `transactions`

Armazena as movimentações financeiras, associadas a um usuário.

| Campo         | Tipo      | Descrição                               |
| ------------- | --------- | --------------------------------------- |
| `id`          | SERIAL    | Identificador único                     |
| `description` | VARCHAR   | Descrição da movimentação               |
| `amount`      | NUMERIC   | Valor da movimentação                   |
| `type`        | VARCHAR   | `income` ou `expense`                   |
| `category`    | VARCHAR   | Categoria da movimentação               |
| `frequency`   | VARCHAR   | `weekly`, `biweekly` ou `monthly`       |
| `date`        | DATE      | Data da movimentação                    |
| `observation` | TEXT      | Observação (opcional)                   |
| `user_id`     | INT       | Chave estrangeira para a tabela `users` |
| `created_at`  | TIMESTAMP | Data de criação                         |

A relação entre `users` e `transactions` utiliza uma chave estrangeira com exclusão em cascata:

```text
users
  │
  └── transactions
```

Quando um usuário é removido, suas respectivas movimentações também são removidas.

---

## 🔐 Variáveis de Ambiente

| Variável       | Descrição                                      |
| -------------- | ---------------------------------------------- |
| `DATABASE_URL` | URL de conexão com o PostgreSQL                |
| `JWT_SECRET`   | Chave utilizada para assinatura dos tokens JWT |
| `PORT`         | Porta utilizada pelo servidor                  |

> Em produção, configure essas variáveis diretamente no ambiente de hospedagem, como a Vercel. Não coloque valores reais no código-fonte.

---

## ☁️ Deploy

O projeto pode ser publicado utilizando:

* **Vercel** para hospedagem da aplicação;
* **Neon DB** para o banco PostgreSQL.

Para produção, configure as seguintes variáveis no ambiente da Vercel:

```text
DATABASE_URL
JWT_SECRET
PORT
```

A conta de demonstração pode ser utilizada pelos visitantes para testar a aplicação publicada.

---

## 📁 Banco de Dados Local

Caso seja utilizado um PostgreSQL local, configure a variável:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/fintech_flow"
```

Depois execute:

```bash
node scripts/seedUser.js
```

O script será responsável por criar a estrutura necessária e cadastrar o usuário de demonstração.

---

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).