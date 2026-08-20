# Base de Dados

## PostgreSQL + Prisma

O sistema utiliza PostgreSQL como banco de dados relacional e Prisma como ORM.

A base de dados foi modelada para representar:

- Utilizadores;
- Filmes;
- Eventos;
- Assentos;
- Reservas;
- Pagamentos;
- Tickets;
- Validações.



## User

Representa os utilizadores da plataforma.

Principais informações:

- id;
- name;
- email;
- passwordHash;
- role;
- createdAt;
- updatedAt.

## Roles

```text
CUSTOMER
ORGANIZER
GATEKEEPER
```

## Movie

Representa um filme obtido através do TMDb.

Principais campos:

- id;
- tmdbId;
- title;
- overview;
- posterPath;
- releaseDate.

tmdbId é único.

## Event

Representa uma sessão/evento de cinema.

Principais campos:

- id;
- movieId;
- organizerId;
- title;
- description;
- eventDate;
- venue;
- room;
- price;
- status;
- createdAt;
 -updatedAt.

### Relacionamentos:

Movie 1 ───── N Event


User 1 ───── N Event
Seat

Representa um assento pertencente a uma sessão.

Principais campos:

- id;
- eventId;
- row;
- number;
- status.

## Estados:


```text
AVAILABLE
RESERVED
OCCUPIED
```

Cada evento possui os seus próprios assentos.

Relacionamento:

Event 1 ───── N Seat

## Reservation

Representa uma reserva de um assento.

Relaciona:


```text
User
Event
Seat
```

Estados possíveis:

```text
PENDING
CONFIRMED
CANCELLED
EXPIRED
```

## Payment

Representa o pagamento associado a uma reserva.

Estados:

```text
APPROVED
DECLINED
```

## Ticket

Representa o ingresso gerado após uma compra aprovada.

Relaciona-se com a reserva.

Estados:

```text
ACTIVE
USED
CANCELLED
```

Cada ticket possui um qrToken utilizado para gerar e validar o QR Code.

## TicketValidation

Representa a validação de um ingresso realizada pelo Gatekeeper.

Relaciona:

Ticket
Gatekeeper/User

A relação única com o ticket permite impedir múltiplas validações do mesmo ingresso.

```text
Relacionamentos
User
 │
 ├─────────────── Event
 │
 ├─────────────── Reservation
 │
 └─────────────── TicketValidation




Movie
 │
 └─────────────── Event
                    │
                    ├──────── Seat
                    │
                    └──────── Reservation
                              │
                              ├──── Payment
                              │
                              └──── Ticket
```

## Fluxo dos dados

```text
Movie
  ↓
Event
  ↓
Seat
  ↓
Reservation
  ↓
Payment
  ↓
Ticket
  ↓
TicketValidation
```

Esta estrutura permite acompanhar o ciclo completo desde a criação de uma sessão até à validação do ingresso na entrada do cinema.