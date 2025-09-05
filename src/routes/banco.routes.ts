import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BancoController } from '../controllers/banco.controller.js'

export async function bancoRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new BancoController(app.prisma)

  // Schemas Zod para validação
  const CreateBancoZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional()
  })

  const UpdateBancoZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional()
  })

  // GET /bancos - Listar todos os bancos
  app.get('/', {
    schema: {
      description: 'Listar bancos de dados com paginação e filtros',
      tags: ['Bancos de Dados'],
      summary: 'Listar bancos de dados',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0, description: 'Número de registros para pular' },
          take: { type: 'number', minimum: 1, maximum: 100, description: 'Número de registros por página' },
          orderBy: { type: 'string', description: 'Campo para ordenação' }
        }
      },
      response: {
        200: {
          description: 'Lista de bancos de dados',
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
                  tabelas: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        nome: { type: 'string' }
                      }
                    }
                  },
                  _count: {
                    type: 'object',
                    properties: {
                      tabelas: { type: 'number' }
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

  // GET /bancos/:id - Buscar banco por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar banco de dados por ID',
      tags: ['Bancos de Dados'],
      summary: 'Buscar banco de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID do banco de dados' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Banco de dados encontrado',
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
                tabelas: {
                  type: 'array',
                  items: {
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
        },
        404: {
          description: 'Banco de dados não encontrado',
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

  // POST /bancos - Criar novo banco
  app.post('/', {
    schema: {
      description: 'Criar novo banco de dados',
      tags: ['Bancos de Dados'],
      summary: 'Criar banco de dados',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome do banco de dados' },
          descricao: { type: 'string', description: 'Descrição do banco de dados' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Banco de dados criado com sucesso',
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
    const validatedData = CreateBancoZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /bancos/:id - Atualizar banco
  app.put('/:id', {
    schema: {
      description: 'Atualizar banco de dados existente',
      tags: ['Bancos de Dados'],
      summary: 'Atualizar banco de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID do banco de dados' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome do banco de dados' },
          descricao: { type: 'string', description: 'Descrição do banco de dados' }
        }
      },
      response: {
        200: {
          description: 'Banco de dados atualizado com sucesso',
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
          description: 'Banco de dados não encontrado',
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
    const validatedData = UpdateBancoZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /bancos/:id - Deletar banco
  app.delete('/:id', {
    schema: {
      description: 'Deletar banco de dados (apenas se não estiver em uso)',
      tags: ['Bancos de Dados'],
      summary: 'Deletar banco de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID do banco de dados' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Banco de dados deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Banco de dados não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Banco de dados em uso - não pode ser deletado',
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
