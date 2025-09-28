import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { OperacaoController } from '../controllers/operacao.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  OperacaoParamsSchema,
  CreateOperacaoSchema,
  UpdateOperacaoSchema,
  OperacaoResponseSchema,
  OperacoesListResponseSchema
} from '../schemas/operacao'

export async function operacaoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new OperacaoController(app.prisma)

  // GET /operacoes - Listar operações
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as operações cadastradas no sistema',
      tags: ['Operações'],
      summary: 'Listar operações',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          tipo: { type: 'string', enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PROCESS', 'VALIDATE', 'TRANSFORM'] },
          frequencia: { type: 'string', enum: ['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL', 'EVENTUAL'] },
          complexidade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'] },
          atividadeId: { type: 'string', format: 'uuid' },
          automatizada: { type: 'boolean' },
          critica: { type: 'boolean' }
        }
      },
      response: {
        200: OperacoesListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request, reply)
  })

  // GET /operacoes/:id - Buscar operação por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar operação específica por ID',
      tags: ['Operações'],
      summary: 'Buscar operação por ID',
      params: OperacaoParamsSchema,
      response: {
        200: OperacaoResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request, reply)
  })

  // POST /operacoes - Criar operação
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova operação no sistema',
      tags: ['Operações'],
      summary: 'Criar operação',
      body: CreateOperacaoSchema,
      response: {
        201: OperacaoResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request, reply)
  })

  // PUT /operacoes/:id - Atualizar operação
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar operação existente',
      tags: ['Operações'],
      summary: 'Atualizar operação',
      params: OperacaoParamsSchema,
      body: UpdateOperacaoSchema,
      response: {
        200: OperacaoResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request, reply)
  })

  // DELETE /operacoes/:id - Deletar operação
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover operação do sistema',
      tags: ['Operações'],
      summary: 'Deletar operação',
      params: OperacaoParamsSchema,
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