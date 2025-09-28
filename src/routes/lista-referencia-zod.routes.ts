import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ListaReferenciaController } from '../controllers/lista-referencia.controller.js'
import {
  CreateListaReferenciaSchema,
  UpdateListaReferenciaSchema,
  ListaReferenciaResponseSchema,
  ListasReferenciaListResponseSchema,
  ListaReferenciaParamsSchema
} from '../schemas/lista-referencia.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'

export async function listaReferenciaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /listas-referencia - Listar todas as listas de referência
  app.get('/', {
    schema: {
      summary: 'Listar todas as listas de referência',
      description: 'Recupera todas as listas de referência cadastradas no sistema',
      tags: ['Listas de Referência'],
      querystring: PaginationSchema,
      response: {
        200: ListasReferenciaListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ListaReferenciaController(app.prisma)
    return controller.findMany(request as any, reply)
  })

  // GET /listas-referencia/:id - Buscar lista de referência por ID
  app.get('/:id', {
    schema: {
      summary: 'Buscar lista de referência por ID',
      description: 'Recupera uma lista de referência específica pelo ID',
      tags: ['Listas de Referência'],
      params: ListaReferenciaParamsSchema,
      response: {
        200: ListaReferenciaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ListaReferenciaController(app.prisma)
    return controller.findById(request as any, reply)
  })

  // POST /listas-referencia - Criar nova lista de referência
  app.post('/', {
    schema: {
      summary: 'Criar nova lista de referência',
      description: 'Cria uma nova lista de referência com valores únicos validados',
      tags: ['Listas de Referência'],
      body: CreateListaReferenciaSchema,
      response: {
        201: ListaReferenciaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ListaReferenciaController(app.prisma)
    return controller.create(request as any, reply)
  })

  // PUT /listas-referencia/:id - Atualizar lista de referência
  app.put('/:id', {
    schema: {
      summary: 'Atualizar lista de referência',
      description: 'Atualiza uma lista de referência existente',
      tags: ['Listas de Referência'],
      params: ListaReferenciaParamsSchema,
      body: UpdateListaReferenciaSchema,
      response: {
        200: ListaReferenciaResponseSchema,
        404: ErrorSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ListaReferenciaController(app.prisma)
    return controller.update(request as any, reply)
  })

  // DELETE /listas-referencia/:id - Excluir lista de referência
  app.delete('/:id', {
    schema: {
      summary: 'Excluir lista de referência',
      description: 'Remove uma lista de referência do sistema',
      tags: ['Listas de Referência'],
      params: ListaReferenciaParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: z.object({ id: z.string() })
        }),
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ListaReferenciaController(app.prisma)
    return controller.delete(request as any, reply)
  })
}
