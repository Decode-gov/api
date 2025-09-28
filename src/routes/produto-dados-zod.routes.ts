import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ProdutoDadosController } from '../controllers/produto-dados.controller.js'

export async function produtoDadosRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ProdutoDadosController(app.prisma)

  // Schemas Zod para validação interna
  const CreateProdutoDadosZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória')
  })

  const UpdateProdutoDadosZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().min(1).optional()
  })

  // GET /produtos-dados - Listar produtos
  app.get('/', {
    schema: {
      description: 'Listar todos os produtos de dados do sistema',
      tags: ['Produtos de Dados'],
      summary: 'Listar produtos de dados',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Lista de produtos de dados',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string' },
                  descricao: { type: 'string' },
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

  // GET /produtos-dados/:id - Buscar produto por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar produto de dados por ID',
      tags: ['Produtos de Dados'],
      summary: 'Buscar produto por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Produto de dados encontrado',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Produto de dados não encontrado',
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

  // POST /produtos-dados - Criar novo produto
  app.post('/', {
    schema: {
      description: 'Criar um novo produto de dados no sistema',
      tags: ['Produtos de Dados'],
      summary: 'Criar produto de dados',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          descricao: { type: 'string', minLength: 1 }
        },
        required: ['nome', 'descricao']
      },
      response: {
        201: {
          description: 'Produto de dados criado com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
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
    const validation = CreateProdutoDadosZod.safeParse(request.body)
    if (!validation.success) {
      return reply.badRequest('Dados de entrada inválidos')
    }
    return controller.create(request as any, reply)
  })

  // PUT /produtos-dados/:id - Atualizar produto
  app.put('/:id', {
    schema: {
      description: 'Atualizar um produto de dados existente',
      tags: ['Produtos de Dados'],
      summary: 'Atualizar produto de dados',
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
          descricao: { type: 'string', minLength: 1 }
        }
      },
      response: {
        200: {
          description: 'Produto de dados atualizado com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Produto de dados não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validation = UpdateProdutoDadosZod.safeParse(request.body)
    if (!validation.success) {
      return reply.badRequest('Dados de entrada inválidos')
    }
    return controller.update(request as any, reply)
  })

  // DELETE /produtos-dados/:id - Deletar produto
  app.delete('/:id', {
    schema: {
      description: 'Deletar um produto de dados',
      tags: ['Produtos de Dados'],
      summary: 'Deletar produto de dados',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Produto de dados deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Produto de dados não encontrado',
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
