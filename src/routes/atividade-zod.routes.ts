import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AtividadeController } from '../controllers/atividade.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  AtividadeParamsSchema,
  CreateAtividadeSchema,
  UpdateAtividadeSchema,
  AtividadeResponseSchema,
  AtividadesListResponseSchema
} from '../schemas/atividade.js'

// Schemas Zod para validação
const StatusEnum = z.enum(['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA'])
const PrioridadeEnum = z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'])

const QueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  status: StatusEnum.optional(),
  prioridade: PrioridadeEnum.optional(),
  processoId: z.uuid().optional(),
  responsavel: z.string().optional()
})

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function atividadeZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new AtividadeController(app.prisma)

  // GET /atividades - Listar atividades
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as atividades cadastradas no sistema',
      tags: ['Atividades'],
      summary: 'Listar atividades',
      querystring: QueryParamsSchema,
      response: {
        200: AtividadesListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /atividades/:id - Buscar atividade por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar atividade específica por ID',
      tags: ['Atividades'],
      summary: 'Buscar atividade por ID',
      params: AtividadeParamsSchema,
      response: {
        200: AtividadeResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /atividades - Criar atividade
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova atividade no sistema',
      tags: ['Atividades'],
      summary: 'Criar atividade',
      body: CreateAtividadeSchema,
      response: {
        201: AtividadeResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /atividades/:id - Atualizar atividade
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar atividade existente',
      tags: ['Atividades'],
      summary: 'Atualizar atividade',
      params: AtividadeParamsSchema,
      body: UpdateAtividadeSchema,
      response: {
        200: AtividadeResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /atividades/:id - Deletar atividade
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover atividade do sistema',
      tags: ['Atividades'],
      summary: 'Deletar atividade',
      params: AtividadeParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}