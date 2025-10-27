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
  const controller = new PoliticaInternaController(app.prisma)

  const DeleteResponseSchema = z.object({
    message: z.string(),
    data: z.object({
      id: z.uuid(),
      nome: z.string()
    })
  })

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
  }, controller.findMany.bind(controller))

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
  }, controller.findById.bind(controller))

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
  }, controller.create.bind(controller))

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
  }, controller.update.bind(controller))

  // DELETE /api/politicas-internas/:id - Deletar política interna
  app.delete('/:id', {
    schema: {
      description: 'Excluir política interna',
      tags: ['Políticas Internas'],
      summary: 'Excluir política interna',
      params: PoliticaInternaParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorSchema
      }
    }
  }, controller.delete.bind(controller))
}
