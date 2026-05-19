# API - Repositório de Documentos

Documentação completa dos endpoints para gerenciamento de repositórios de documentos.

## Base URL
```
/repositorios-documento
```

---

## 📋 Índice
- [Listar Repositórios](#listar-repositórios)
- [Criar Repositório](#criar-repositório)
- [Atualizar Repositório](#atualizar-repositório)
- [Deletar Repositório](#deletar-repositório)
- [Tipos e Schemas](#tipos-e-schemas)

---

## Listar Repositórios

Retorna uma lista paginada de repositórios de documentos com filtros opcionais.

### Endpoint
```http
GET /repositorios-documento
```

### Query Parameters

| Parâmetro | Tipo      | Obrigatório | Default | Descrição                                    |
|-----------|-----------|-------------|---------|----------------------------------------------|
| `skip`    | `number`  | Não         | `0`     | Número de registros para pular (paginação)   |
| `take`    | `number`  | Não         | `10`    | Número de registros para retornar (1-100)    |
| `orderBy` | `string`  | Não         | -       | Campo para ordenação                         |
| `nome`    | `string`  | Não         | -       | Filtrar por nome (busca case-insensitive)    |
| `ged`     | `boolean` | Não         | -       | Filtrar por repositórios GED                 |
| `rede`    | `boolean` | Não         | -       | Filtrar por repositórios em rede             |

### Exemplo de Requisição
```http
GET /repositorios-documento?skip=0&take=10&ged=true
```

### Resposta de Sucesso (200)

```typescript
{
  message: string
  data: Array<{
    id: string              // UUID
    nome: string
    ged: boolean
    rede: boolean
    createdAt: Date | null
    updatedAt: Date | null
  }>
}
```

### Exemplo de Resposta
```json
{
  "message": "Repositórios de documentos encontrados",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "Repositório Principal GED",
      "ged": true,
      "rede": false,
      "createdAt": "2024-11-14T12:00:00.000Z",
      "updatedAt": "2024-11-14T12:00:00.000Z"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "nome": "Repositório de Rede Compartilhada",
      "ged": false,
      "rede": true,
      "createdAt": "2024-11-14T13:00:00.000Z",
      "updatedAt": "2024-11-14T13:00:00.000Z"
    }
  ]
}
```

---

## Criar Repositório

Cria um novo repositório de documentos.

### Endpoint
```http
POST /repositorios-documento
```

### Request Body

```typescript
{
  nome: string      // Obrigatório, min: 1, max: 255
  ged?: boolean     // Opcional, default: false
  rede?: boolean    // Opcional, default: false
}
```

### Exemplo de Requisição
```json
{
  "nome": "Novo Repositório Corporativo",
  "ged": true,
  "rede": false
}
```

### Resposta de Sucesso (201)

```typescript
{
  message: string
  data: {
    id: string              // UUID
    nome: string
    ged: boolean
    rede: boolean
    createdAt: Date | null
    updatedAt: Date | null
  }
}
```

### Exemplo de Resposta
```json
{
  "message": "Repositório de documentos criado com sucesso",
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "nome": "Novo Repositório Corporativo",
    "ged": true,
    "rede": false,
    "createdAt": "2024-11-14T14:00:00.000Z",
    "updatedAt": "2024-11-14T14:00:00.000Z"
  }
}
```

### Validações

- **nome**: 
  - Obrigatório
  - Mínimo de 1 caractere
  - Máximo de 255 caracteres
  - Erro: `"Nome é obrigatório"` ou `"Nome muito longo"`

- **ged**:
  - Opcional
  - Tipo: boolean
  - Default: `false`

- **rede**:
  - Opcional
  - Tipo: boolean
  - Default: `false`

---

## Atualizar Repositório

Atualiza os dados de um repositório existente.

### Endpoint
```http
PUT /repositorios-documento/:id
```

### Path Parameters

| Parâmetro | Tipo     | Obrigatório | Descrição                      |
|-----------|----------|-------------|--------------------------------|
| `id`      | `string` | Sim         | UUID do repositório            |

### Request Body

Todos os campos são opcionais para atualização.

```typescript
{
  nome?: string      // Opcional, min: 1, max: 255
  ged?: boolean      // Opcional
  rede?: boolean     // Opcional
}
```

### Exemplo de Requisição
```http
PUT /repositorios-documento/550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "nome": "Repositório Principal GED - Atualizado",
  "ged": true
}
```

### Resposta de Sucesso (200)

```typescript
{
  message: string
  data: {
    id: string              // UUID
    nome: string
    ged: boolean
    rede: boolean
    createdAt: Date | null
    updatedAt: Date | null
  }
}
```

### Exemplo de Resposta
```json
{
  "message": "Repositório de documentos atualizado com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Repositório Principal GED - Atualizado",
    "ged": true,
    "rede": false,
    "createdAt": "2024-11-14T12:00:00.000Z",
    "updatedAt": "2024-11-14T15:00:00.000Z"
  }
}
```

### Resposta de Erro (400)
```json
{
  "error": "BadRequest",
  "message": "Nenhum campo fornecido para atualização"
}
```

### Resposta de Erro (404)
```json
{
  "error": "NotFound",
  "message": "Repositório de documentos não encontrado"
}
```

---

## Deletar Repositório

Remove permanentemente um repositório de documentos.

### Endpoint
```http
DELETE /repositorios-documento/:id
```

### Path Parameters

| Parâmetro | Tipo     | Obrigatório | Descrição                      |
|-----------|----------|-------------|--------------------------------|
| `id`      | `string` | Sim         | UUID do repositório            |

### Exemplo de Requisição
```http
DELETE /repositorios-documento/550e8400-e29b-41d4-a716-446655440000
```

### Resposta de Sucesso (200)

```typescript
{
  message: string
}
```

### Exemplo de Resposta
```json
{
  "message": "Repositório de documentos deletado com sucesso"
}
```

### Resposta de Erro (404)
```json
{
  "error": "NotFound",
  "message": "Repositório de documentos não encontrado"
}
```

---

## Tipos e Schemas

### RepositorioDocumento (Completo)

```typescript
interface RepositorioDocumento {
  id: string              // UUID único do repositório
  nome: string            // Nome do repositório (1-255 caracteres)
  ged: boolean            // Indica se é um repositório GED
  rede: boolean           // Indica se é um repositório em rede
  createdAt: Date | null  // Data de criação
  updatedAt: Date | null  // Data da última atualização
}
```

### CreateRepositorioDocumento

```typescript
interface CreateRepositorioDocumento {
  nome: string      // Obrigatório, min: 1, max: 255
  ged?: boolean     // Opcional, default: false
  rede?: boolean    // Opcional, default: false
}
```

### UpdateRepositorioDocumento

```typescript
interface UpdateRepositorioDocumento {
  nome?: string     // Opcional, min: 1, max: 255
  ged?: boolean     // Opcional
  rede?: boolean    // Opcional
}
```

### QueryParams

```typescript
interface RepositorioDocumentoQueryParams {
  skip?: number     // Default: 0, min: 0
  take?: number     // Default: 10, min: 1, max: 100
  orderBy?: string  // Campo para ordenação
  nome?: string     // Filtro por nome (case-insensitive)
  ged?: boolean     // Filtro por repositórios GED
  rede?: boolean    // Filtro por repositórios em rede
}
```

---

## Códigos de Status HTTP

| Código | Descrição                                           |
|--------|-----------------------------------------------------|
| 200    | Sucesso - Operação realizada com sucesso            |
| 201    | Criado - Repositório criado com sucesso             |
| 400    | Bad Request - Dados inválidos ou ausentes           |
| 404    | Not Found - Repositório não encontrado              |
| 500    | Internal Server Error - Erro interno no servidor    |

---

## Exemplos de Uso

### Exemplo 1: Listar todos os repositórios GED

```bash
curl -X GET "http://localhost:3000/repositorios-documento?ged=true" \
  -H "Content-Type: application/json"
```

### Exemplo 2: Criar um novo repositório

```bash
curl -X POST "http://localhost:3000/repositorios-documento" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Repositório de Contratos",
    "ged": true,
    "rede": false
  }'
```

### Exemplo 3: Atualizar um repositório

```bash
curl -X PUT "http://localhost:3000/repositorios-documento/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Repositório de Contratos - Atualizado"
  }'
```

### Exemplo 4: Deletar um repositório

```bash
curl -X DELETE "http://localhost:3000/repositorios-documento/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
```

---

## Notas Importantes

1. **UUID**: Todos os IDs são UUIDs v4 válidos
2. **Paginação**: A paginação usa `skip` e `take` para controle de offset/limit
3. **Filtros**: Os filtros de busca por nome são case-insensitive
4. **Validação**: Todos os campos são validados usando Zod antes do processamento
5. **Timestamps**: Os campos `createdAt` e `updatedAt` são gerenciados automaticamente pelo Prisma
6. **GED**: GED significa "Gerenciamento Eletrônico de Documentos"

---

## Modelo de Dados (Prisma)

```prisma
model RepositorioDocumento {
  id   String  @id @default(uuid()) @db.Uuid
  nome String
  ged  Boolean @default(false)
  rede Boolean @default(false)

  createdAt DateTime? @default(now()) @map("created_at")
  updatedAt DateTime? @map("updated_at")

  @@map("repositorios_documentos")
}
```
