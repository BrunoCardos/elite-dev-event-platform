# Elite Cinema

Sistema de gestão e venda de ingressos para sessões de cinema.

## Tecnologias

### Frontend
- React
- Vite
- TypeScript
- React Router
- Axios

### Backend
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Swagger / OpenAPI

### Integrações
- TMDb
- QR Code

### API Documentation

A API possui documentação interativa através do Swagger.

Após iniciar o backend, a documentação pode ser acessada em:

http://localhost:3000/docs

## Funcionalidades

### Cliente
- Login
- Visualização de sessões
- Consulta de filmes
- Visualização de mapa de assentos
- Seleção de assento
- Compra de ingresso
- Visualização de ingresso
- Consulta dos próprios ingressos
- QR Code

### Organizador
- Dashboard
- Pesquisa de filmes no TMDb
- Criação de sessões
- Configuração da sala
- Configuração de filas e assentos
- Definição de preço

### Gatekeeper
- Leitura de QR Code
- Validação de ingresso
- Verificação da sessão
- Verificação do assento
- Identificação de ingresso utilizado

## Como executar

### Backend

```bash
cd backend
npm install
npm run seed
npm run start:dev
```
#### Enviroment Variables
DATABASE_URL=...
TMDB_API_KEY=...
JWT_SECRET=...

### Frontend
```bash
cd frontend
npm install
npm run dev
```
## Profiles

customer1@test.com
customer2@test.com
organizer@test.com
gatekeeper@test.com

Password: Passsword123!