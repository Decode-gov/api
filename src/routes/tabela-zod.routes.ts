import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { TabelaController } from '../controllers/tabela.controller.js'
import {
  CreateTabelaSchema,
  UpdateTabelaSchema,
  TabelaResponseSchema,
  TabelasListResponseSchema,
  TabelaParamsSchema
} from '../schemas/tabela.js'
import { PaginationSchema, ErrorSchema } from '../schemas/common.js'
import { authMiddleware } from '../middleware/auth.js'

export async function tabelaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /api/tabelas - Listar todas as tabelas
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todas as tabelas cadastradas no sistema',
      tags: ['Tabelas'],
      summary: 'Listar tabelas',
      querystring: PaginationSchema,
      response: {
        200: TabelasListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new TabelaController(app.prisma)
    return controller.findMany(request, reply)
  })

  // GET /api/tabelas/:id - Buscar tabela por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar tabela específica por ID',
      tags: ['Tabelas'],
      summary: 'Buscar tabela por ID',
      params: TabelaParamsSchema,
      response: {
        200: TabelaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new TabelaController(app.prisma)
    return controller.findById(request, reply)
  })

  // POST /api/tabelas - Criar nova tabela
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar nova tabela no catálogo de dados',
      tags: ['Tabelas'],
      summary: 'Criar tabela',
      body: CreateTabelaSchema,
      response: {
        201: TabelaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new TabelaController(app.prisma)
    return controller.create(request, reply)
  })

  // PUT /api/tabelas/:id - Atualizar tabela
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de uma tabela específica',
      tags: ['Tabelas'],
      summary: 'Atualizar tabela',
      params: TabelaParamsSchema,
      body: UpdateTabelaSchema,
      response: {
        200: TabelaResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new TabelaController(app.prisma)
    return controller.update(request, reply)
  })

  // DELETE /api/tabelas/:id - Deletar tabela
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Excluir tabela do catálogo de dados',
      tags: ['Tabelas'],
      summary: 'Excluir tabela',
      params: TabelaParamsSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new TabelaController(app.prisma)
    return controller.delete(request, reply)
  })
}
