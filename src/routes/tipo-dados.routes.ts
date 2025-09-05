import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { TipoDadosController } from '../controllers/tipo-dados.controller.js'

export async function tipoDadosRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new TipoDadosController(app.prisma)

  // Schemas Zod para validação
  const CreateTipoDadosZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional()
  })

  const UpdateTipoDadosZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional()
  })

  // GET /tipos-dados - Listar tipos de dados
  app.get('/', {
    schema: {
      description: 'Listar tipos de dados com paginação e filtros',
      tags: ['Tipos de Dados'],
      summary: 'Listar tipos de dados',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0, description: 'Número de registros para pular' },
          take: { type: 'number', minimum: 1, maximum: 100, description: 'Número de registros por página' },
          orderBy: { type: 'string', description: 'Campo para ordenação' },
          nome: { type: 'string', description: 'Filtrar por nome (busca parcial)' }
        }
      },
      response: {
        200: {
          description: 'Lista de tipos de dados',
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
                  descricao: { type: ['string', 'null'] },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  colunas: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' },
                        tabela: {
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
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                skip: { type: 'number' },
                take: { type: 'number' },
                hasMore: { type: 'boolean' }
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

  // GET /tipos-dados/:id - Buscar tipo de dados por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar tipo de dados por ID',
      tags: ['Tipos de Dados'],
      summary: 'Buscar tipo de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID do tipo de dados' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Tipo de dados encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                colunas: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' },
                      tabela: {
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
        },
        404: {
          description: 'Tipo de dados não encontrado',
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
    return controller.findById(request as any, reply)
  })

  // POST /tipos-dados - Criar novo tipo de dados
  app.post('/', {
    schema: {
      description: 'Criar novo tipo de dados',
      tags: ['Tipos de Dados'],
      summary: 'Criar tipo de dados',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome do tipo de dados' },
          descricao: { type: 'string', description: 'Descrição do tipo de dados' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Tipo de dados criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
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
    const validatedData = CreateTipoDadosZod.parse(request.body)
    return controller.create(request as any, reply)
  })

  // PUT /tipos-dados/:id - Atualizar tipo de dados
  app.put('/:id', {
    schema: {
      description: 'Atualizar tipo de dados existente',
      tags: ['Tipos de Dados'],
      summary: 'Atualizar tipo de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID do tipo de dados' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome do tipo de dados' },
          descricao: { type: 'string', description: 'Descrição do tipo de dados' }
        }
      },
      response: {
        200: {
          description: 'Tipo de dados atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Tipo de dados não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
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
    const validatedData = UpdateTipoDadosZod.parse(request.body)
    return controller.update(request as any, reply)
  })

  // DELETE /tipos-dados/:id - Deletar tipo de dados
  app.delete('/:id', {
    schema: {
      description: 'Deletar tipo de dados (apenas se não estiver em uso)',
      tags: ['Tipos de Dados'],
      summary: 'Deletar tipo de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID do tipo de dados' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Tipo de dados deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Tipo de dados não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Tipo de dados em uso - não pode ser deletado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.delete(request as any, reply)
  })
}
