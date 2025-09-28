import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { PapelController } from '../controllers/papel.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  PapelParamsSchema,
  CreatePapelSchema,
  UpdatePapelSchema,
  PapelResponseSchema,
  PapeisListResponseSchema
} from '../schemas/papel'

export async function papelZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new PapelController(app.prisma)

  // GET /papeis - Listar papéis
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os papéis de governança cadastrados no sistema',
      tags: ['Papéis'],
      summary: 'Listar papéis de governança',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' }
        }
      },
      response: {
        200: PapeisListResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request, reply)
  })

  // GET /papeis/:id - Buscar papel por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar papel de governança específico por ID',
      tags: ['Papéis'],
      summary: 'Buscar papel de governança',
      params: PapelParamsSchema,
      response: {
        200: PapelResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /papeis - Criar papel
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Permitir o registro dos papéis formais no modelo de governança de dados, conforme definido nas políticas institucionais',
      tags: ['Papéis'],
      summary: 'Cadastrar papel de governança',
      body: CreatePapelSchema,
      response: {
        201: PapelResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request, reply)
  })

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
        200: PapelResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request, reply)
  })

  // DELETE /papeis/:id - Deletar papel
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar um papel do sistema',
      tags: ['Papéis'],
      summary: 'Deletar papel',
      params: PapelParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.delete.bind(controller))
}

