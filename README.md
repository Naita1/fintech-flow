# 💸 Fluxo Control - Portal de Gestão Financeira

Um portal Full-Stack para gestão de finanças pessoais ou empresariais, com dashboards analíticos e visões semanais/quinzenais. Este projeto foi construído como uma peça de portfólio para demonstrar competências em desenvolvimento web moderno com React e Node.js.

<br/>

---

## ✨ Tecnologias Utilizadas

Este projeto utiliza uma stack moderna e robusta, focada em performance e segurança.

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🏛️ Arquitetura & Decisões Técnicas

A arquitetura foi pensada para ser escalável, segura e demonstrar boas práticas de desenvolvimento Full-Stack.

### 1. **Migração de Mock Data para Banco de Dados em Nuvem**
O projeto evoluiu de uma fase inicial com dados mockados (`mockData.js`) para uma arquitetura persistente, utilizando um banco de dados **PostgreSQL** hospedado na **Neon**. Isso demonstra a capacidade de trabalhar com bancos de dados relacionais reais e gerenciar dados de produção.

### 2. **Gerenciamento de Conexão com o Banco**
A conexão com o PostgreSQL é gerenciada de forma resiliente através do `pg` Pool.
- **Pool de Conexões**: Evita a sobrecarga de abrir e fechar conexões a cada requisição, melhorando a performance da API.
- **Conexão Segura**: A configuração `ssl: { rejectUnauthorized: false }` está ativada para garantir a comunicação criptografada com o banco de dados em nuvem, uma prática essencial em produção.

### 3. **Autenticação Segura com JWT**
A segurança do usuário é uma prioridade. O sistema de autenticação foi implementado com as seguintes camadas de proteção:
- **Hashing de Senhas**: As senhas dos usuários são armazenadas no banco de dados utilizando o algoritmo `bcrypt`, garantindo que mesmo em caso de vazamento, as senhas não sejam expostas.
- **Tokens JWT em Cookies `HttpOnly`**: Após o login, um JSON Web Token (JWT) é gerado e armazenado em um cookie `HttpOnly`. Isso impede que o token seja acessado por scripts maliciosos no lado do cliente (ataques XSS), tornando a sessão muito mais segura do que o armazenamento em `localStorage`.

---

## 📁 Estrutura do Projeto

A organização de pastas segue um padrão lógico que separa as responsabilidades da aplicação.

```
/
├── 📂 api/                  # Backend (Serverless Functions)
│   ├── 📂 auth/             # Endpoints de autenticação
│   │   ├── login.js
│   │   ├── logout.js
│   │   └── me.js
│   └── _db.js               # Configuração do pool de conexão com o DB
│
├── 📂 scripts/              # Scripts utilitários
│   └── seedUser.js          # Popula o DB com um usuário de teste
│
├── 📂 src/                  # Frontend (React)
│   ├── 📂 components/       # Componentes reutilizáveis (UI, layout)
│   ├── 📂 context/          # Context API para estado global (ex: autenticação)
│   ├── 📂 utils/            # Funções utilitárias (formatação, cálculos)
│   └── 📂 views/            # Componentes de página (Dashboard, Relatórios)
│
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação no seu ambiente de desenvolvimento.

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou pnpm
- Um banco de dados PostgreSQL (você pode criar uma conta gratuita na Neon)

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/fluxo-control.git
   cd fluxo-control
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto, copiando o conteúdo de `.env.example`.
   - Preencha as variáveis com suas credenciais:
     ```env
     # String de conexão do seu banco de dados PostgreSQL (Neon)
     DATABASE_URL="postgres://user:password@host:port/dbname?sslmode=require"

     # Chave secreta para assinar os tokens JWT (pode ser qualquer string segura)
     JWT_SECRET="SUA_CHAVE_SECRETA_AQUI"
     ```

4. **Popule o banco de dados:**
   - Rode o script de *seed* para criar as tabelas e o usuário de teste (`teste@email.com` / `123456`).
   ```bash
   node scripts/seedUser.js
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:5173`.

---

## 🗺️ Próximos Passos (Roadmap)

- [ ] **Integração Completa da Autenticação no Front-End**: Conectar os formulários de login/cadastro e proteger as rotas privadas.
- [ ] **Implementação do CRUD de Movimentações**: Criar a API e a interface para adicionar, editar e excluir transações financeiras, persistindo os dados no banco.

