import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ComunidadeController } from '../controllers/comunidade.controller.js'
import {
  CreateComunidadeSchema,
  UpdateComunidadeSchema,
  ComunidadeResponseSchema,
  ComunidadesListResponseSchema,
  ComunidadeParamsSchema
} from '../schemas/comunidade.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'

export async function comunidadeZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /api/comunidades - Listar todas as comunidades
  app.get('/', {
    schema: {
      description: 'Listar todas as comunidades cadastradas',
      tags: ['Comunidades'],
      summary: 'Listar comunidades',
      querystring: PaginationSchema,
      response: {
        200: ComunidadesListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ComunidadeController(app.prisma)
    return controller.findMany(request, reply)
  })

  // GET /api/comunidades/:id - Buscar comunidade por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar comunidade específica por ID',
      tags: ['Comunidades'],
      summary: 'Buscar comunidade por ID',
      params: ComunidadeParamsSchema,
      response: {
        200: ComunidadeResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ComunidadeController(app.prisma)
    return controller.findById(request, reply)
  })

  // POST /api/comunidades - Criar nova comunidade
  app.post('/', {
    schema: {
      description: 'Criar nova comunidade',
      tags: ['Comunidades'],
      summary: 'Criar comunidade',
      body: CreateComunidadeSchema,
      response: {
        201: ComunidadeResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ComunidadeController(app.prisma)
    return controller.create(request, reply)
  })

  // PUT /api/comunidades/:id - Atualizar comunidade
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma comunidade específica',
      tags: ['Comunidades'],
      summary: 'Atualizar comunidade',
      params: ComunidadeParamsSchema,
      body: UpdateComunidadeSchema,
      response: {
        200: ComunidadeResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ComunidadeController(app.prisma)
    return controller.update(request, reply)
  })

  // DELETE /api/comunidades/:id - Deletar comunidade
  app.delete('/:id', {
    schema: {
      description: 'Excluir comunidade',
      tags: ['Comunidades'],
      summary: 'Excluir comunidade',
      params: ComunidadeParamsSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ComunidadeController(app.prisma)
    return controller.delete(request, reply)
  })
}
