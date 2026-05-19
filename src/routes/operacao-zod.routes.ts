import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { OperacaoController } from '../controllers/operacao.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { EmpresaFilterSchema } from '../schemas/common.js'
import {
  OperacaoParamsSchema,
  CreateOperacaoSchema,
  UpdateOperacaoSchema,
  OperacaoResponseSchema,
  OperacoesListResponseSchema
} from '../schemas/operacao.js'

export async function operacaoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new OperacaoController(app.prisma)

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  const DeleteResponseSchema = z.object({
    message: z.string(),
    data: z.object({
      id: z.uuid(),
      nome: z.string()
    })
  })

  // GET /operacoes - Listar operações
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as operações cadastradas no sistema',
      tags: ['Operações'],
      summary: 'Listar operações',
      querystring: EmpresaFilterSchema,
      response: {
        200: OperacoesListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /operacoes/:id - Buscar operação por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar operação específica por ID',
      tags: ['Operações'],
      summary: 'Buscar operação por ID',
      params: OperacaoParamsSchema,
      response: {
        200: OperacaoResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /operacoes - Criar operação
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova operação no sistema',
      tags: ['Operações'],
      summary: 'Criar operação',
      body: CreateOperacaoSchema,
      response: {
        201: OperacaoResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

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
        200: OperacaoResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /operacoes/:id - Deletar operação
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover operação do sistema',
      tags: ['Operações'],
      summary: 'Deletar operação',
      params: OperacaoParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}