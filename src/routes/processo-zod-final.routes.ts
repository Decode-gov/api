import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ProcessoController } from '../controllers/processo.controller.js'
import { authMiddleware } from '../middleware/auth.js'
import {
  CreateProcessoSchema,
  UpdateProcessoSchema, ProcessoResponseSchema,
  ProcessosListResponseSchema,
  ProcessoWithRelationsResponseSchema,
  ProcessoParamsSchema,
  ProcessoQuerySchema
} from '../schemas/processo.js'

export async function processoZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ProcessoController(app.prisma)

  // Schema de erro
  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string(),
  })

  // GET /processos - Listar processos
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os processos do sistema com relacionamentos',
      tags: ['Processos'],
      summary: 'Listar processos',
      querystring: ProcessoQuerySchema,
      response: {
        200: ProcessosListResponseSchema,
      },
    },
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request, reply)
  })

  // GET /processos/:id - Buscar processo por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar processo específico por ID com relacionamentos',
      tags: ['Processos'],
      summary: 'Buscar processo por ID',
      params: ProcessoParamsSchema,
      response: {
        200: ProcessoWithRelationsResponseSchema,
        404: ErrorResponseSchema,
      },
    },
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /processos - Criar processo
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo processo no sistema',
      tags: ['Processos'],
      summary: 'Criar processo',
      body: CreateProcessoSchema,
      response: {
        201: ProcessoResponseSchema,
        400: ErrorResponseSchema,
      },
    },
  }, async (request, reply) => {
    reply.status(201)
    return controller.create(request, reply)
  })

  // PUT /processos/:id - Atualizar processo
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um processo específico',
      tags: ['Processos'],
      summary: 'Atualizar processo',
      params: ProcessoParamsSchema,
      body: UpdateProcessoSchema,
      response: {
        200: ProcessoResponseSchema,
        404: ErrorResponseSchema,
      },
    },
  }, async (request, reply) => {
    reply.status(200)
    return controller.update(request, reply)
  })

  // DELETE /processos/:id - Deletar processo
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar um processo do sistema',
      tags: ['Processos'],
      summary: 'Deletar processo',
      params: ProcessoParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: ErrorResponseSchema,
      },
    },
  }, controller.delete.bind(controller))
}

