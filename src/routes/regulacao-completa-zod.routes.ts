import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { RegulacaoCompletaController } from '../controllers/regulacao-completa.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  RegulacaoCompletaParamsSchema,
  RegulacaoCompletaQueryParamsSchema,
  CreateRegulacaoCompletaSchema,
  UpdateRegulacaoCompletaSchema,
  RegulacaoCompletaResponseSchema,
  RegulacoesCompletasListResponseSchema
} from '../schemas/regulacao-completa.js'

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function regulacaoCompletaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new RegulacaoCompletaController(app.prisma)

  // GET /regulacoes-completas - Listar regulações
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as regulações completas do sistema',
      tags: ['Regulações Completas'],
      summary: 'Listar regulações',
      querystring: RegulacaoCompletaQueryParamsSchema,
      response: {
        200: RegulacoesCompletasListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /regulacoes-completas/:id - Buscar regulação por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar regulação completa específica por ID',
      tags: ['Regulações Completas'],
      summary: 'Buscar regulação',
      params: RegulacaoCompletaParamsSchema,
      response: {
        200: RegulacaoCompletaResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /regulacoes-completas - Criar regulação
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova regulação completa no sistema',
      tags: ['Regulações Completas'],
      summary: 'Criar regulação',
      body: CreateRegulacaoCompletaSchema,
      response: {
        201: RegulacaoCompletaResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /regulacoes-completas/:id - Atualizar regulação
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar regulação completa existente',
      tags: ['Regulações Completas'],
      summary: 'Atualizar regulação',
      params: RegulacaoCompletaParamsSchema,
      body: UpdateRegulacaoCompletaSchema,
      response: {
        200: RegulacaoCompletaResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /regulacoes-completas/:id - Deletar regulação
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover regulação completa do sistema',
      tags: ['Regulações Completas'],
      summary: 'Deletar regulação',
      params: RegulacaoCompletaParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
