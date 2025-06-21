# Test Aiqfome

API RESTful para gerenciar produtos favoritos de clientes, desenvolvida com NestJS, TypeORM e integração com a FakeStore API.

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20.19.1+ (para desenvolvimento local)

### Executando com Docker

1. Clone o repositório:
```bash
git clone <repository-url>
cd test-aiqfome
```

2. Copie o arquivo de ambiente:
```bash
cp env.example .env
```

3. Execute o projeto:
```bash
docker-compose up -d
```

4. Execute as migrations:
```bash
docker-compose exec app npm run migration:run
```

5. Acesse a aplicação:
- API: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Desenvolvimento Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

3. Execute o projeto:
```bash
npm run start:dev
```

4. Execute as migrations:
```bash
npm run migration:run
```

5. Acesse a documentação:
- **Swagger UI**: http://localhost:3000/docs

## 📁 Estrutura do Projeto

```
test-aiqfome/
├── src/
│   ├── auth/               # Autenticação JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   ├── customers/          # Gestão de clientes
│   │   ├── customers.controller.ts
│   │   ├── customers.service.ts
│   │   └── dto/
│   │       ├── create-customer.dto.ts
│   │       └── update-customer.dto.ts
│   ├── favorites/          # Gestão de favoritos
│   │   ├── favorites.controller.ts
│   │   ├── favorites.service.ts
│   │   └── dto/
│   │       ├── create-favorite.dto.ts
│   │       └── favorite-response.dto.ts
│   ├── services/           # Serviços externos
│   │   └── fakestore.service.ts
│   ├── entities/           # Entidades TypeORM
│   │   ├── customer.entity.ts
│   │   └── favorite.entity.ts
│   ├── database/
│   │   └── migrations/     # Migrations do banco
│   ├── common/             # Interceptors e filtros
│   │   ├── interceptors/
│   │   │   ├── response.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── config/             # Configurações
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── typeorm.config.ts
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml      # Configuração Docker
├── Dockerfile.dev         # Dockerfile para desenvolvimento
├── package.json           # Dependências do projeto
├── tsconfig.json          # Configuração TypeScript
└── README.md              # Este arquivo
```

## 🛠️ Scripts Disponíveis

- `npm run start:dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm run test` - Executa os testes unitários
- `npm run lint` - Executa o linter e formatação
- `npm run format` - Formata o código com Prettier

### Scripts de Banco de Dados

- `npm run migration:generate` - Gera nova migration
- `npm run migration:run` - Executa migrations pendentes
- `npm run migration:revert` - Reverte última migration
- `npm run schema:sync` - Sincroniza schema (apenas desenvolvimento)
- `npm run schema:drop` - Remove todas as tabelas

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
- **Desenvolvimento**: http://localhost:3000/docs
- **Docker**: http://localhost:3000/docs

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registrar novo cliente
- `POST /auth/login` - Login do cliente

#### Clientes
- `GET /customers` - Listar todos os clientes
- `GET /customers/:id` - Buscar cliente por ID
- `POST /customers` - Criar novo cliente
- `PATCH /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Remover cliente

#### Favoritos
- `GET /favorites` - Listar favoritos do cliente
- `GET /favorites/:id` - Buscar favorito por ID
- `POST /favorites` - Adicionar produto aos favoritos
- `DELETE /favorites/:id` - Remover favorito por ID
- `DELETE /favorites/product/:productId` - Remover favorito por ID do produto

## 🗄️ Banco de Dados

### Entidades

- **Customers** - Clientes do sistema
  - `id`, `name`, `email`, `password`
  - `createdAt`, `updatedAt`

- **Favorites** - Produtos favoritos dos clientes
  - `id`, `customerId`, `productId`
  - `productTitle`, `productImage`, `productPrice`, `productRating`
  - `createdAt`, `updatedAt`

### Configuração

O banco de dados está configurado com:
- PostgreSQL 15
- TypeORM como ORM
- Migrations para controle de versão
- Índices otimizados para performance
- Relacionamentos entre entidades

## 🔧 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache de produtos
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **bcryptjs** - Hash de senhas
- **class-validator** - Validação de dados
- **class-sanitizer** - Sanitização de dados
- **@nestjs/throttler** - Rate limiting
- **helmet** - Headers de segurança
- **Docker** - Containerização
- **TypeScript** - Linguagem de programação
- **Swagger** - Documentação da API

## 🔒 Segurança

- **Autenticação JWT** - Tokens seguros para acesso
- **Rate Limiting** - 100 requisições por minuto por IP
- **Headers de Segurança** - CSP, XSS, HSTS, etc.
- **Validação de Dados** - Validação rigorosa de entrada
- **Sanitização** - Prevenção de ataques de injeção
- **Hash de Senhas** - Senhas criptografadas com bcrypt

## 🚀 Funcionalidades

- **Autenticação Completa** - Registro, login e proteção de rotas
- **Gestão de Clientes** - CRUD completo de clientes
- **Sistema de Favoritos** - Adicionar, listar e remover favoritos
- **Integração FakeStore** - Validação de produtos via API externa
- **Cache Redis** - Cache de produtos para performance
- **Logs Estruturados** - Logs detalhados em formato JSON
- **Respostas Padronizadas** - Formato consistente de resposta
- **Tratamento de Erros** - Tratamento centralizado de exceções
- **Documentação Swagger** - Documentação interativa da API

## 📊 Integração com FakeStore API

O projeto integra com a [FakeStore API](https://fakestoreapi.com/docs) para:
- Validar produtos antes de adicionar aos favoritos
- Buscar informações completas dos produtos
- Cache de produtos para melhor performance
- Tratamento de erros da API externa