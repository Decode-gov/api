import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { SistemaController } from '../controllers/sistema.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CreateSistemaSchema,
  UpdateSistemaSchema,
  SistemaResponseSchema,
  SistemasListResponseSchema,
  SistemaParamsSchema
} from '../schemas/sistema.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'

export async function sistemaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /api/sistemas - Listar todos os sistemas
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os sistemas cadastrados',
      tags: ['Sistemas'],
      summary: 'Listar sistemas',
      querystring: PaginationSchema,
      response: {
        200: SistemasListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new SistemaController(app.prisma)
    return controller.findMany(request, reply)
  })

  // GET /api/sistemas/:id - Buscar sistema por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar sistema específico por ID',
      tags: ['Sistemas'],
      summary: 'Buscar sistema por ID',
      params: SistemaParamsSchema,
      response: {
        200: SistemaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new SistemaController(app.prisma)
    return controller.findById(request, reply)
  })

  // POST /api/sistemas - Criar novo sistema
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo sistema no catálogo',
      tags: ['Sistemas'],
      summary: 'Criar sistema',
      body: CreateSistemaSchema,
      response: {
        201: SistemaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new SistemaController(app.prisma)
    return controller.create(request, reply)
  })

  // PUT /api/sistemas/:id - Atualizar sistema
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um sistema específico',
      tags: ['Sistemas'],
      summary: 'Atualizar sistema',
      params: SistemaParamsSchema,
      body: UpdateSistemaSchema,
      response: {
        200: SistemaResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new SistemaController(app.prisma)
    return controller.update(request, reply)
  })

  // DELETE /api/sistemas/:id - Deletar sistema
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir sistema do catálogo',
      tags: ['Sistemas'],
      summary: 'Excluir sistema',
      params: SistemaParamsSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new SistemaController(app.prisma)
    return controller.delete(request, reply)
  })
}
