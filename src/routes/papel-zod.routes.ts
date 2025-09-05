import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { PapelController } from '../controllers/papel.controller.js'

export async function papelZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new PapelController(app.prisma)

  // Schemas Zod para validação interna
  const CreatePapelZod = z.object({
    listaPapelId: z.string().uuid('ListaPapelId deve ser um UUID válido'),
    comunidadeId: z.string().uuid('ComunidadeId deve ser um UUID válido'),
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    politicaId: z.string().uuid('PoliticaId deve ser um UUID válido'),
    documentoAtribuicao: z.string().optional(),
    comiteAprovadorId: z.string().uuid().optional(),
    onboarding: z.boolean().default(false)
  })

  const UpdatePapelZod = z.object({
    listaPapelId: z.string().uuid().optional(),
    comunidadeId: z.string().uuid().optional(),
    nome: z.string().min(1).optional(),
    descricao: z.string().optional(),
    politicaId: z.string().uuid().optional(),
    documentoAtribuicao: z.string().optional(),
    comiteAprovadorId: z.string().uuid().optional(),
    onboarding: z.boolean().optional()
  })

  // GET /papeis - Listar papéis
  app.get('/', {
    schema: {
      description: 'Listar todos os papéis do sistema com relacionamentos',
      tags: ['Papéis'],
      summary: 'Listar papéis',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          comunidadeId: { type: 'string', format: 'uuid', description: 'Filtrar por ID da comunidade' },
          listaPapelId: { type: 'string', format: 'uuid', description: 'Filtrar por ID da lista de papel' },
          onboarding: { type: 'boolean', description: 'Filtrar por status de onboarding' }
        }
      },
      response: {
        200: {
          description: 'Lista de papéis',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  listaPapelId: { type: 'string', format: 'uuid' },
                  comunidadeId: { type: 'string', format: 'uuid' },
                  nome: { type: 'string' },
                  descricao: { type: ['string', 'null'] },
                  politicaId: { type: 'string', format: 'uuid' },
                  documentoAtribuicao: { type: ['string', 'null'] },
                  comiteAprovadorId: { type: ['string', 'null'], format: 'uuid' },
                  onboarding: { type: 'boolean' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  comunidade: {
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

  // GET /papeis/:id - Buscar papel por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar papel específico por ID com relacionamentos',
      tags: ['Papéis'],
      summary: 'Buscar papel por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Papel encontrado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                listaPapelId: { type: 'string', format: 'uuid' },
                comunidadeId: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                politicaId: { type: 'string', format: 'uuid' },
                documentoAtribuicao: { type: ['string', 'null'] },
                comiteAprovadorId: { type: ['string', 'null'], format: 'uuid' },
                onboarding: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                comunidade: {
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
          description: 'Papel não encontrado',
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

  // POST /papeis - Criar papel
  app.post('/', {
    schema: {
      description: 'Criar novo papel no sistema',
      tags: ['Papéis'],
      summary: 'Criar papel',
      body: {
        type: 'object',
        properties: {
          listaPapelId: { type: 'string', format: 'uuid', description: 'ID da lista de papel' },
          comunidadeId: { type: 'string', format: 'uuid', description: 'ID da comunidade' },
          nome: { type: 'string', minLength: 1, description: 'Nome do papel' },
          descricao: { type: 'string', description: 'Descrição do papel' },
          politicaId: { type: 'string', format: 'uuid', description: 'ID da política associada' },
          documentoAtribuicao: { type: 'string', description: 'Documento de atribuição' },
          comiteAprovadorId: { type: 'string', format: 'uuid', description: 'ID do comitê aprovador' },
          onboarding: { type: 'boolean', default: false, description: 'Se requer onboarding' }
        },
        required: ['listaPapelId', 'comunidadeId', 'nome', 'politicaId']
      },
      response: {
        201: {
          description: 'Papel criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                listaPapelId: { type: 'string', format: 'uuid' },
                comunidadeId: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                politicaId: { type: 'string', format: 'uuid' },
                documentoAtribuicao: { type: ['string', 'null'] },
                comiteAprovadorId: { type: ['string', 'null'], format: 'uuid' },
                onboarding: { type: 'boolean' },
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
    const validatedData = CreatePapelZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /papeis/:id - Atualizar papel
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de um papel específico',
      tags: ['Papéis'],
      summary: 'Atualizar papel',
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
          listaPapelId: { type: 'string', format: 'uuid' },
          comunidadeId: { type: 'string', format: 'uuid' },
          nome: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          politicaId: { type: 'string', format: 'uuid' },
          documentoAtribuicao: { type: 'string' },
          comiteAprovadorId: { type: 'string', format: 'uuid' },
          onboarding: { type: 'boolean' }
        }
      },
      response: {
        200: {
          description: 'Papel atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                listaPapelId: { type: 'string', format: 'uuid' },
                comunidadeId: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                politicaId: { type: 'string', format: 'uuid' },
                documentoAtribuicao: { type: ['string', 'null'] },
                comiteAprovadorId: { type: ['string', 'null'], format: 'uuid' },
                onboarding: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Papel não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdatePapelZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /papeis/:id - Deletar papel
  app.delete('/:id', {
    schema: {
      description: 'Deletar um papel do sistema',
      tags: ['Papéis'],
      summary: 'Deletar papel',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Papel deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Papel não encontrado',
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
