# Test Aiqfome

Projeto de teste para Aiqfome desenvolvido com NestJS e TypeORM, baseado na estrutura da FakeStore API.

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)

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
│   ├── config/              # Configurações
│   │   ├── database.config.ts
│   │   └── typeorm.config.ts
│   ├── entities/            # Entidades TypeORM
│   │   ├── user.entity.ts
│   │   ├── product.entity.ts
│   │   └── cart.entity.ts
│   ├── database/
│   │   └── migrations/      # Migrations do banco
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml       # Configuração Docker
├── Dockerfile.dev          # Dockerfile para desenvolvimento
├── package.json            # Dependências do projeto
├── tsconfig.json           # Configuração TypeScript
└── README.md               # Este arquivo
```

## 🛠️ Scripts Disponíveis

- `npm run start:dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter

### Scripts de Banco de Dados

- `npm run migration:generate` - Gera nova migration
- `npm run migration:run` - Executa migrations pendentes
- `npm run migration:revert` - Reverte última migration
- `npm run schema:sync` - Sincroniza schema (apenas desenvolvimento)
- `npm run schema:drop` - Remove todas as tabelas

## 📚 Documentação da API

A documentação da API está disponível através do Swagger UI em:
- **Desenvolvimento**: http://localhost:3000/docs
- **Docker**: http://localhost:3000/docs

## 🗄️ Banco de Dados

### Entidades Baseadas na FakeStore API

- **Users** - Usuários do sistema
  - `id`, `email`, `username`, `password`
  - `name`: `{ firstname, lastname }`
  - `address`: `{ geolocation, city, street, number, zipcode }`
  - `phone`

- **Products** - Produtos disponíveis
  - `id`, `title`, `price`, `description`
  - `category`, `image`
  - `rating`: `{ rate, count }`

- **Carts** - Carrinhos de compra
  - `id`, `userId`, `date`
  - `products`: `[{ productId, quantity }]`

### Configuração

O banco de dados está configurado com:
- PostgreSQL 15
- TypeORM como ORM
- Migrations para controle de versão
- Índices otimizados para performance
- Estrutura simplificada baseada na FakeStore API

## 🔧 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **Docker** - Containerização
- **TypeScript** - Linguagem de programação
- **Swagger** - Documentação da API

## 📊 Referência da API

Este projeto segue a estrutura da [FakeStore API](https://fakestoreapi.com/docs) para garantir compatibilidade e simplicidade na implementação.