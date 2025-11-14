import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ColunaController } from '../controllers/coluna.controller.js'
import {
  CreateColunaSchema,
  UpdateColunaSchema,
  ColunaResponseSchema,
  ColunasListResponseSchema,
  ColunaParamsSchema
} from '../schemas/coluna.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'
import { authMiddleware } from '../middleware/auth.js'

export async function colunaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ColunaController(app.prisma)

  // GET /colunas - Listar todas as colunas
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as colunas de tabelas com seus relacionamentos',
      tags: ['Colunas'],
      summary: 'Listar colunas',
      querystring: PaginationSchema,
      response: {
        200: ColunasListResponseSchema
      }
    }
  }, async (request, reply) => {
    await controller.findMany(request, reply)
  })

  // GET /colunas/:id - Buscar coluna por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar coluna específica por ID com seus relacionamentos',
      tags: ['Colunas'],
      summary: 'Buscar coluna por ID',
      params: ColunaParamsSchema,
      response: {
        200: ColunaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.findById(request, reply)
  })

  // POST /colunas - Criar nova coluna
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova coluna no catálogo de dados',
      tags: ['Colunas'],
      summary: 'Criar coluna',
      body: CreateColunaSchema,
      response: {
        201: ColunaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.create(request, reply)
  })

  // PUT /colunas/:id - Atualizar coluna
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de uma coluna específica',
      tags: ['Colunas'],
      summary: 'Atualizar coluna',
      params: ColunaParamsSchema,
      body: UpdateColunaSchema,
      response: {
        200: ColunaResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.update(request, reply)
  })

  // DELETE /colunas/:id - Deletar coluna
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir coluna do catálogo de dados',
      tags: ['Colunas'],
      summary: 'Excluir coluna',
      params: ColunaParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: ColunaResponseSchema.shape.data
        }),
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.delete(request, reply)
  })
}
