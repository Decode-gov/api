import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { RegraNegocioController } from '../controllers/regra-negocio.controller.js'

export async function regraNegocioZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new RegraNegocioController(app.prisma)

  // Schemas Zod para validação interna
  const CreateRegraNegocioZod = z.object({
    processoId: z.string().uuid('ProcessoId deve ser um UUID válido'),
    descricao: z.string().min(1, 'Descrição é obrigatória')
  })

  const UpdateRegraNegocioZod = z.object({
    processoId: z.string().uuid().optional(),
    descricao: z.string().min(1).optional()
  })

  // GET /regras-negocio - Listar regras de negócio
  app.get('/', {
    schema: {
      description: 'Listar todas as regras de negócio do sistema com relacionamentos',
      tags: ['Regras de Negócio'],
      summary: 'Listar regras de negócio',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          processoId: { type: 'string', format: 'uuid', description: 'Filtrar por ID do processo' }
        }
      },
      response: {
        200: {
          description: 'Lista de regras de negócio',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  processoId: { type: 'string', format: 'uuid' },
                  descricao: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  processo: {
                    type: 'object',
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

  // GET /regras-negocio/:id - Buscar regra de negócio por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar regra de negócio específica por ID com relacionamentos',
      tags: ['Regras de Negócio'],
      summary: 'Buscar regra de negócio por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Regra de negócio encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                processoId: { type: 'string', format: 'uuid' },
                descricao: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                processo: {
                  type: 'object',
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
          description: 'Regra de negócio não encontrada',
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

  // POST /regras-negocio - Criar regra de negócio
  app.post('/', {
    schema: {
      description: 'Criar nova regra de negócio no sistema',
      tags: ['Regras de Negócio'],
      summary: 'Criar regra de negócio',
      body: {
        type: 'object',
        properties: {
          processoId: { type: 'string', format: 'uuid', description: 'ID do processo associado' },
          descricao: { type: 'string', minLength: 1, description: 'Descrição da regra de negócio' }
        },
        required: ['processoId', 'descricao']
      },
      response: {
        201: {
          description: 'Regra de negócio criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                processoId: { type: 'string', format: 'uuid' },
                descricao: { type: 'string' },
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
    const validatedData = CreateRegraNegocioZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /regras-negocio/:id - Atualizar regra de negócio
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma regra de negócio específica',
      tags: ['Regras de Negócio'],
      summary: 'Atualizar regra de negócio',
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
          processoId: { type: 'string', format: 'uuid' },
          descricao: { type: 'string', minLength: 1 }
        }
      },
      response: {
        200: {
          description: 'Regra de negócio atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                processoId: { type: 'string', format: 'uuid' },
                descricao: { type: 'string' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Regra de negócio não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateRegraNegocioZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /regras-negocio/:id - Deletar regra de negócio
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma regra de negócio do sistema',
      tags: ['Regras de Negócio'],
      summary: 'Deletar regra de negócio',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Regra de negócio deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Regra de negócio não encontrada',
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
