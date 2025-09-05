import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ProcessoController } from '../controllers/processo.controller.js'

export async function processoZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ProcessoController(app.prisma)

  // Schemas Zod para validação interna
  const CreateProcessoZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    ativo: z.boolean().default(true),
    sistemaId: z.string().uuid('SistemaId deve ser um UUID válido'),
    usuarioId: z.string().uuid('UsuarioId deve ser um UUID válido')
  })

  const UpdateProcessoZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional(),
    ativo: z.boolean().optional(),
    sistemaId: z.string().uuid().optional(),
    usuarioId: z.string().uuid().optional()
  })

  // GET /processos - Listar processos
  app.get('/', {
    schema: {
      description: 'Listar todos os processos do sistema com relacionamentos',
      tags: ['Processos'],
      summary: 'Listar processos',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          sistemaId: { type: 'string', format: 'uuid', description: 'Filtrar por ID do sistema' },
          usuarioId: { type: 'string', format: 'uuid', description: 'Filtrar por ID do usuário' },
          ativo: { type: 'boolean', description: 'Filtrar por status ativo' }
        }
      },
      response: {
        200: {
          description: 'Lista de processos',
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
                  ativo: { type: 'boolean' },
                  sistemaId: { type: 'string', format: 'uuid' },
                  usuarioId: { type: 'string', format: 'uuid' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  sistema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' }
                    }
                  },
                  usuario: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
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
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request, reply)
  })

  // GET /processos/:id - Buscar processo por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar processo específico por ID com relacionamentos',
      tags: ['Processos'],
      summary: 'Buscar processo por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Processo encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                ativo: { type: 'boolean' },
                sistemaId: { type: 'string', format: 'uuid' },
                usuarioId: { type: 'string', format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                sistema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' }
                  }
                },
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' },
                    email: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Processo não encontrado',
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

  // POST /processos - Criar processo
  app.post('/', {
    schema: {
      description: 'Criar novo processo no sistema',
      tags: ['Processos'],
      summary: 'Criar processo',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome do processo' },
          descricao: { type: 'string', description: 'Descrição do processo' },
          ativo: { type: 'boolean', default: true, description: 'Se o processo está ativo' },
          sistemaId: { type: 'string', format: 'uuid', description: 'ID do sistema associado' },
          usuarioId: { type: 'string', format: 'uuid', description: 'ID do usuário responsável' }
        },
        required: ['nome', 'sistemaId', 'usuarioId']
      },
      response: {
        201: {
          description: 'Processo criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                ativo: { type: 'boolean' },
                sistemaId: { type: 'string', format: 'uuid' },
                usuarioId: { type: 'string', format: 'uuid' },
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
    const validatedData = CreateProcessoZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /processos/:id - Atualizar processo
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de um processo específico',
      tags: ['Processos'],
      summary: 'Atualizar processo',
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
          ativo: { type: 'boolean' },
          sistemaId: { type: 'string', format: 'uuid' },
          usuarioId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Processo atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                ativo: { type: 'boolean' },
                sistemaId: { type: 'string', format: 'uuid' },
                usuarioId: { type: 'string', format: 'uuid' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Processo não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateProcessoZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /processos/:id - Deletar processo
  app.delete('/:id', {
    schema: {
      description: 'Deletar um processo do sistema',
      tags: ['Processos'],
      summary: 'Deletar processo',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Processo deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Processo não encontrado',
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
