import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CriticidadeRegulatoriaController } from '../controllers/criticidade-regulatoria.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CriticidadeRegulatoriaParamsSchema,
  CriticidadeRegulatoriaQueryParamsSchema,
  CreateCriticidadeRegulatoriaSchema,
  UpdateCriticidadeRegulatoriaSchema,
  CriticidadeRegulatoriaResponseSchema,
  CriticidadesRegulatoriasListResponseSchema
} from '../schemas/criticidade-regulatoria.js'

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function criticidadeRegulatoriaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new CriticidadeRegulatoriaController(app.prisma)

  // GET /criticidades-regulatorias - Listar criticidades
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as criticidades regulatórias do sistema',
      tags: ['Criticidades Regulatórias'],
      summary: 'Listar criticidades',
      querystring: CriticidadeRegulatoriaQueryParamsSchema,
      response: {
        200: CriticidadesRegulatoriasListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /criticidades-regulatorias/:id - Buscar criticidade por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar criticidade regulatória específica por ID',
      tags: ['Criticidades Regulatórias'],
      summary: 'Buscar criticidade',
      params: CriticidadeRegulatoriaParamsSchema,
      response: {
        200: CriticidadeRegulatoriaResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /criticidades-regulatorias - Criar criticidade
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova criticidade regulatória no sistema',
      tags: ['Criticidades Regulatórias'],
      summary: 'Criar criticidade',
      body: CreateCriticidadeRegulatoriaSchema,
      response: {
        201: CriticidadeRegulatoriaResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /criticidades-regulatorias/:id - Atualizar criticidade
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar criticidade regulatória existente',
      tags: ['Criticidades Regulatórias'],
      summary: 'Atualizar criticidade',
      params: CriticidadeRegulatoriaParamsSchema,
      body: UpdateCriticidadeRegulatoriaSchema,
      response: {
        200: CriticidadeRegulatoriaResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /criticidades-regulatorias/:id - Deletar criticidade
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover criticidade regulatória do sistema',
      tags: ['Criticidades Regulatórias'],
      summary: 'Deletar criticidade',
      params: CriticidadeRegulatoriaParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
