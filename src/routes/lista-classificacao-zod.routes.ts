import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ListaClassificacaoController } from '../controllers/lista-classificacao.controller.js'

export async function listaClassificacaoRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ListaClassificacaoController(app.prisma)

  // Enums para validação
  const CategoriaSegurancaEnum = z.enum(['Publico', 'Interno', 'Confidencial', 'Restrito'])

  // Schemas Zod para validação interna
  const CreateListaClassificacaoZod = z.object({
    categoria: CategoriaSegurancaEnum,
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    politicaId: z.string().uuid('ID da política deve ser um UUID válido')
  })

  const UpdateListaClassificacaoZod = z.object({
    categoria: CategoriaSegurancaEnum.optional(),
    descricao: z.string().min(1).optional(),
    politicaId: z.string().optional()
  })

  // GET /listas-classificacao - Listar listas de classificação
  app.get('/', {
    schema: {
      description: 'Listar todas as listas de classificação de segurança do sistema',
      tags: ['Listas de Classificação'],
      summary: 'Listar listas de classificação',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          categoria: {
            type: 'string',
            enum: ['Publico', 'Interno', 'Confidencial', 'Restrito'],
            description: 'Filtrar por categoria de segurança'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de classificações de segurança',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  categoria: {
                    type: 'string',
                    enum: ['Publico', 'Interno', 'Confidencial', 'Restrito']
                  },
                  descricao: { type: 'string' },
                  politicaId: { type: 'string', format: 'uuid' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
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

  // GET /listas-classificacao/:id - Buscar lista por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar lista de classificação por ID',
      tags: ['Listas de Classificação'],
      summary: 'Buscar lista por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Lista de classificação encontrada',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                categoria: {
                  type: 'string',
                  enum: ['Publico', 'Interno', 'Confidencial', 'Restrito']
                },
                descricao: { type: 'string' },
                politicaId: { type: 'string', format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Lista de classificação não encontrada',
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

  // POST /listas-classificacao - Criar nova lista
  app.post('/', {
    schema: {
      description: 'Criar uma nova lista de classificação de segurança',
      tags: ['Listas de Classificação'],
      summary: 'Criar lista de classificação',
      body: {
        type: 'object',
        properties: {
          categoria: {
            type: 'string',
            enum: ['Publico', 'Interno', 'Confidencial', 'Restrito']
          },
          descricao: { type: 'string', minLength: 1 },
          politicaId: { type: 'string', format: 'uuid' }
        },
        required: ['categoria', 'descricao', 'politicaId']
      },
      response: {
        201: {
          description: 'Lista de classificação criada com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                categoria: {
                  type: 'string',
                  enum: ['Publico', 'Interno', 'Confidencial', 'Restrito']
                },
                descricao: { type: 'string' },
                politicaId: { type: 'string', format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validation = CreateListaClassificacaoZod.safeParse(request.body)
    if (!validation.success) {
      return reply.badRequest('Dados de entrada inválidos')
    }
    return controller.create(request as any, reply)
  })

  // PUT /listas-classificacao/:id - Atualizar lista
  app.put('/:id', {
    schema: {
      description: 'Atualizar uma lista de classificação existente',
      tags: ['Listas de Classificação'],
      summary: 'Atualizar lista de classificação',
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
          categoria: {
            type: 'string',
            enum: ['Publico', 'Interno', 'Confidencial', 'Restrito']
          },
          descricao: { type: 'string', minLength: 1 },
          politicaId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Lista de classificação atualizada com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                categoria: {
                  type: 'string',
                  enum: ['Publico', 'Interno', 'Confidencial', 'Restrito']
                },
                descricao: { type: 'string' },
                politicaId: { type: 'string', format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Lista de classificação não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validation = UpdateListaClassificacaoZod.safeParse(request.body)
    if (!validation.success) {
      return reply.badRequest('Dados de entrada inválidos')
    }
    return controller.update(request as any, reply)
  })

  // DELETE /listas-classificacao/:id - Deletar lista
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma lista de classificação',
      tags: ['Listas de Classificação'],
      summary: 'Deletar lista de classificação',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Lista de classificação deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Lista de classificação não encontrada',
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
