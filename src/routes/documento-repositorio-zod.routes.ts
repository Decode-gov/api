import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DocumentoRepositorioController } from '../controllers/documento-repositorio.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  DocumentoRepositorioParamsSchema,
  DocumentoRepositorioQueryParamsSchema,
  CreateDocumentoRepositorioSchema,
  UpdateDocumentoRepositorioSchema,
  DocumentoRepositorioResponseSchema,
  DocumentosRepositorioListResponseSchema
} from '../schemas/documento-repositorio.js'

export async function documentoRepositorioZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new DocumentoRepositorioController(app.prisma)

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  // GET /documentos-repositorio - Listar documentos
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar documentos que associam termos de negócio a repositórios',
      tags: ['Documentos Repositório'],
      summary: 'Listar documentos',
      querystring: DocumentoRepositorioQueryParamsSchema,
      response: {
        200: DocumentosRepositorioListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request, reply)
  })

  // GET /documentos-repositorio/:id - Buscar documento por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar documento específico por ID com relacionamentos',
      tags: ['Documentos Repositório'],
      summary: 'Buscar documento por ID',
      params: DocumentoRepositorioParamsSchema,
      response: {
        200: DocumentoRepositorioResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request, reply)
  })

  // POST /documentos-repositorio - Criar documento
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo documento associando termo de negócio a repositório',
      tags: ['Documentos Repositório'],
      summary: 'Criar documento',
      body: CreateDocumentoRepositorioSchema,
      response: {
        201: DocumentoRepositorioResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request, reply)
  })

  // PUT /documentos-repositorio/:id - Atualizar documento
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar documento existente',
      tags: ['Documentos Repositório'],
      summary: 'Atualizar documento',
      params: DocumentoRepositorioParamsSchema,
      body: UpdateDocumentoRepositorioSchema,
      response: {
        200: DocumentoRepositorioResponseSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request, reply)
  })

  // DELETE /documentos-repositorio/:id - Deletar documento
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover documento do sistema',
      tags: ['Documentos Repositório'],
      summary: 'Deletar documento',
      params: DocumentoRepositorioParamsSchema,
      response: {
        200: z.object({
          message: z.string()
        }),
        404: ErrorResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.delete(request, reply)
  })
}
