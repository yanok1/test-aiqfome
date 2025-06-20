# Test Aiqfome

Projeto de teste para Aiqfome desenvolvido com NestJS e TypeORM.

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

4. Acesse a aplicação:
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

4. Acesse a documentação:
- **Swagger UI**: http://localhost:3000/docs

## 📁 Estrutura do Projeto

```
test-aiqfome/
├── src/                    # Código fonte
├── docker-compose.yml      # Configuração Docker
├── Dockerfile.dev         # Dockerfile para desenvolvimento
├── package.json           # Dependências do projeto
├── tsconfig.json          # Configuração TypeScript
└── README.md              # Este arquivo
```

## 🛠️ Scripts Disponíveis

- `npm run start:dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter

## 📚 Documentação da API

A documentação da API está disponível através do Swagger UI em:
- **Desenvolvimento**: http://localhost:3000/docs
- **Docker**: http://localhost:3000/docs

## 🔧 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e sessões
- **Docker** - Containerização
- **TypeScript** - Linguagem de programação
- **Swagger** - Documentação da API