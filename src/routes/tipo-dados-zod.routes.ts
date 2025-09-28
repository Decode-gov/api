import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { TipoDadosController } from '../controllers/tipo-dados.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  TipoDadosParamsSchema,
  CreateTipoDadosSchema,
  UpdateTipoDadosSchema,
  TipoDadosResponseSchema,
  TiposDadosListResponseSchema
} from '../schemas/tipo-dados'

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
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          categoria: { type: 'string', enum: ['PRIMITIVO', 'COMPLEXO', 'ESTRUTURADO', 'SEMI_ESTRUTURADO', 'NAO_ESTRUTURADO'] },
          permiteNulo: { type: 'boolean' },
          nome: { type: 'string' }
        }
      },
      response: {
        200: TiposDadosListResponseSchema
      }
    }
  }, (request, reply) => controller.findMany(request, reply))

  // GET /tipos-dados/:id - Buscar tipo de dados por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar tipo de dados específico por ID',
      tags: ['Tipos de Dados'],
      summary: 'Buscar tipo de dados por ID',
      params: TipoDadosParamsSchema,
      response: {
        200: TipoDadosResponseSchema
      }
    }
  }, (request, reply) => controller.findById(request, reply))

  // POST /tipos-dados - Criar tipo de dados
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo tipo de dados no sistema',
      tags: ['Tipos de Dados'],
      summary: 'Criar tipo de dados',
      body: CreateTipoDadosSchema,
      response: {
        201: TipoDadosResponseSchema
      }
    }
  }, (request, reply) => controller.create(request, reply))

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
        200: TipoDadosResponseSchema
      }
    }
  }, (request, reply) => controller.update(request, reply))

  // DELETE /tipos-dados/:id - Deletar tipo de dados
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover tipo de dados do sistema',
      tags: ['Tipos de Dados'],
      summary: 'Deletar tipo de dados',
      params: TipoDadosParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, (request, reply) => controller.delete(request, reply))
}