# Arquitetura

## Visão geral

O projeto utiliza uma arquitetura cliente-servidor dividida em frontend e backend.

```text
┌─────────────────────────────┐
│          React + Vite       │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│           NestJS            │
│           Backend           │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │     TMDb    │
│   + Prisma  │  │     API     │
└─────────────┘  └─────────────┘
```

## Frontend

O frontend é desenvolvido com:
- React;
- TypeScript;
- Vite;
- React Router;
- Axios.

A aplicação é uma SPA e utiliza React Router para controlar as diferentes páginas.

### Principais páginas

/login
/events
/events/:id
/checkout
/tickets
/tickets/:id

/admin
/admin/events/new

/gatekeeper

## Backend

O backend utiliza NestJS e está organizado em módulos.

### Principais áreas

- auth
- movies
- events
- reservations
- payments
- tickets
- validations
- users

Cada módulo possui responsabilidades específicas.

### Controllers

Responsáveis por:
- Receber requests;
- Validar dados de entrada;
- Encaminhar operações para os services;
- Retornar respostas HTTP.


### Services

Responsáveis pela lógica de negócio.

Exemplos:
- Criação de eventos;
- Consulta de filmes;
- Criação de reservas;
- Processamento do pagamento;
- Geração de tickets;
- Validação dos tickets.

---

## Comunicação

Frontend e backend comunicam através de uma API REST.

Exemplo:

React
  |
  | GET /events
  ▼
NestJS
  |
  ▼
Prisma
  |
  ▼
PostgreSQL

---

## Fluxo de compra

Cliente
   │
   ▼
Eventos
   │
   ▼
Seleciona evento
   │
   ▼
Seleciona assento
   │
   ▼
Checkout
   │
   ▼
Reserva
   │
   ▼
Pagamento
   │
   ▼
Ticket
   │
   ▼
QR Code

---

## Fluxo de validação

Gatekeeper
    │
    ▼
Scanner QR
    │
    ▼
QR Token
    │
    ▼
POST /tickets/validate
    │
    ▼
Validação do ticket
    │
    ├── Inválido
    │
    └── Válido
          │
          ▼
       Ticket marcado
       como utilizado

---

## Perfis

### CUSTOMER

Pode:
- Visualizar eventos;
- Escolher assentos;
- Comprar ingressos;
- Consultar ingressos.

### ORGANIZER

Pode:
- Consultar filmes;
- Criar eventos;
- Configurar salas;
- Configurar assentos;
- Definir preços.

### GATEKEEPER

Pode:
- Ler QR Codes;
- Validar ingressos;
- Consultar informações da sessão;
- Impedir reutilização de ingressos.

---

## Estrutura do Projeto

elite-dev/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── movies/
│   │   ├── events/
│   │   ├── reservations/
│   │   ├── payments/
│   │   ├── tickets/
│   │   ├── validations/
│   │   └── users/
│   │
│   └── prisma/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
│
└── docs/