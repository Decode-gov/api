import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BancoController } from '../controllers/banco.controller.js'
import {
  CreateBancoSchema,
  UpdateBancoSchema,
  BancoResponseSchema,
  BancosListResponseSchema,
  BancoParamsSchema
} from '../schemas/banco.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'
import { authMiddleware } from '../middleware/auth.js'

export async function bancoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new BancoController(app.prisma)

  // GET /api/bancos - Listar todos os bancos
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os bancos de dados cadastrados com seus relacionamentos',
      tags: ['Bancos de Dados'],
      summary: 'Listar bancos',
      querystring: PaginationSchema,
      response: {
        200: BancosListResponseSchema
      }
    }
  }, async (request, reply) => {
    await controller.findMany(request, reply)
  })

  // GET /api/bancos/:id - Buscar banco por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar banco de dados específico por ID com suas tabelas',
      tags: ['Bancos de Dados'],
      summary: 'Buscar banco por ID',
      params: BancoParamsSchema,
      response: {
        200: BancoResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.findById(request, reply)
  })

  // POST /api/bancos - Criar novo banco
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo banco de dados no catálogo',
      tags: ['Bancos de Dados'],
      summary: 'Criar banco',
      body: CreateBancoSchema,
      response: {
        201: BancoResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.create(request, reply)
  })

  // PUT /api/bancos/:id - Atualizar banco
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um banco específico',
      tags: ['Bancos de Dados'],
      summary: 'Atualizar banco',
      params: BancoParamsSchema,
      body: UpdateBancoSchema,
      response: {
        200: BancoResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.update(request, reply)
  })

  // DELETE /api/bancos/:id - Deletar banco
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir banco de dados do catálogo (somente se não estiver em uso)',
      tags: ['Bancos de Dados'],
      summary: 'Excluir banco',
      params: BancoParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: BancoResponseSchema.shape.data
        }),
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.delete(request, reply)
  })
}
