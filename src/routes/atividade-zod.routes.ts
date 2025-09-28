import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AtividadeController } from '../controllers/atividade.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  AtividadeParamsSchema,
  CreateAtividadeSchema,
  UpdateAtividadeSchema,
  AtividadeResponseSchema,
  AtividadesListResponseSchema
} from '../schemas/atividade'

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
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          status: { type: 'string', enum: ['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA'] },
          prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] },
          processoId: { type: 'string', format: 'uuid' },
          responsavel: { type: 'string' }
        }
      },
      response: {
        200: AtividadesListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request, reply)
  })

  // GET /atividades/:id - Buscar atividade por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar atividade específica por ID',
      tags: ['Atividades'],
      summary: 'Buscar atividade por ID',
      params: AtividadeParamsSchema,
      response: {
        200: AtividadeResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request, reply)
  })

  // POST /atividades - Criar atividade
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova atividade no sistema',
      tags: ['Atividades'],
      summary: 'Criar atividade',
      body: CreateAtividadeSchema,
      response: {
        201: AtividadeResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request, reply)
  })

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
        200: AtividadeResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request, reply)
  })

  // DELETE /atividades/:id - Deletar atividade
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover atividade do sistema',
      tags: ['Atividades'],
      summary: 'Deletar atividade',
      params: AtividadeParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.delete(request, reply)
  })
}