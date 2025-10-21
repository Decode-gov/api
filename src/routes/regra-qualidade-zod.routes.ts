import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { RegraQualidadeController } from '../controllers/regra-qualidade.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  RegraQualidadeParamsSchema,
  RegraQualidadeQueryParamsSchema,
  CreateRegraQualidadeSchema,
  UpdateRegraQualidadeSchema,
  RegraQualidadeResponseSchema,
  RegrasQualidadeListResponseSchema
} from '../schemas/regra-qualidade.js'

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function regraQualidadeZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new RegraQualidadeController(app.prisma)

  // GET /regras-qualidade - Listar regras de qualidade
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as regras de qualidade do sistema',
      tags: ['Regras de Qualidade'],
      summary: 'Listar regras de qualidade',
      querystring: RegraQualidadeQueryParamsSchema,
      response: {
        200: RegrasQualidadeListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /regras-qualidade/:id - Buscar regra por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar regra de qualidade específica por ID',
      tags: ['Regras de Qualidade'],
      summary: 'Buscar regra de qualidade',
      params: RegraQualidadeParamsSchema,
      response: {
        200: RegraQualidadeResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /regras-qualidade - Criar regra
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova regra de qualidade no sistema',
      tags: ['Regras de Qualidade'],
      summary: 'Criar regra de qualidade',
      body: CreateRegraQualidadeSchema,
      response: {
        201: RegraQualidadeResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /regras-qualidade/:id - Atualizar regra
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar regra de qualidade existente',
      tags: ['Regras de Qualidade'],
      summary: 'Atualizar regra de qualidade',
      params: RegraQualidadeParamsSchema,
      body: UpdateRegraQualidadeSchema,
      response: {
        200: RegraQualidadeResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /regras-qualidade/:id - Deletar regra
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover regra de qualidade do sistema',
      tags: ['Regras de Qualidade'],
      summary: 'Deletar regra de qualidade',
      params: RegraQualidadeParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
