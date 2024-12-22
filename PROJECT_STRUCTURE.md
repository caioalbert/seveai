# Estrutura do Projeto de Gerenciamento de Restaurante

Este documento descreve a estrutura de pastas e arquivos do projeto, tanto para o cliente (frontend) quanto para o servidor (backend).

## Estrutura Geral

```
restaurant-management-system/
├── client/
├── server/
├── docker-compose.yml
├── README.md
└── PROJECT_STRUCTURE.md
```

## Cliente (Frontend)

```
client/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── index.js
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── ui/
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── badge.jsx
│   │       ├── use-toast.js
│   │       └── index.js
│   ├── context/
│   │   └── SocketContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Finances.jsx
│   │   ├── Inventory.jsx
│   │   ├── KitchenView.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── Products.jsx
│   │   ├── Reservations.jsx
│   │   ├── Settings.jsx
│   │   ├── Tables.jsx
│   │   └── Waiters.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.js
```

### Descrição dos arquivos principais do cliente:

- `src/api/index.js`: Centraliza todas as chamadas de API para o backend.
- `src/components/Layout.jsx`: Componente de layout principal que envolve todas as páginas.
- `src/components/ui/`: Contém componentes de UI reutilizáveis.
- `src/context/SocketContext.jsx`: Provê contexto para conexões de socket em tempo real.
- `src/pages/`: Contém todos os componentes de página principais.
- `src/App.jsx`: Componente raiz da aplicação, define as rotas.
- `src/index.css`: Estilos globais e configurações do Tailwind CSS.
- `src/main.jsx`: Ponto de entrada da aplicação React.
- `.env`: Variáveis de ambiente para o cliente.
- `tailwind.config.js`: Configuração do Tailwind CSS.
- `vite.config.js`: Configuração do Vite (bundler e dev server).

## Servidor (Backend)

```
server/
├── src/
│   ├── config/
│   │   └── s3.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── logger.js
│   │   └── roleAuth.js
│   ├── migrations/
│   │   └── 20230101000000-initial-schema.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Table.js
│   │   ├── Waiter.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Reservation.js
│   │   ├── Log.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tables.js
│   │   ├── waiters.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── kitchen.js
│   │   ├── inventory.js
│   │   ├── financialReports.js
│   │   └── reservations.js
│   ├── seeders/
│   │   └── seed.js
│   └── index.js
├── .env
└── package.json
```

### Descrição dos arquivos principais do servidor:

- `src/config/s3.js`: Configuração para upload de arquivos para Amazon S3.
- `src/middleware/`: Contém middlewares para autenticação, logging e controle de acesso baseado em funções.
- `src/models/`: Define os modelos Sequelize para interação com o banco de dados.
- `src/routes/`: Contém todas as rotas da API, organizadas por recurso.
- `src/seeders/seed.js`: Script para popular o banco de dados com dados iniciais.
- `src/index.js`: Ponto de entrada do servidor, configura Express e inicia o servidor.
- `.env`: Variáveis de ambiente para o servidor.
- `src/migrations/20230101000000-initial-schema.js`: Define a estrutura inicial do banco de dados.
- `src/seeders/seed.js`: Script para popular o banco de dados com dados iniciais.
- `src/index.js`: Ponto de entrada do servidor, configura Express, executa migrations e seed, e inicia o servidor.

## Arquivos na Raiz

- `docker-compose.yml`: Define e configura os serviços Docker (cliente, servidor, banco de dados).
- `README.md`: Fornece uma visão geral do projeto e instruções de instalação/execução.
- `PROJECT_STRUCTURE.md`: Este arquivo, descrevendo a estrutura do projeto.

## Responsabilidades Principais

1. **Cliente (Frontend)**:
   - Renderizar a interface do usuário
   - Gerenciar o estado da aplicação no lado do cliente
   - Fazer chamadas à API do servidor
   - Lidar com a autenticação do usuário no frontend
   - Fornecer visualizações em tempo real (usando sockets)

2. **Servidor (Backend)**:
   - Processar requisições da API
   - Interagir com o banco de dados
   - Implementar lógica de negócios
   - Gerenciar autenticação e autorização
   - Lidar com uploads de arquivos
   - Gerar relatórios financeiros
   - Fornecer atualizações em tempo real via WebSockets

3. **Banco de Dados**:
   - Armazenar dados de usuários, mesas, produtos, pedidos, etc.
   - Manter a integridade dos dados através de relações e restrições

4. **Docker**:
   - Facilitar a configuração e implantação consistente do ambiente de desenvolvimento
   - Gerenciar a comunicação entre os diferentes serviços (cliente, servidor, banco de dados)

Este projeto segue uma arquitetura de aplicação web moderna, separando claramente as responsabilidades entre frontend e backend, utilizando um banco de dados relacional e facilitando o desenvolvimento e implantação através de containerização com Docker.
