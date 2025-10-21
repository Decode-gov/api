import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ComunidadeController } from '../controllers/comunidade.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CreateComunidadeSchema,
  UpdateComunidadeSchema,
  ComunidadeResponseSchema,
  ComunidadeDetailResponseSchema,
  ComunidadesListResponseSchema,
  ComunidadeDeleteResponseSchema,
  ComunidadeParamsSchema
} from '../schemas/comunidade.js'

// Schemas Zod para validação
const QueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional()
})

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function comunidadeZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ComunidadeController(app.prisma)

  // GET /comunidades - Listar todas as comunidades
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as comunidades cadastradas',
      tags: ['Comunidades'],
      summary: 'Listar comunidades',
      querystring: QueryParamsSchema,
      response: {
        200: ComunidadesListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /comunidades/:id - Buscar comunidade por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar comunidade específica por ID com relacionamentos completos (parent, children, papeis, kpis)',
      tags: ['Comunidades'],
      summary: 'Buscar comunidade por ID',
      params: ComunidadeParamsSchema,
      response: {
        200: ComunidadeDetailResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /comunidades - Criar nova comunidade
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova comunidade',
      tags: ['Comunidades'],
      summary: 'Criar comunidade',
      body: CreateComunidadeSchema,
      response: {
        201: ComunidadeResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /comunidades/:id - Atualizar comunidade
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de uma comunidade específica',
      tags: ['Comunidades'],
      summary: 'Atualizar comunidade',
      params: ComunidadeParamsSchema,
      body: UpdateComunidadeSchema,
      response: {
        200: ComunidadeResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /comunidades/:id - Deletar comunidade
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir comunidade',
      tags: ['Comunidades'],
      summary: 'Excluir comunidade',
      params: ComunidadeParamsSchema,
      response: {
        200: ComunidadeDeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
