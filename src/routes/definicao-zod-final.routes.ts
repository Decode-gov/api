import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DefinicaoController } from '../controllers/definicao.controller.js'

export async function definicaoZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new DefinicaoController(app.prisma)

  // Schemas Zod para validação interna
  const CreateDefinicaoZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    sigla: z.string().optional(),
    ativo: z.boolean().default(true)
  })

  const UpdateDefinicaoZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional(),
    sigla: z.string().optional(),
    ativo: z.boolean().optional()
  })

  // GET /definicoes - Listar termos
  app.get('/', {
    schema: {
      description: 'Listar todas as termos do sistema',
      tags: ['Termos'],
      summary: 'Listar termos',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          ativo: { type: 'boolean', description: 'Filtrar por status ativo' },
          search: { type: 'string', description: 'Buscar por nome ou descrição' }
        }
      },
      response: {
        200: {
          description: 'Lista de termos',
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
                  sigla: { type: ['string', 'null'] },
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

  // GET /definicoes/:id - Buscar definição por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar definição específica por ID',
      tags: ['Termos'],
      summary: 'Buscar definição por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Definição encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                sigla: { type: ['string', 'null'] },
                ativo: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Definição não encontrada',
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

  // POST /definicoes - Criar definição
  app.post('/', {
    schema: {
      description: 'Criar nova definição no sistema',
      tags: ['Termos'],
      summary: 'Criar definição',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da definição' },
          descricao: { type: 'string', description: 'Descrição detalhada da definição' },
          sigla: { type: 'string', description: 'Sigla associada ao termo, se aplicável' },
          ativo: { type: 'boolean', default: true, description: 'Se a definição está ativa' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Definição criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                sigla: { type: ['string', 'null'] },
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
    const validatedData = CreateDefinicaoZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /definicoes/:id - Atualizar definição
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma definição específica',
      tags: ['Termos'],
      summary: 'Atualizar definição',
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
          descricao: { type: 'string' },
          sigla: { type: 'string' },
          ativo: { type: 'boolean' }
        }
      },
      response: {
        200: {
          description: 'Definição atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                sigla: { type: ['string', 'null'] },
                ativo: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Definição não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateDefinicaoZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /definicoes/:id - Deletar definição
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma definição do sistema',
      tags: ['Termos'],
      summary: 'Deletar definição',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Definição deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Definição não encontrada',
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

