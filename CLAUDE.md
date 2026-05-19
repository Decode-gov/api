# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev           # Start dev server with hot reload (tsx watch)
npm run build         # Build for production with tsup
npm start             # Start production server from dist/

# Database
npm run db:generate   # Generate Prisma client after schema changes
npm run db:migrate    # Run migrations (dev - creates migration files)
npm run db:deploy     # Apply migrations (prod - no migration files)
npm run db:studio     # Open Prisma Studio GUI
npm run db:seed       # Seed the database

# Tests
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # CI mode (run + coverage)
```

To run a single test file:
```bash
npx vitest run src/tests/controllers/comunidade.controller.test.ts
```

## Architecture

**Fastify + Prisma + Zod** REST API for data governance. The app runs on port 3333; Swagger UI is served at `/`.

### Request lifecycle

```
Route (routes/*-zod.routes.ts)
  → authMiddleware (JWT from Authorization header or authToken cookie)
  → AuditMiddleware.preHandler (captures before-state for PUT/DELETE)
  → Controller method
  → AuditMiddleware.onSend (writes LogAuditoria record on success)
```

### Layer conventions

**Routes** (`src/routes/*-zod.routes.ts`): Register Fastify routes with Zod schemas for request/response validation and OpenAPI docs. Each route file exports one `async function` that receives `FastifyInstance`. Routes are collected in `src/routes/index.ts`.

**Controllers** (`src/controllers/*.controller.ts`): All controllers extend `BaseController` (`src/controllers/base.controller.ts`), which provides `validateId()`, `validatePagination()`, and `handleError()`. Each controller receives a `PrismaClient` at construction and calls `this.prisma.<model>.*` directly. No service layer exists between controllers and Prisma.

**Schemas** (`src/schemas/*.ts`): Zod schemas used for both route validation (via `fastify-type-provider-zod`) and OpenAPI response shape documentation.

**Prisma plugin** (`src/plugins/prisma.ts`): Registers `prisma` on `FastifyInstance` via `fastify-plugin` so it is accessible in all routes as `fastify.prisma`.

### Testing pattern

Tests are pure unit tests — Prisma is mocked globally. `src/tests/setup.ts` exports a shared `mockPrisma` object and factory helpers `createMockRequest`, `createMockReply`, and `createMockFastify`. Every controller test file imports these helpers directly:

```ts
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'
```

`vi.clearAllMocks()` is called in `beforeEach` to reset mock state between tests. No integration tests hit a real database.

### ID and pagination

All IDs are UUIDs. `validateId()` in `BaseController` skips UUID validation when `NODE_ENV=test` or `VITEST=true`. Default pagination: `skip=0`, `take=20` (max 100).

### Error handling

`handleError()` in `BaseController` maps Prisma error codes:
- `P2025` → `notFound`
- `P2002` → `conflict`
- Messages containing "inválido" → `badRequest`
- Everything else → `internalServerError`

These rely on `@fastify/sensible` decorators on `reply`.

### Audit log

`AuditMiddleware` auto-audits write operations (`POST`, `PUT`, `DELETE`) on critical entities defined in `isAuditableOperation()`. Audit records are only written when a `userId` can be extracted from the `Authorization` header or `x-user-id` header; silent failure otherwise.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `PORT` | `3333` | HTTP listen port |
| `HOST` | `0.0.0.0` | HTTP listen host |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `COOKIE_SECRET` | `default-secret-key-change-in-production` | Cookie signing |
| `NODE_ENV` | — | `development` enables Prisma query logging and disables CORS restriction |
