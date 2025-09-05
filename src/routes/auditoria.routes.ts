import type { FastifyInstance } from 'fastify'
import { LogAuditoriaController } from '../controllers/log-auditoria.controller.js'

export async function auditoriaRoutes(fastify: FastifyInstance) {
  const controller = new LogAuditoriaController(fastify.prisma)

  // GET /auditoria - Listar logs de auditoria
  fastify.get('/', {
    schema: {
      description: 'Listar logs de auditoria com filtros avançados',
      tags: ['Auditoria'],
      summary: 'Listar logs de auditoria',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0 },
          take: { type: 'number', minimum: 1, maximum: 100 },
          orderBy: { type: 'string', description: 'Campo para ordenação' },
          entidade: { type: 'string', description: 'Filtrar por entidade' },
          entidadeId: { type: 'string', format: 'uuid', description: 'Filtrar por ID da entidade' },
          operacao: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE'], description: 'Filtrar por operação' },
          usuarioId: { type: 'string', format: 'uuid', description: 'Filtrar por usuário' },
          dataInicio: { type: 'string', format: 'date', description: 'Data de início do filtro' },
          dataFim: { type: 'string', format: 'date', description: 'Data de fim do filtro' }
        }
      },
      response: {
        200: {
          description: 'Lista de logs de auditoria',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  entidade: { type: 'string' },
                  entidadeId: { type: 'string' },
                  operacao: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE'] },
                  timestamp: { type: 'string', format: 'date-time' },
                  usuarioId: { type: 'string', format: 'uuid' },
                  usuario: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' },
                      email: { type: 'string', format: 'email' }
                    }
                  }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                skip: { type: 'number' },
                take: { type: 'number' },
                pages: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request as any, reply)
  })

  // GET /auditoria/:id - Buscar log de auditoria por ID
  fastify.get('/:id', {
    schema: {
      description: 'Buscar log de auditoria por ID',
      tags: ['Auditoria'],
      summary: 'Buscar log de auditoria',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Log de auditoria encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                entidade: { type: 'string' },
                entidadeId: { type: 'string' },
                operacao: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                dadosAntes: { type: 'object', description: 'Estado anterior da entidade' },
                dadosDepois: { type: 'object', description: 'Estado posterior da entidade' },
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' },
                    email: { type: 'string', format: 'email' }
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
    return controller.findById(request as any, reply)
  })

  // GET /auditoria/relatorio/:entidade/:entidadeId - Relatório de auditoria por entidade
  fastify.get('/relatorio/:entidade/:entidadeId', {
    schema: {
      description: 'Gerar relatório de auditoria para uma entidade específica',
      tags: ['Auditoria'],
      summary: 'Relatório de auditoria por entidade',
      params: {
        type: 'object',
        properties: {
          entidade: { type: 'string', description: 'Nome da entidade' },
          entidadeId: { type: 'string', format: 'uuid', description: 'ID da entidade' }
        },
        required: ['entidade', 'entidadeId']
      },
      response: {
        200: {
          description: 'Relatório de auditoria gerado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                entidade: { type: 'string' },
                entidadeId: { type: 'string' },
                estatisticas: {
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
                    primeiraOperacao: { type: 'string', format: 'date-time' },
                    ultimaOperacao: { type: 'string', format: 'date-time' },
                    usuariosEnvolvidos: { type: 'number' }
                  }
                },
                logs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      operacao: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                      dadosAntes: { type: 'object' },
                      dadosDepois: { type: 'object' },
                      usuario: {
                        type: 'object',
                        properties: {
                          nome: { type: 'string' },
                          email: { type: 'string' }
                        }
                      }
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
    return controller.relatorioEntidade(request as any, reply)
  })

  // GET /auditoria/usuario/:usuarioId/atividades - Atividades de um usuário
  fastify.get('/usuario/:usuarioId/atividades', {
    schema: {
      description: 'Listar atividades recentes de um usuário específico',
      tags: ['Auditoria'],
      summary: 'Atividades do usuário',
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
          dias: { type: 'number', minimum: 1, maximum: 365, description: 'Número de dias para analisar (padrão: 30)' },
          skip: { type: 'number', minimum: 0 },
          take: { type: 'number', minimum: 1, maximum: 100 }
        }
      },
      response: {
        200: {
          description: 'Atividades do usuário encontradas',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                usuarioId: { type: 'string', format: 'uuid' },
                estatisticas: {
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
                    entidadesAfetadas: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    diasAnalisados: { type: 'number' }
                  }
                },
                logs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      entidade: { type: 'string' },
                      entidadeId: { type: 'string' },
                      operacao: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' }
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
    return controller.atividadesUsuario(request as any, reply)
  })

  // POST /auditoria - Criar log de auditoria manualmente (uso interno)
  fastify.post('/', {
    schema: {
      description: 'Criar log de auditoria manualmente (uso interno do sistema)',
      tags: ['Auditoria'],
      summary: 'Criar log de auditoria',
      body: {
        type: 'object',
        properties: {
          entidade: { type: 'string', description: 'Nome da entidade' },
          entidadeId: { type: 'string', description: 'ID da entidade' },
          operacao: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE'], description: 'Tipo de operação' },
          dadosAntes: { type: 'string', description: 'Estado anterior (JSON string)' },
          dadosDepois: { type: 'string', description: 'Estado posterior (JSON string)' },
          usuarioId: { type: 'string', format: 'uuid', description: 'ID do usuário responsável' }
        },
        required: ['entidade', 'entidadeId', 'operacao', 'usuarioId']
      },
      response: {
        201: {
          description: 'Log de auditoria criado com sucesso'
        }
      }
    }
  }, async (request, reply) => {
    return controller.create(request as any, reply)
  })
}
