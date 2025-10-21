import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ClassificacaoInformacaoController } from '../controllers/classificacao-informacao.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  ClassificacaoInformacaoParamsSchema,
  CreateClassificacaoInformacaoSchema,
  UpdateClassificacaoInformacaoSchema,
  AtribuirTermoSchema,
  ClassificacaoInformacaoResponseSchema,
  ClassificacoesListResponseSchema
} from '../schemas/classificacao-informacao.js'

export async function classificacaoInformacaoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ClassificacaoInformacaoController(app.prisma)

  // Schemas adicionais
  const QueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.string().optional(),
    politicaId: z.uuid().optional()
  })

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  const DeleteResponseSchema = z.object({
    message: z.string()
  })

  // GET /classificacoes-informacao - Listar classificações
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as classificações de informação cadastradas',
      tags: ['Classificações de Informação'],
      summary: 'Listar classificações de informação',
      querystring: QueryParamsSchema,
      response: {
        200: ClassificacoesListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request as any, reply)
  })

  // GET /classificacoes-informacao/:id - Buscar classificação por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar classificação de informação específica por ID',
      tags: ['Classificações de Informação'],
      summary: 'Buscar classificação de informação',
      params: ClassificacaoInformacaoParamsSchema,
      response: {
        200: ClassificacaoInformacaoResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request as any, reply)
  })

  // POST /classificacoes-informacao - Criar classificação
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova classificação de informação no sistema',
      tags: ['Classificações de Informação'],
      summary: 'Criar classificação de informação',
      body: CreateClassificacaoInformacaoSchema,
      response: {
        201: ClassificacaoInformacaoResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request as any, reply)
  })

  // PUT /classificacoes-informacao/:id - Atualizar classificação
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar classificação de informação existente',
      tags: ['Classificações de Informação'],
      summary: 'Atualizar classificação de informação',
      params: ClassificacaoInformacaoParamsSchema,
      body: UpdateClassificacaoInformacaoSchema,
      response: {
        200: ClassificacaoInformacaoResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request as any, reply)
  })

  // PUT /classificacoes-informacao/:id/termo - Atribuir termo
  app.put('/:id/termo', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atribuir termo a uma classificação de informação',
      tags: ['Classificações de Informação'],
      summary: 'Atribuir termo à classificação',
      params: ClassificacaoInformacaoParamsSchema,
      body: AtribuirTermoSchema,
      response: {
        200: ClassificacaoInformacaoResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.atribuirTermo(request as any, reply)
  })

  // DELETE /classificacoes-informacao/:id - Deletar classificação
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover classificação de informação do sistema',
      tags: ['Classificações de Informação'],
      summary: 'Deletar classificação de informação',
      params: ClassificacaoInformacaoParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.delete(request as any, reply)
  })
}