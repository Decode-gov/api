import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { LogAuditoriaController } from '../controllers/log-auditoria.controller.js'
import {
  AuditoriaQuerySchema,
  CreateLogAuditoriaSchema,
  RelatorioEntidadeParamsSchema,
  AtividadesUsuarioParamsSchema,
  AtividadesUsuarioQuerySchema,
  LogsAuditoriaListResponseSchema,
  LogAuditoriaResponseSchema,
  RelatorioEntidadeResponseSchema,
  AtividadesUsuarioResponseSchema,
  AuditoriaParamsSchema
} from '../schemas/auditoria.js'
import { ErrorSchema } from '../schemas/common.js'

export async function auditoriaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /auditoria - Listar logs de auditoria
  app.get('/', {
    schema: {
      description: 'Listar logs de auditoria com filtros avançados',
      tags: ['Auditoria'],
      summary: 'Listar logs de auditoria',
      querystring: AuditoriaQuerySchema,
      response: {
        200: LogsAuditoriaListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new LogAuditoriaController(app.prisma)
    return controller.findMany(request as any, reply)
  })

  // GET /auditoria/:id - Buscar log de auditoria por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar log de auditoria por ID',
      tags: ['Auditoria'],
      summary: 'Buscar log de auditoria',
      params: AuditoriaParamsSchema,
      response: {
        200: LogAuditoriaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new LogAuditoriaController(app.prisma)
    return controller.findById(request as any, reply)
  })

  // GET /auditoria/relatorio/:entidade/:entidadeId - Relatório de auditoria por entidade
  app.get('/relatorio/:entidade/:entidadeId', {
    schema: {
      description: 'Gerar relatório de auditoria para uma entidade específica',
      tags: ['Auditoria'],
      summary: 'Relatório de auditoria por entidade',
      params: RelatorioEntidadeParamsSchema,
      response: {
        200: RelatorioEntidadeResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new LogAuditoriaController(app.prisma)
    return controller.relatorioEntidade(request as any, reply)
  })

  // GET /auditoria/usuario/:usuarioId/atividades - Atividades de um usuário
  app.get('/usuario/:usuarioId/atividades', {
    schema: {
      description: 'Listar atividades recentes de um usuário específico',
      tags: ['Auditoria'],
      summary: 'Atividades do usuário',
      params: AtividadesUsuarioParamsSchema,
      querystring: AtividadesUsuarioQuerySchema,
      response: {
        200: AtividadesUsuarioResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new LogAuditoriaController(app.prisma)
    return controller.atividadesUsuario(request as any, reply)
  })

  // POST /auditoria - Criar log de auditoria manualmente (uso interno)
  app.post('/', {
    schema: {
      description: 'Criar log de auditoria manualmente (uso interno do sistema)',
      tags: ['Auditoria'],
      summary: 'Criar log de auditoria',
      body: CreateLogAuditoriaSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: z.object({
            id: z.string()
          })
        }),
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new LogAuditoriaController(app.prisma)
    return controller.create(request as any, reply)
  })
}
