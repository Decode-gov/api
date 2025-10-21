import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ParteEnvolvidaController } from '../controllers/parte-envolvida.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  ParteEnvolvidaParamsSchema,
  CreateParteEnvolvidaSchema,
  UpdateParteEnvolvidaSchema,
  ParteEnvolvidaResponseSchema,
  PartesEnvolvidasListResponseSchema
} from '../schemas/parte-envolvida.js'

export async function parteEnvolvidaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ParteEnvolvidaController(app.prisma)

  // Enums para query params
  const TipoParteEnum = z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'ENTIDADE', 'SISTEMA', 'DEPARTAMENTO'])
  const CategoriaEnum = z.enum(['CLIENTE', 'FORNECEDOR', 'PARCEIRO', 'REGULADOR', 'INTERNO', 'EXTERNO'])
  const CriticidadeEnum = z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'])

  // Schemas adicionais
  const QueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.string().optional(),
    tipo: TipoParteEnum.optional(),
    categoria: CategoriaEnum.optional(),
    criticidade: CriticidadeEnum.optional(),
    search: z.string().optional()
  })

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  const DeleteResponseSchema = z.object({
    message: z.string(),
    data: z.object({
      id: z.uuid(),
      nome: z.string()
    })
  })

  // GET /partes-envolvidas - Listar partes envolvidas
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as partes envolvidas cadastradas no sistema',
      tags: ['Partes Envolvidas'],
      summary: 'Listar partes envolvidas',
      querystring: QueryParamsSchema,
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
        200: ParteEnvolvidaResponseSchema,
        404: ErrorResponseSchema
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
        201: ParteEnvolvidaResponseSchema,
        400: ErrorResponseSchema
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
        200: ParteEnvolvidaResponseSchema,
        404: ErrorResponseSchema
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
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.delete(request as any, reply)
  })
}