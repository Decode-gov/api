import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ArquivoController } from '../controllers/arquivo.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import { EmpresaFilterSchema } from '../schemas/common.js'
import {
  ArquivoParamsSchema,
  ArquivoResponseSchema,
  ArquivosListResponseSchema,
  UploadQuerySchema,
} from '../schemas/arquivo.js'

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
})

const DeleteResponseSchema = z.object({
  message: z.string(),
})

export async function arquivoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ArquivoController(app.prisma)

  // GET /arquivos — listar arquivos da empresa
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os arquivos enviados pela empresa',
      tags: ['Arquivos'],
      summary: 'Listar arquivos',
      querystring: EmpresaFilterSchema,
      response: {
        200: ArquivosListResponseSchema,
      },
    },
  }, controller.findMany.bind(controller))

  // POST /arquivos/upload — upload de arquivo (multipart/form-data)
  app.post('/upload', {
    preHandler: authMiddleware,
    schema: {
      description: 'Enviar arquivo via multipart/form-data. Campo obrigatório: `file`. Imagens são redimensionadas automaticamente (máx. 1920px largura) via sharp antes de salvar em disco.',
      tags: ['Arquivos'],
      summary: 'Upload de arquivo',
      consumes: ['multipart/form-data'],
      querystring: UploadQuerySchema,
      response: {
        201: ArquivoResponseSchema,
        400: ErrorResponseSchema,
        413: z.object({ error: z.string() }),
      },
    },
  }, controller.create.bind(controller))

  // GET /arquivos/:id/download — download de arquivo
  app.get('/:id/download', {
    preHandler: authMiddleware,
    schema: {
      description: 'Realizar o download de um arquivo salvo em disco',
      tags: ['Arquivos'],
      summary: 'Download de arquivo',
      params: ArquivoParamsSchema,
      response: {
        404: ErrorResponseSchema,
      },
    },
  }, controller.download.bind(controller))

  // DELETE /arquivos/:id — excluir arquivo
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir arquivo do banco de dados e do disco',
      tags: ['Arquivos'],
      summary: 'Excluir arquivo',
      params: ArquivoParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema,
      },
    },
  }, controller.delete.bind(controller))
}
