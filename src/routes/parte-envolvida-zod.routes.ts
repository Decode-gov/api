import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ParteEnvolvidaController } from '../controllers/parte-envolvida.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  ParteEnvolvidaParamsSchema,
  CreateParteEnvolvidaSchema,
  UpdateParteEnvolvidaSchema,
  ParteEnvolvidaResponseSchema,
  PartesEnvolvidasListResponseSchema
} from '../schemas/parte-envolvida'

export async function parteEnvolvidaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ParteEnvolvidaController(app.prisma)

  // GET /partes-envolvidas - Listar partes envolvidas
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as partes envolvidas cadastradas no sistema',
      tags: ['Partes Envolvidas'],
      summary: 'Listar partes envolvidas',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          tipo: { type: 'string', enum: ['PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'ENTIDADE', 'SISTEMA', 'DEPARTAMENTO'] },
          categoria: { type: 'string', enum: ['CLIENTE', 'FORNECEDOR', 'PARCEIRO', 'REGULADOR', 'INTERNO', 'EXTERNO'] },
          criticidade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] },
          search: { type: 'string' }
        }
      },
      response: {
        200: PartesEnvolvidasListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request as any, reply)
  })

  // GET /partes-envolvidas/:id - Buscar parte envolvida por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar parte envolvida específica por ID',
      tags: ['Partes Envolvidas'],
      summary: 'Buscar parte envolvida por ID',
      params: ParteEnvolvidaParamsSchema,
      response: {
        200: ParteEnvolvidaResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request as any, reply)
  })

  // POST /partes-envolvidas - Criar parte envolvida
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova parte envolvida no sistema',
      tags: ['Partes Envolvidas'],
      summary: 'Criar parte envolvida',
      body: CreateParteEnvolvidaSchema,
      response: {
        201: ParteEnvolvidaResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request as any, reply)
  })

  // PUT /partes-envolvidas/:id - Atualizar parte envolvida
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar parte envolvida existente',
      tags: ['Partes Envolvidas'],
      summary: 'Atualizar parte envolvida',
      params: ParteEnvolvidaParamsSchema,
      body: UpdateParteEnvolvidaSchema,
      response: {
        200: ParteEnvolvidaResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request as any, reply)
  })

  // DELETE /partes-envolvidas/:id - Deletar parte envolvida
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover parte envolvida do sistema',
      tags: ['Partes Envolvidas'],
      summary: 'Deletar parte envolvida',
      params: ParteEnvolvidaParamsSchema,
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
    return controller.delete(request as any, reply)
  })
}