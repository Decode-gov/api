import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ClassificacaoInformacaoController } from '../controllers/classificacao-informacao.controller.js'

export async function classificacaoInformacaoRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ClassificacaoInformacaoController(app.prisma)

  // Schemas Zod para validação
  const CreateClassificacaoZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    politicaId: z.string().uuid('ID da política deve ser um UUID válido'),
    termoId: z.string().uuid('ID do termo deve ser um UUID válido').optional()
  })

  const UpdateClassificacaoZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional(),
    politicaId: z.string().uuid().optional(),
    termoId: z.string().uuid().optional()
  })

  const AtualizarTermoZod = z.object({
    termoId: z.string().uuid('ID do termo deve ser um UUID válido')
  })

  const AtribuirTermoZod = z.object({
    termoId: z.string().uuid('ID do termo deve ser um UUID válido')
  })

  // GET /classificacoes-informacao - Listar classificações
  app.get('/', {
    schema: {
      description: 'Listar classificações de informação com paginação e filtros',
      tags: ['Classificação de Informação'],
      summary: 'Listar classificações',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0, description: 'Número de registros para pular' },
          take: { type: 'number', minimum: 1, maximum: 100, description: 'Número de registros por página' },
          orderBy: { type: 'string', description: 'Campo para ordenação' },
          politicaId: { type: 'string', format: 'uuid', description: 'Filtrar por política' },
          nome: { type: 'string', description: 'Filtrar por nome (busca parcial)' }
        }
      },
      response: {
        200: {
          description: 'Classificações encontradas com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: { type: 'object' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request as any, reply)
  })

  // GET /classificacoes-informacao/:id - Buscar classificação por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar classificação de informação por ID',
      tags: ['Classificação de Informação'],
      summary: 'Buscar classificação',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da classificação' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Classificação encontrada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request as any, reply)
  })

  // POST /classificacoes-informacao - Criar nova classificação
  app.post('/', {
    schema: {
      description: 'Criar nova classificação de informação',
      tags: ['Classificação de Informação'],
      summary: 'Criar classificação',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da classificação' },
          descricao: { type: 'string', description: 'Descrição da classificação' },
          politicaId: { type: 'string', format: 'uuid', description: 'ID da política associada' },
          termoId: { type: 'string', format: 'uuid', description: 'ID do termo de definição (opcional)' }
        },
        required: ['nome', 'politicaId']
      }
    },
    preValidation: async (request, reply) => {
      const result = CreateClassificacaoZod.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({
          error: 'ValidationError',
          message: 'Dados inválidos',
          details: result.error.issues
        })
      }
    }
  }, async (request, reply) => {
    return controller.create(request as any, reply)
  })

  // PUT /classificacoes-informacao/:id - Atualizar classificação
  app.put('/:id', {
    schema: {
      description: 'Atualizar classificação de informação existente',
      tags: ['Classificação de Informação'],
      summary: 'Atualizar classificação',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da classificação' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da classificação' },
          descricao: { type: 'string', description: 'Descrição da classificação' },
          politicaId: { type: 'string', format: 'uuid', description: 'ID da política associada' },
          termoId: { type: 'string', format: 'uuid', description: 'ID do termo de definição' }
        }
      }
    },
    preValidation: async (request, reply) => {
      const result = UpdateClassificacaoZod.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({
          error: 'ValidationError',
          message: 'Dados inválidos',
          details: result.error.issues
        })
      }
    }
  }, async (request, reply) => {
    return controller.update(request as any, reply)
  })

  // DELETE /classificacoes-informacao/:id - Deletar classificação
  app.delete('/:id', {
    schema: {
      description: 'Deletar classificação de informação',
      tags: ['Classificação de Informação'],
      summary: 'Deletar classificação',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da classificação' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    return controller.delete(request as any, reply)
  })

  // POST /classificacoes-informacao/:id/termos - Atribuir termo à classificação
  app.post('/:id/termos', {
    schema: {
      description: 'Atribuir termo de glossário à classificação de informação',
      tags: ['Classificação de Informação'],
      summary: 'Atribuir termo',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da classificação' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          termoId: { type: 'string', format: 'uuid', description: 'ID do termo do glossário' }
        },
        required: ['termoId']
      }
    },
    preValidation: async (request, reply) => {
      const result = AtribuirTermoZod.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({
          error: 'ValidationError',
          message: 'Dados inválidos',
          details: result.error.issues
        })
      }
    }
  }, async (request, reply) => {
    return controller.atribuirTermo(request as any, reply)
  })

  // PUT /classificacoes-informacao/:id/termo - Atualizar apenas o termo de definição
  app.put('/:id/termo', {
    schema: {
      description: 'Atualizar apenas o termo de definição da classificação',
      tags: ['Classificação de Informação'],
      summary: 'Atualizar termo de definição',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da classificação' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          termoId: { type: 'string', format: 'uuid', description: 'ID do novo termo de definição' }
        },
        required: ['termoId']
      }
    },
    preValidation: async (request, reply) => {
      const result = AtualizarTermoZod.safeParse(request.body)
      if (!result.success) {
        return reply.code(400).send({
          error: 'ValidationError',
          message: 'Dados inválidos',
          details: result.error.issues
        })
      }
    }
  }, async (request, reply) => {
    return controller.atualizarTermo(request as any, reply)
  })

  // GET /classificacoes-informacao/todas - Listar todas as classificações (sem paginação)
  app.get('/todas', {
    schema: {
      description: 'Listar todas as classificações de informação cadastradas (sem paginação)',
      tags: ['Classificação de Informação'],
      summary: 'Listar todas as classificações',
      response: {
        200: {
          description: 'Todas as classificações encontradas com sucesso',
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
                  politica: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' }
                    }
                  },
                  termos: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        termo: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            termo: { type: 'string' },
                            definicao: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            total: { type: 'number' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.listarTodas(request, reply)
  })

  // GET /classificacoes-informacao/nivel/:nivel - Listar por nível (DEPRECADO - campo nivel não existe no schema)
  /*
  app.get('/nivel/:nivel', {
    schema: {
      description: 'Listar classificações por nível de segurança',
      tags: ['Classificação de Informação'],
      summary: 'Listar por nível',
      params: {
        type: 'object',
        properties: {
          nivel: {
            type: 'string',
            enum: ['PUBLICO', 'INTERNO', 'CONFIDENCIAL', 'SECRETO'],
            description: 'Nível de classificação'
          }
        },
        required: ['nivel']
      }
    }
  }, async (request, reply) => {
    return controller.listarPorNivel(request as any, reply)
  })
  */
}
