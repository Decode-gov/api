import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { NecessidadeInformacaoController } from '../controllers/necessidade-informacao.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  NecessidadeInformacaoParamsSchema,
  NecessidadeInformacaoQuerySchema,
  CreateNecessidadeInformacaoSchema,
  UpdateNecessidadeInformacaoSchema,
  NecessidadeInformacaoResponseSchema,
  NecessidadesListResponseSchema,
  NecessidadeInformacaoSchema
} from '../schemas/necessidade-informacao.js'
import { z } from 'zod'

export async function necessidadeInformacaoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new NecessidadeInformacaoController(app.prisma)

  // GET /necessidades-informacao - Listar necessidades
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as necessidades de informação cadastradas',
      tags: ['Necessidades de Informação'],
      summary: 'Listar necessidades de informação',
      querystring: NecessidadeInformacaoQuerySchema,
      response: {
        200: NecessidadesListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /necessidades-informacao/:id - Buscar necessidade por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar necessidade de informação específica por ID',
      tags: ['Necessidades de Informação'],
      summary: 'Buscar necessidade de informação',
      params: NecessidadeInformacaoParamsSchema,
      response: {
        200: NecessidadeInformacaoResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /necessidades-informacao - Criar necessidade
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova necessidade de informação no sistema',
      tags: ['Necessidades de Informação'],
      summary: 'Criar necessidade de informação',
      body: CreateNecessidadeInformacaoSchema,
      response: {
        201: NecessidadeInformacaoResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /necessidades-informacao/:id - Atualizar necessidade
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar necessidade de informação existente',
      tags: ['Necessidades de Informação'],
      summary: 'Atualizar necessidade de informação',
      params: NecessidadeInformacaoParamsSchema,
      body: UpdateNecessidadeInformacaoSchema,
      response: {
        200: NecessidadeInformacaoResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /necessidades-informacao/:id - Deletar necessidade
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover necessidade de informação do sistema',
      tags: ['Necessidades de Informação'],
      summary: 'Deletar necessidade de informação',
      params: NecessidadeInformacaoParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: NecessidadeInformacaoSchema
        })
      }
    }
  }, controller.delete.bind(controller))
}