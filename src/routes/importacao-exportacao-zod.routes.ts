import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { ImportacaoExportacaoController } from '../controllers/importacao-exportacao.controller.js'
import {
  ExportacaoQuerySchema,
  ImportacaoSchema,
  ImportacaoExportacaoQuerySchema,
  ExportacaoResponseSchema,
  ImportacaoResponseSchema,
  OperacoesListResponseSchema,
  OperacaoResponseSchema,
  ImportacaoExportacaoParamsSchema
} from '../schemas/importacao-exportacao.js'
import { ErrorSchema } from '../schemas/common.js'

export async function importacaoExportacaoZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /importacao-exportacao - Listar operações
  app.get('/', {
    schema: {
      description: 'Listar operações de importação e exportação',
      tags: ['Importação/Exportação'],
      summary: 'Listar operações',
      querystring: ImportacaoExportacaoQuerySchema,
      response: {
        200: OperacoesListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ImportacaoExportacaoController(app.prisma)
    return controller.findMany(request as any, reply)
  })

  // GET /importacao-exportacao/:id - Buscar operação por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar operação de importação/exportação por ID',
      tags: ['Importação/Exportação'],
      summary: 'Buscar operação',
      params: ImportacaoExportacaoParamsSchema,
      response: {
        200: OperacaoResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ImportacaoExportacaoController(app.prisma)
    return controller.findById(request as any, reply)
  })

  // POST /importacao-exportacao/exportar - Exportar dados
  app.post('/exportar', {
    schema: {
      description: 'Exportar dados do sistema em diferentes formatos',
      tags: ['Importação/Exportação'],
      summary: 'Exportar dados',
      querystring: ExportacaoQuerySchema,
      response: {
        200: ExportacaoResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ImportacaoExportacaoController(app.prisma)
    return controller.exportar(request as any, reply)
  })

  // POST /importacao-exportacao/importar - Importar dados
  app.post('/importar', {
    schema: {
      description: 'Importar dados para o sistema',
      tags: ['Importação/Exportação'],
      summary: 'Importar dados',
      body: ImportacaoSchema,
      response: {
        200: ImportacaoResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new ImportacaoExportacaoController(app.prisma)
    return controller.importar(request as any, reply)
  })
}
