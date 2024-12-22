# Sistema de Gerenciamento de Restaurante

Este é um sistema completo de gerenciamento de restaurante, incluindo frontend em React e backend em Node.js.

## Requisitos

- Docker
- Docker Compose

## Configuração e Execução

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/restaurant-management-system.git
   cd restaurant-management-system
   ```

2. Crie um arquivo `.env` na pasta `server` baseado no `.env.example` e preencha com suas configurações.

3. Execute o sistema usando Docker Compose:
   ```
   docker-compose up --build
   ```

4. O sistema estará disponível em:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

5. Use as seguintes credenciais para fazer login:
   - Usuário: admin
   - Senha: admin123

## Desenvolvimento

- Para reconstruir apenas o frontend:
  ```
  docker-compose up -d --no-deps --build client
  ```

- Para reconstruir apenas o backend:
  ```
  docker-compose up -d --no-deps --build server
  ```

## Estrutura do Projeto

- `client/`: Código do frontend (React)
- `server/`: Código do backend (Node.js/Express)

## Principais Funcionalidades

- Gerenciamento de mesas, garçons, produtos e pedidos
- Visão da cozinha com fila de pedidos em tempo real
- Controle de estoque
- Relatórios financeiros
- Sistema de reservas

## Contribuindo

Por favor, leia o arquivo CONTRIBUTING.md para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE.md para detalhes.
# serveai
