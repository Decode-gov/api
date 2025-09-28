import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { KpiController } from '../controllers/kpi.controller.js'
import { authMiddleware } from '../middleware/auth.js'

export async function kpiZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new KpiController(app.prisma)

  // Schemas Zod para validação interna
  const CreateKpiZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    comunidadeId: z.string().optional(),
    processoId: z.string().optional()
  })

  const UpdateKpiZod = z.object({
    nome: z.string().min(1).optional(),
    comunidadeId: z.string().optional(),
    processoId: z.string().optional()
  })

  // GET /kpis - Listar KPIs
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os KPIs do sistema com relacionamentos',
      tags: ['KPIs'],
      summary: 'Listar KPIs',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          comunidadeId: { type: 'string', format: 'uuid', description: 'Filtrar por ID da comunidade' },
          processoId: { type: 'string', format: 'uuid', description: 'Filtrar por ID do processo' }
        }
      },
      response: {
        200: {
          description: 'Lista de KPIs',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string' },
                  comunidadeId: { type: ['string', 'null'], format: 'uuid' },
                  processoId: { type: ['string', 'null'], format: 'uuid' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  comunidade: {
                    type: ['object', 'null'],
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' }
                    }
                  },
                  processo: {
                    type: ['object', 'null'],
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' }
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
    return controller.findMany(request, reply)
  })

  // GET /kpis/:id - Buscar KPI por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar KPI específico por ID com relacionamentos',
      tags: ['KPIs'],
      summary: 'Buscar KPI por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'KPI encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                comunidadeId: { type: ['string', 'null'], format: 'uuid' },
                processoId: { type: ['string', 'null'], format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                comunidade: {
                  type: ['object', 'null'],
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' }
                  }
                },
                processo: {
                  type: ['object', 'null'],
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'KPI não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /kpis - Criar KPI
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo KPI no sistema',
      tags: ['KPIs'],
      summary: 'Criar KPI',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome do KPI' },
          comunidadeId: { type: 'string', format: 'uuid', description: 'ID da comunidade associada' },
          processoId: { type: 'string', format: 'uuid', description: 'ID do processo associado' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'KPI criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                comunidadeId: { type: ['string', 'null'], format: 'uuid' },
                processoId: { type: ['string', 'null'], format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          description: 'Erro de validação',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = CreateKpiZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /kpis/:id - Atualizar KPI
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um KPI específico',
      tags: ['KPIs'],
      summary: 'Atualizar KPI',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          comunidadeId: { type: 'string', format: 'uuid' },
          processoId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'KPI atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                comunidadeId: { type: ['string', 'null'], format: 'uuid' },
                processoId: { type: ['string', 'null'], format: 'uuid' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'KPI não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateKpiZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /kpis/:id - Deletar KPI
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar um KPI do sistema',
      tags: ['KPIs'],
      summary: 'Deletar KPI',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'KPI deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'KPI não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.delete.bind(controller))
}

