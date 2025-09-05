import type { FastifyInstance } from 'fastify'
import { DashboardController } from '../controllers/dashboard.controller.js'

export async function dashboardRoutes(fastify: FastifyInstance) {
  const controller = new DashboardController(fastify.prisma)

  // GET /dashboard/metricas - Métricas gerais do dashboard
  fastify.get('/metricas', {
    schema: {
      description: 'Obter métricas gerais do sistema para dashboard',
      tags: ['Dashboard'],
      summary: 'Métricas gerais',
      querystring: {
        type: 'object',
        properties: {
          periodo: {
            type: 'string',
            enum: ['semana', 'mes', 'trimestre', 'ano'],
            description: 'Período para cálculo das métricas'
          }
        }
      },
      response: {
        200: {
          description: 'Métricas do dashboard obtidas com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                periodo: { type: 'string' },
                dataInicio: { type: 'string', format: 'date-time' },
                metricas: {
                  type: 'object',
                  properties: {
                    totalUsuarios: { type: 'number' },
                    totalSistemas: { type: 'number' },
                    totalProcessos: { type: 'number' },
                    totalTabelas: { type: 'number' },
                    totalColunas: { type: 'number' },
                    totalTermos: { type: 'number' },
                    totalPoliticas: { type: 'number' },
                    totalComunidades: { type: 'number' }
                  }
                },
                crescimento: {
                  type: 'object',
                  properties: {
                    usuarios: { type: 'number' },
                    sistemas: { type: 'number' },
                    processos: { type: 'number' },
                    tabelas: { type: 'number' },
                    colunas: { type: 'number' }
                  }
                },
                atividadesRecentes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      data: { type: 'string', format: 'date-time' },
                      tipo: { type: 'string' },
                      descricao: { type: 'string' },
                      usuario: { type: 'string' },
                      entidade: { type: 'string' },
                      entidadeId: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.obterMetricasGerais(request as any, reply)
  })

  // GET /dashboard/usuario/:usuarioId - Dashboard específico do usuário
  fastify.get('/usuario/:usuarioId', {
    schema: {
      description: 'Obter dashboard específico de um usuário',
      tags: ['Dashboard'],
      summary: 'Dashboard do usuário',
      params: {
        type: 'object',
        properties: {
          usuarioId: { type: 'string', format: 'uuid', description: 'ID do usuário' }
        },
        required: ['usuarioId']
      },
      querystring: {
        type: 'object',
        properties: {
          periodo: {
            type: 'string',
            enum: ['semana', 'mes', 'trimestre', 'ano'],
            description: 'Período para cálculo das métricas'
          }
        }
      },
      response: {
        200: {
          description: 'Dashboard do usuário obtido com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    createdAt: { type: 'string', format: 'date-time' }
                  }
                },
                periodo: { type: 'string' },
                dataInicio: { type: 'string', format: 'date-time' },
                estatisticasAtividade: {
                  type: 'object',
                  properties: {
                    totalOperacoes: { type: 'number' },
                    operacoesPorTipo: {
                      type: 'object',
                      properties: {
                        CREATE: { type: 'number' },
                        UPDATE: { type: 'number' },
                        DELETE: { type: 'number' }
                      }
                    },
                    entidadesAfetadas: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.obterDashboardUsuario(request as any, reply)
  })

  // GET /dashboard/qualidade - Dashboard de qualidade de dados
  fastify.get('/qualidade', {
    schema: {
      description: 'Obter dashboard de qualidade de dados',
      tags: ['Dashboard'],
      summary: 'Dashboard de qualidade',
      querystring: {
        type: 'object',
        properties: {
          periodo: {
            type: 'string',
            enum: ['semana', 'mes', 'trimestre', 'ano'],
            description: 'Período para cálculo das métricas'
          }
        }
      },
      response: {
        200: {
          description: 'Dashboard de qualidade obtido com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                periodo: { type: 'string' },
                dataInicio: { type: 'string', format: 'date-time' },
                resumo: {
                  type: 'object',
                  properties: {
                    totalDimensoes: { type: 'number' },
                    totalRegras: { type: 'number' },
                    regrasAtivas: { type: 'number' },
                    regrasInativas: { type: 'number' },
                    percentualAtivo: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    // TODO: Implementar dashboardQualidade - rota temporariamente desabilitada
    reply.send({
      message: 'Dashboard de qualidade não implementado ainda',
      data: { qualidade: 'Em desenvolvimento' }
    })
  })
}
