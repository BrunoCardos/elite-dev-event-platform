# Decisões Técnicas

## React + Vite

Foi escolhido React com Vite para o frontend.

### Motivos

- Configuração simples;
- Desenvolvimento rápido;
- Excelente suporte para TypeScript;
- Ecossistema maduro;
- Adequado para uma aplicação SPA;
- Permite desenvolvimento rápido dentro do prazo do desafio.



## NestJS

Foi escolhido NestJS para o backend.

### Motivos

- Arquitetura modular;
- Organização clara entre controllers, services e módulos;
- Suporte nativo a TypeScript;
- Facilita a criação de APIs REST;
- Boa escalabilidade para projetos maiores.


## Prisma

Foi escolhido Prisma como ORM.

### Motivos

- Tipagem forte;
- Schema centralizado;
- Migrações simples;
- Boa integração com PostgreSQL;
- API intuitiva;
- Produtividade elevada durante o desenvolvimento.

TypeORM foi considerado, mas Prisma foi escolhido por permitir uma implementação mais rápida e previsível dentro do prazo disponível.


## PostgreSQL

PostgreSQL foi utilizado como banco de dados relacional.

### Motivos

- Suporte robusto a relacionamentos;
- Integridade referencial;
- Suporte a transações;
- Adequado para reservas e pagamentos;
- Excelente integração com Prisma.

Durante o desenvolvimento local foi utilizado PostgreSQL instalado diretamente na máquina.


## React Router

React Router foi utilizado para controlar a navegação da aplicação.

As principais áreas são:

- Login;
- Eventos;
- Detalhes do evento;
- Checkout;
- Meus ingressos;
- Dashboard do organizador;
- Criação de eventos;
- Gatekeeper.


## TMDb

A API do TMDb foi utilizada para obter informações sobre filmes.

O sistema utiliza o identificador do filme no TMDb para relacionar o evento ao filme correspondente.

Isso evita a necessidade de manter manualmente todas as informações cinematográficas no sistema.



## Mapa de assentos

Cada evento possui o seu próprio conjunto de assentos.

Foi escolhida essa abordagem para manter o modelo simples e evitar criar uma hierarquia desnecessária de Cinema → Sala → Assento para o escopo do desafio.

Ao criar um evento, o organizador define:

- Filas;
- Número de assentos por fila.

O sistema gera automaticamente os assentos.


## Reservas

As reservas são associadas a:

- Utilizador;
- Evento;
- Assento.

O fluxo permite controlar a disponibilidade dos assentos antes da conclusão da compra.


## Tickets

Após uma compra bem-sucedida é criado um ticket.

Cada ticket possui um identificador seguro utilizado para gerar o QR Code.

O QR Code pode ser posteriormente validado pelo Gatekeeper.


## Gatekeeper

Foi criado um perfil específico para validação dos ingressos.

O Gatekeeper pode:

- Ler o QR Code;
- Validar o ticket;
- Verificar o evento;
- Verificar o assento;
- Impedir a utilização duplicada do ingresso.

## Controle de acesso

A aplicação possui três perfis principais:

- CUSTOMER;
- ORGANIZER;
- GATEKEEPER.

Cada perfil possui uma área específica da aplicação.



## Inteligência Artificial

Ferramentas de IA foram utilizadas como apoio ao desenvolvimento, principalmente para:

- Debugging;
- Estruturação;
- Sugestões de implementação;
- Documentação;
- Resolução de problemas.

As decisões finais foram avaliadas e implementadas manualmente.