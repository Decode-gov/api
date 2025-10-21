import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { TipoDadosController } from '../controllers/tipo-dados.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  TipoDadosParamsSchema,
  CreateTipoDadosSchema,
  UpdateTipoDadosSchema,
  TipoDadosResponseSchema,
  TiposDadosListResponseSchema
} from '../schemas/tipo-dados.js'

// Schemas Zod para validação
const CategoriaEnum = z.enum(['PRIMITIVO', 'COMPLEXO', 'ESTRUTURADO', 'SEMI_ESTRUTURADO', 'NAO_ESTRUTURADO'])

const QueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  categoria: CategoriaEnum.optional(),
  permiteNulo: z.coerce.boolean().optional(),
  nome: z.string().optional()
})

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function tipoDadosZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new TipoDadosController(app.prisma)

  // GET /tipos-dados - Listar tipos de dados
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os tipos de dados cadastrados no sistema',
      tags: ['Tipos de Dados'],
      summary: 'Listar tipos de dados',
      querystring: QueryParamsSchema,
      response: {
        200: TiposDadosListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /tipos-dados/:id - Buscar tipo de dados por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar tipo de dados específico por ID',
      tags: ['Tipos de Dados'],
      summary: 'Buscar tipo de dados por ID',
      params: TipoDadosParamsSchema,
      response: {
        200: TipoDadosResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /tipos-dados - Criar tipo de dados
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo tipo de dados no sistema',
      tags: ['Tipos de Dados'],
      summary: 'Criar tipo de dados',
      body: CreateTipoDadosSchema,
      response: {
        201: TipoDadosResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /tipos-dados/:id - Atualizar tipo de dados
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar tipo de dados existente',
      tags: ['Tipos de Dados'],
      summary: 'Atualizar tipo de dados',
      params: TipoDadosParamsSchema,
      body: UpdateTipoDadosSchema,
      response: {
        200: TipoDadosResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /tipos-dados/:id - Deletar tipo de dados
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover tipo de dados do sistema',
      tags: ['Tipos de Dados'],
      summary: 'Deletar tipo de dados',
      params: TipoDadosParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}