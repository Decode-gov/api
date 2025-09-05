# 🏛️ API de Governança de Dados - Dean Melo

![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5%2B-blue)
![Fastify](https://img.shields.io/badge/Fastify-5.5-black)
![Prisma](https://img.shields.io/badge/Prisma-6.14-2D3748)
![Tests](https://img.shields.io/badge/Tests-159%2F159-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-90%25%2B-green)

## 📋 Sobre o Projeto

A **API de Governança de Dados Dean Melo** é uma solução completa para gestão corporativa de dados, implementando práticas modernas de Data Governance, qualidade de dados e compliance regulatório. O projeto foi desenvolvido com foco em performance, segurança e escalabilidade.

### 🎯 Objetivos Principais

- **Governança de Dados**: Controle completo sobre estruturas, definições e qualidade
- **Compliance Regulatório**: Atendimento a normas e regulamentações
- **Auditoria Completa**: Rastreabilidade total de operações
- **Qualidade de Dados**: Regras e validações para integridade
- **Colaboração**: Gestão de comunidades e responsabilidades

## 🏗️ Arquitetura e Tecnologias

### 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 20+ | Runtime JavaScript |
| **TypeScript** | 5.5+ | Tipagem estática |
| **Fastify** | 5.5 | Framework web high-performance |
| **Prisma** | 6.14 | ORM e migrações |
| **PostgreSQL** | 15+ | Banco de dados principal |
| **Zod** | 3.23 | Validação de schemas |
| **Vitest** | 2.1 | Framework de testes |
| **Swagger/OpenAPI** | 3.0 | Documentação da API |

### 🏛️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   API Gateway   │───▶│   PostgreSQL    │
│   (Swagger UI)  │    │   (Fastify)     │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Controllers   │
                    │   (Business)    │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Prisma ORM    │
                    │   (Data Layer)  │
                    └─────────────────┘
```

### 📁 Estrutura do Projeto

```
api/
├── src/
│   ├── controllers/         # Lógica de negócio
│   │   ├── base.controller.ts
│   │   ├── usuario.controller.ts
│   │   ├── comunidade.controller.ts
│   │   └── ...
│   ├── routes/              # Definição de endpoints
│   │   ├── index.ts
│   │   ├── usuario-zod-final.routes.ts
│   │   └── ...
│   ├── schemas/             # Validações Zod
│   ├── middleware/          # Middlewares (auth, audit)
│   ├── plugins/             # Plugins Fastify
│   ├── types/               # Tipos TypeScript
│   ├── tests/               # Testes unitários
│   └── server.ts            # Configuração principal
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   └── migrations/          # Migrações
├── coverage/                # Relatórios de cobertura
└── docs/                    # Documentação adicional
```

## 🚀 Funcionalidades Principais

### 📊 Gestão de Entidades

| Módulo | Entidades | Funcionalidades |
|--------|-----------|-----------------|
| **Core** | Usuários, Sistemas, Bancos | CRUD completo, autenticação |
| **Estrutural** | Tabelas, Colunas, Tipos de Dados | Metadados, relacionamentos |
| **Governança** | Comunidades, Papéis, Políticas | Hierarquia, responsabilidades |
| **Qualidade** | Regras, Dimensões, Validações | Monitoramento, compliance |
| **Processos** | Processos, KPIs, Regras de Negócio | Workflow, métricas |
| **Documentação** | Definições, Glossários, Repositórios | Conhecimento centralizado |

### 🔧 Funcionalidades Transversais

- **🔍 Auditoria**: Log completo de todas as operações
- **📈 Dashboard**: Métricas e indicadores de qualidade
- **🔒 Segurança**: Autenticação JWT, MFA, validações
- **📤 Import/Export**: Operações em lote
- **📝 Documentação**: Swagger UI interativo

## 🧪 Testes e Qualidade

### 📊 Métricas de Teste

- ✅ **159 testes unitários** (100% passando)
- ✅ **18 suítes de teste** (controllers)
- ✅ **Cobertura 90%+** nos controllers principais
- ✅ **Validação completa** de regras de negócio

### 🧩 Tipos de Teste

```typescript
// Exemplo de teste de regra de negócio
describe('ComunidadeController', () => {
  it('deve retornar erro se comunidade tem dependências', async () => {
    // Testa integridade referencial
    mockPrisma.comunidade.delete.mockRejectedValue(
      new Error('Foreign key constraint')
    )
    
    await controller.delete(mockRequest, mockReply)
    expect(mockReply.status).toHaveBeenCalledWith(400)
  })
})
```

### 🏃‍♂️ Executando Testes

```bash
# Testes unitários
npm test

# Testes com watch mode
npm run test:watch

# Relatório de cobertura
npm run test:coverage

# Testes para CI/CD
npm run test:ci
```

## 🛠️ Desenvolvimento

### 📋 Pré-requisitos

- **Node.js** 20+ 
- **PostgreSQL** 15+
- **npm** ou **yarn**

### 🚀 Setup Local

1. **Clone o repositório**
```bash
git clone [repository-url]
cd api
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure ambiente**
```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. **Configure banco de dados**
```bash
# Gere o cliente Prisma
npm run prisma:generate

# Execute migrações
npm run prisma:migrate

# (Opcional) Abra Prisma Studio
npm run prisma:studio
```

5. **Inicie desenvolvimento**
```bash
npm run dev
```

6. **Acesse documentação**
```
http://localhost:3333/docs
```

### 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm start` | Inicia servidor de produção |
| `npm test` | Executa testes |
| `npm run prisma:studio` | Interface visual do banco |

## 📚 Documentação da API

### 🌐 Swagger UI

A documentação interativa está disponível em `/docs` quando o servidor está rodando.

**Acesso local**: http://localhost:3333/docs

### 📋 Principais Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/usuarios` | GET, POST, PUT, DELETE | Gestão de usuários |
| `/colunas` | GET, POST, PUT, DELETE | Gestão de colunas |
| `/kpis` | GET, POST, PUT, DELETE | Gestão de KPIs |
| `/processos` | GET, POST, PUT, DELETE | Gestão de processos |
| `/definicoes` | GET, POST, PUT, DELETE | Gestão de definições |
| `/papeis` | GET, POST, PUT, DELETE | Gestão de papéis |
| `/necessidades-informacao` | GET, POST, PUT, DELETE | Gestão de necessidades de informação |
| `/regras-negocio` | GET, POST, PUT, DELETE | Gestão de regras de negócio |
| `/comunidades` | GET, POST, PUT, DELETE | Gestão de comunidades |
| `/tabelas` | GET, POST, PUT, DELETE | Gestão de tabelas |
| `/sistemas` | GET, POST, PUT, DELETE | Gestão de sistemas |
| `/bancos` | GET, POST, PUT, DELETE | Gestão de bancos de dados |
| `/politicas-internas` | GET, POST, PUT, DELETE | Gestão de políticas internas |
| `/tipos-dados` | GET, POST, PUT, DELETE | Gestão de tipos de dados |
| `/classificacoes-informacao` | GET, POST, PUT, DELETE | Gestão de classificações de informação |
| `/repositorios-documento` | GET, POST, PUT, DELETE | Gestão de repositórios de documentos |
| `/dashboard` | GET | Métricas e dashboards |
| `/mfa` | POST | Operações de Multi-Factor Authentication |
| `/auditoria` | GET | Logs de auditoria |
| `/importacao-exportacao` | GET, POST | Importação e exportação de dados |
| `/listas-referencia` | GET | Listas de referência para campos |

### 🔐 Autenticação

```typescript
// Header de autenticação
Authorization: Bearer <jwt-token>

// Exemplo de login
POST /auth/login
{
  "email": "user@example.com",
  "senha": "password"
}
```

## 🔒 Segurança

### 🛡️ Medidas Implementadas

- **Validação rigorosa** com Zod
- **Sanitização** de entrada
- **Hashing** de senhas com bcryptjs
- **CORS** configurado
- **Rate limiting** via Fastify sensible
- **Auditoria completa** de operações

### 🔑 Autenticação e Autorização

```typescript
// Middleware de autenticação
app.addHook('preHandler', async (request, reply) => {
  // Validação JWT
  // Verificação de permissões
  // Log de auditoria
})
```

## 📈 Performance

### ⚡ Otimizações

- **Fastify**: Framework de alta performance
- **Prisma**: Queries otimizadas
- **Índices**: Estratégicos no banco
- **Paginação**: Implementada em todas as listas
- **Validação**: Zod para performance de validação

### 📊 Métricas

- **Startup**: < 2s
- **Response time**: < 100ms (operações simples)
- **Throughput**: 1000+ req/s (hardware dependente)
- **Memory usage**: < 100MB (baseline)

## 🐳 Deploy e Produção

### 🏭 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Server
PORT=3333
HOST=0.0.0.0
NODE_ENV=production

# Security
JWT_SECRET="your-secret-key"
```

### 🚀 Deploy com Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["npm", "start"]
```

### 📝 Padrões de Código

- **ESLint**: Linting automático
- **Prettier**: Formatação consistente
- **Conventional Commits**: Padrão de commits
- **TypeScript**: Tipagem obrigatória
- **Testes**: Cobertura mínima 80%

## 📄 Licença

Este projeto está sob licença [MIT](LICENSE).

**Desenvolvido por Adriano Silva**

*API de Governança de Dados - Transformando dados em conhecimento estratégico*
