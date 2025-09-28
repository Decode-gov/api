import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { PoliticaInternaController } from '../controllers/politica-interna.controller.js'
import {
  CreatePoliticaInternaSchema,
  UpdatePoliticaInternaSchema,
  PoliticaInternaResponseSchema,
  PoliticasInternasListResponseSchema,
  PoliticaInternaParamsSchema
} from '../schemas/politica-interna.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'

export async function politicaInternaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /api/politicas-internas - Listar todas as políticas internas
  app.get('/', {
    schema: {
      description: 'Listar todas as políticas internas cadastradas',
      tags: ['Políticas Internas'],
      summary: 'Listar políticas internas',
      querystring: PaginationSchema,
      response: {
        200: PoliticasInternasListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new PoliticaInternaController(app.prisma)
    return controller.findMany(request, reply)
  })

  // GET /api/politicas-internas/:id - Buscar política interna por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar política interna específica por ID',
      tags: ['Políticas Internas'],
      summary: 'Buscar política interna por ID',
      params: PoliticaInternaParamsSchema,
      response: {
        200: PoliticaInternaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new PoliticaInternaController(app.prisma)
    return controller.findById(request, reply)
  })

  // POST /api/politicas-internas - Criar nova política interna
  app.post('/', {
    schema: {
      description: 'Criar nova política interna',
      tags: ['Políticas Internas'],
      summary: 'Criar política interna',
      body: CreatePoliticaInternaSchema,
      response: {
        201: PoliticaInternaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new PoliticaInternaController(app.prisma)
    return controller.create(request, reply)
  })

  // PUT /api/politicas-internas/:id - Atualizar política interna
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma política interna específica',
      tags: ['Políticas Internas'],
      summary: 'Atualizar política interna',
      params: PoliticaInternaParamsSchema,
      body: UpdatePoliticaInternaSchema,
      response: {
        200: PoliticaInternaResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new PoliticaInternaController(app.prisma)
    return controller.update(request, reply)
  })

  // DELETE /api/politicas-internas/:id - Deletar política interna
  app.delete('/:id', {
    schema: {
      description: 'Excluir política interna',
      tags: ['Políticas Internas'],
      summary: 'Excluir política interna',
      params: PoliticaInternaParamsSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new PoliticaInternaController(app.prisma)
    return controller.delete(request, reply)
  })
}
