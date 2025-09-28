import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { DashboardController } from '../controllers/dashboard.controller.js'
import {
  DashboardQuerySchema,
  UsuarioParamsSchema,
  MetricasGeraisResponseSchema,
  DashboardUsuarioResponseSchema,
  DashboardQualidadeResponseSchema
} from '../schemas/dashboard.js'

export async function dashboardZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /dashboard/metricas - Métricas gerais do dashboard
  app.get('/metricas', {
    schema: {
      description: 'Obter métricas gerais do sistema para dashboard',
      tags: ['Dashboard'],
      summary: 'Métricas gerais',
      querystring: DashboardQuerySchema,
      response: {
        200: MetricasGeraisResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new DashboardController(app.prisma)
    return controller.obterMetricasGerais(request, reply)
  })

  // GET /dashboard/usuario/:usuarioId - Dashboard específico do usuário
  app.get('/usuario/:usuarioId', {
    schema: {
      description: 'Obter dashboard específico de um usuário',
      tags: ['Dashboard'],
      summary: 'Dashboard do usuário',
      params: UsuarioParamsSchema,
      querystring: DashboardQuerySchema,
      response: {
        200: DashboardUsuarioResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new DashboardController(app.prisma)
    return controller.obterDashboardUsuario(request, reply)
  })

  // GET /dashboard/qualidade - Dashboard de qualidade de dados
  app.get('/qualidade', {
    schema: {
      description: 'Obter dashboard de qualidade de dados',
      tags: ['Dashboard'],
      summary: 'Dashboard de qualidade',
      querystring: DashboardQuerySchema,
      response: {
        200: DashboardQualidadeResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new DashboardController(app.prisma)
    // TODO: Implementar dashboardQualidade - rota temporariamente desabilitada
    reply.send({
      message: 'Dashboard de qualidade não implementado ainda',
      data: {
        periodo: 'mes',
        dataInicio: new Date().toISOString(),
        resumo: {
          totalDimensoes: 0,
          totalRegras: 0,
          regrasAtivas: 0,
          regrasInativas: 0,
          percentualAtivo: 0
        }
      }
    })
  })
}
