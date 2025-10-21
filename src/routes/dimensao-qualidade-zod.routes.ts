import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DimensaoQualidadeController } from '../controllers/dimensao-qualidade.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CreateDimensaoQualidadeSchema,
  UpdateDimensaoQualidadeSchema,
  DimensaoQualidadeQueryParamsSchema,
  DimensaoQualidadeParamsSchema,
  DimensaoQualidadeResponseSchema,
  DimensoesQualidadeListResponseSchema,
  DimensaoQualidadeDeleteResponseSchema,
  ErrorResponseSchema
} from '../schemas/dimensao-qualidade.js'

export async function dimensaoQualidadeZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new DimensaoQualidadeController(app.prisma)

  // GET /dimensoes-qualidade - Listar dimensões
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as dimensões de qualidade com relacionamentos (política e regras)',
      tags: ['Dimensões de Qualidade'],
      summary: 'Listar dimensões de qualidade',
      querystring: DimensaoQualidadeQueryParamsSchema,
      response: {
        200: DimensoesQualidadeListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /dimensoes-qualidade/:id - Buscar dimensão por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar dimensão de qualidade por ID com relacionamentos completos',
      tags: ['Dimensões de Qualidade'],
      summary: 'Buscar dimensão por ID',
      params: DimensaoQualidadeParamsSchema,
      response: {
        200: DimensaoQualidadeResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /dimensoes-qualidade - Criar nova dimensão
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar uma nova dimensão de qualidade',
      tags: ['Dimensões de Qualidade'],
      summary: 'Criar dimensão de qualidade',
      body: CreateDimensaoQualidadeSchema,
      response: {
        201: DimensaoQualidadeResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /dimensoes-qualidade/:id - Atualizar dimensão
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar uma dimensão de qualidade existente',
      tags: ['Dimensões de Qualidade'],
      summary: 'Atualizar dimensão',
      params: DimensaoQualidadeParamsSchema,
      body: UpdateDimensaoQualidadeSchema,
      response: {
        200: DimensaoQualidadeResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /dimensoes-qualidade/:id - Deletar dimensão
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar uma dimensão de qualidade',
      tags: ['Dimensões de Qualidade'],
      summary: 'Deletar dimensão',
      params: DimensaoQualidadeParamsSchema,
      response: {
        200: DimensaoQualidadeDeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
