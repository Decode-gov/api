import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { PapelController } from '../controllers/papel.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  PapelParamsSchema,
  CreatePapelSchema,
  UpdatePapelSchema,
  PapelResponseSchema,
  PapeisListResponseSchema
} from '../schemas/papel.js'

export async function papelZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new PapelController(app.prisma)

  // Schemas adicionais
  const QueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.string().optional()
  })

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

  // GET /papeis - Listar papéis
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os papéis de governança cadastrados no sistema',
      tags: ['Papéis'],
      summary: 'Listar papéis de governança',
      querystring: QueryParamsSchema,
      response: {
        200: PapeisListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /papeis/:id - Buscar papel por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar papel de governança específico por ID',
      tags: ['Papéis'],
      summary: 'Buscar papel de governança',
      params: PapelParamsSchema,
      response: {
        200: PapelResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /papeis - Criar papel
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Permitir o registro dos papéis formais no modelo de governança de dados, conforme definido nas políticas institucionais',
      tags: ['Papéis'],
      summary: 'Cadastrar papel de governança',
      body: CreatePapelSchema,
      response: {
        201: PapelResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /papeis/:id - Atualizar papel
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um papel específico',
      tags: ['Papéis'],
      summary: 'Atualizar papel',
      params: PapelParamsSchema,
      body: UpdatePapelSchema,
      response: {
        200: PapelResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /papeis/:id - Deletar papel
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar um papel do sistema',
      tags: ['Papéis'],
      summary: 'Deletar papel',
      params: PapelParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}

