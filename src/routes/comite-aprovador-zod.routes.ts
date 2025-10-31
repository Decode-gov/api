import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ComiteAprovadorController } from '../controllers/comite-aprovador.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CreateComiteAprovadorSchema,
  UpdateComiteAprovadorSchema,
  ComiteAprovadorQueryParamsSchema,
  ComiteAprovadorParamsSchema,
  ComiteAprovadorResponseSchema,
  ComitesAprovadoresListResponseSchema,
  ComiteAprovadorDeleteResponseSchema
} from '../schemas/comite-aprovador.js'

export async function comiteAprovadorZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ComiteAprovadorController(app.prisma)

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  // GET /comites-aprovadores - Listar comitês aprovadores
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os comitês aprovadores cadastrados no sistema',
      tags: ['Comitês Aprovadores'],
      summary: 'Listar comitês aprovadores',
      querystring: ComiteAprovadorQueryParamsSchema,
      response: {
        200: ComitesAprovadoresListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /comites-aprovadores/:id - Buscar comitê aprovador por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar comitê aprovador específico por ID',
      tags: ['Comitês Aprovadores'],
      summary: 'Buscar comitê aprovador',
      params: ComiteAprovadorParamsSchema,
      response: {
        200: ComiteAprovadorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /comites-aprovadores - Criar comitê aprovador
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar um novo comitê aprovador no sistema',
      tags: ['Comitês Aprovadores'],
      summary: 'Cadastrar comitê aprovador',
      body: CreateComiteAprovadorSchema,
      response: {
        201: ComiteAprovadorResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /comites-aprovadores/:id - Atualizar comitê aprovador
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um comitê aprovador específico',
      tags: ['Comitês Aprovadores'],
      summary: 'Atualizar comitê aprovador',
      params: ComiteAprovadorParamsSchema,
      body: UpdateComiteAprovadorSchema,
      response: {
        200: ComiteAprovadorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /comites-aprovadores/:id - Deletar comitê aprovador
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar um comitê aprovador do sistema',
      tags: ['Comitês Aprovadores'],
      summary: 'Deletar comitê aprovador',
      params: ComiteAprovadorParamsSchema,
      response: {
        200: ComiteAprovadorDeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
