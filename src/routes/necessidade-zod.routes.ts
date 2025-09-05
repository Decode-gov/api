import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NecessidadeInformacaoController } from '../controllers/necessidade-informacao.controller.js'

export async function necessidadeZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new NecessidadeInformacaoController(app.prisma)

  // Schemas Zod para validação interna
  const CreateNecessidadeZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    ativo: z.boolean().default(true)
  })

  const UpdateNecessidadeZod = z.object({
    nome: z.string().min(1).optional(),
    ativo: z.boolean().optional()
  })

  // GET /necessidades-informacao - Listar necessidades
  app.get('/', {
    schema: {
      description: 'Listar todas as necessidades de informação do sistema',
      tags: ['Necessidades de Informação'],
      summary: 'Listar necessidades de informação',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          ativo: { type: 'boolean', description: 'Filtrar por status ativo' }
        }
      },
      response: {
        200: {
          description: 'Lista de necessidades de informação',
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
                  ativo: { type: 'boolean' },
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
    return controller.findMany(request, reply)
  })

  // GET /necessidades-informacao/:id - Buscar necessidade por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar necessidade de informação específica por ID',
      tags: ['Necessidades de Informação'],
      summary: 'Buscar necessidade por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Necessidade de informação encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                ativo: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Necessidade de informação não encontrada',
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

  // POST /necessidades-informacao - Criar necessidade
  app.post('/', {
    schema: {
      description: 'Criar nova necessidade de informação no sistema',
      tags: ['Necessidades de Informação'],
      summary: 'Criar necessidade de informação',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da necessidade de informação' },
          ativo: { type: 'boolean', default: true, description: 'Se a necessidade está ativa' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Necessidade de informação criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                ativo: { type: 'boolean' },
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
    const validatedData = CreateNecessidadeZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /necessidades-informacao/:id - Atualizar necessidade
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma necessidade de informação específica',
      tags: ['Necessidades de Informação'],
      summary: 'Atualizar necessidade de informação',
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
          ativo: { type: 'boolean' }
        }
      },
      response: {
        200: {
          description: 'Necessidade de informação atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                ativo: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Necessidade de informação não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateNecessidadeZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /necessidades-informacao/:id - Deletar necessidade
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma necessidade de informação do sistema',
      tags: ['Necessidades de Informação'],
      summary: 'Deletar necessidade de informação',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Necessidade de informação deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Necessidade de informação não encontrada',
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
