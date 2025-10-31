import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AtribuicaoPapelDominioController } from '../controllers/atribuicao-papel-dominio.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CreateAtribuicaoPapelDominioSchema,
  UpdateAtribuicaoPapelDominioSchema,
  AtribuicaoQueryParamsSchema,
  AtribuicaoParamsSchema,
  AtribuicaoResponseSchema,
  AtribuicoesListResponseSchema,
  AtribuicaoDeleteResponseSchema
} from '../schemas/atribuicao-papel-dominio.js'

export async function atribuicaoPapelDominioRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new AtribuicaoPapelDominioController(app.prisma)

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  // GET /atribuicoes - Listar atribuições
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as atribuições de papel a domínio com relacionamentos (papel e domínio)',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Listar atribuições',
      querystring: AtribuicaoQueryParamsSchema,
      response: {
        200: AtribuicoesListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /atribuicoes/:id - Buscar atribuição por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar atribuição por ID com relacionamentos (papel e domínio)',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Buscar atribuição por ID',
      params: AtribuicaoParamsSchema,
      response: {
        200: AtribuicaoResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /atribuicoes - Criar nova atribuição
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar uma nova atribuição de papel a domínio',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Criar atribuição',
      body: CreateAtribuicaoPapelDominioSchema,
      response: {
        201: AtribuicaoResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /atribuicoes/:id - Atualizar atribuição
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar uma atribuição existente',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Atualizar atribuição',
      params: AtribuicaoParamsSchema,
      body: UpdateAtribuicaoPapelDominioSchema,
      response: {
        200: AtribuicaoResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /atribuicoes/:id - Deletar atribuição
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar uma atribuição',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Deletar atribuição',
      params: AtribuicaoParamsSchema,
      response: {
        200: AtribuicaoDeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
