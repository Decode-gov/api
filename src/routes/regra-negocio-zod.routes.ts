import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RegraNegocioController } from '../controllers/regra-negocio.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  RegraNegocioParamsSchema,
  CreateRegraNegocioSchema,
  UpdateRegraNegocioSchema,
  RegraNegocioResponseSchema,
  RegrasNegocioListResponseSchema
} from '../schemas/regra-negocio'

export async function regraNegocioZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new RegraNegocioController(app.prisma)

  // GET /regras-negocio - Listar regras de negócio
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as regras de negócio do sistema',
      tags: ['Regras de Negócio'],
      summary: 'Listar regras de negócio',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          status: { type: 'string', enum: ['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA'] },
          tipoRegra: { type: 'string', enum: ['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO'] }
        }
      },
      response: {
        200: RegrasNegocioListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request, reply)
  })

  // GET /regras-negocio/:id - Buscar regra por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar regra de negócio específica por ID',
      tags: ['Regras de Negócio'],
      summary: 'Buscar regra de negócio',
      params: RegraNegocioParamsSchema,
      response: {
        200: RegraNegocioResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request, reply)
  })

  // POST /regras-negocio - Criar regra
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova regra de negócio no sistema',
      tags: ['Regras de Negócio'],
      summary: 'Criar regra de negócio',
      body: CreateRegraNegocioSchema,
      response: {
        201: RegraNegocioResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request, reply)
  })

  // PUT /regras-negocio/:id - Atualizar regra
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar regra de negócio existente',
      tags: ['Regras de Negócio'],
      summary: 'Atualizar regra de negócio',
      params: RegraNegocioParamsSchema,
      body: UpdateRegraNegocioSchema,
      response: {
        200: RegraNegocioResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request, reply)
  })

  // DELETE /regras-negocio/:id - Deletar regra
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover regra de negócio do sistema',
      tags: ['Regras de Negócio'],
      summary: 'Deletar regra de negócio',
      params: RegraNegocioParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.delete(request, reply)
  })
}

