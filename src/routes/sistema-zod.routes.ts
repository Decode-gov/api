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
  const controller = new SistemaController(app.prisma)

  // GET /api/sistemas - Listar todos os sistemas
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os sistemas cadastrados com seus relacionamentos',
      tags: ['Sistemas'],
      summary: 'Listar sistemas',
      querystring: PaginationSchema,
      response: {
        200: SistemasListResponseSchema
      }
    }
  }, async (request, reply) => {
    await controller.findMany(request, reply)
  })

  // GET /api/sistemas/:id - Buscar sistema por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar sistema específico por ID com seus bancos de dados',
      tags: ['Sistemas'],
      summary: 'Buscar sistema por ID',
      params: SistemaParamsSchema,
      response: {
        200: SistemaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.findById(request, reply)
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
    await controller.create(request, reply)
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
    await controller.update(request, reply)
  })

  // DELETE /api/sistemas/:id - Deletar sistema
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir sistema do catálogo (somente se não estiver em uso)',
      tags: ['Sistemas'],
      summary: 'Excluir sistema',
      params: SistemaParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: SistemaResponseSchema.shape.data
        }),
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.delete(request, reply)
  })
}
