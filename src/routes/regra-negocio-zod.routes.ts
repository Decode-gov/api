import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { RegraNegocioController } from '../controllers/regra-negocio.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  RegraNegocioParamsSchema,
  CreateRegraNegocioSchema,
  UpdateRegraNegocioSchema,
  RegraNegocioResponseSchema,
  RegrasNegocioListResponseSchema
} from '../schemas/regra-negocio.js'

// Schemas Zod para validação
const StatusEnum = z.enum(['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA'])
const TipoRegraEnum = z.enum(['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO'])

const QueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  status: StatusEnum.optional(),
  tipoRegra: TipoRegraEnum.optional()
})

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

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
      querystring: QueryParamsSchema,
      response: {
        200: RegrasNegocioListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /regras-negocio/:id - Buscar regra por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar regra de negócio específica por ID',
      tags: ['Regras de Negócio'],
      summary: 'Buscar regra de negócio',
      params: RegraNegocioParamsSchema,
      response: {
        200: RegraNegocioResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /regras-negocio - Criar regra
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova regra de negócio no sistema',
      tags: ['Regras de Negócio'],
      summary: 'Criar regra de negócio',
      body: CreateRegraNegocioSchema,
      response: {
        201: RegraNegocioResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

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
        200: RegraNegocioResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /regras-negocio/:id - Deletar regra
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover regra de negócio do sistema',
      tags: ['Regras de Negócio'],
      summary: 'Deletar regra de negócio',
      params: RegraNegocioParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}

