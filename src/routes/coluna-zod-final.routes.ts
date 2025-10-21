import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ColunaController } from '../controllers/coluna.controller.js'

export async function colunaZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ColunaController(app.prisma)

  // Schemas Zod para validação interna
  const CreateColunaZod = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().optional(),
    obrigatorio: z.boolean().default(false),
    unicidade: z.boolean().default(false),
    ativo: z.boolean().default(true),
    tabelaId: z.uuid({ message: 'TabelaId deve ser um UUID válido' }),
    tipoDadosId: z.string().optional(),
    politicaInternaId: z.string().optional()
  })

  const UpdateColunaZod = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().optional(),
    obrigatorio: z.boolean().optional(),
    unicidade: z.boolean().optional(),
    ativo: z.boolean().optional(),
    tabelaId: z.string().optional(),
    tipoDadosId: z.string().optional(),
    politicaInternaId: z.string().optional()
  })

  // GET /colunas - Listar colunas
  app.get('/', {
    schema: {
      description: 'Listar todas as colunas de tabelas com seus relacionamentos',
      tags: ['Colunas'],
      summary: 'Listar colunas',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          tabelaId: { type: 'string', format: 'uuid', description: 'Filtrar por ID da tabela' }
        }
      },
      response: {
        200: {
          description: 'Lista de colunas',
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
                  obrigatorio: { type: 'boolean' },
                  unicidade: { type: 'boolean' },
                  ativo: { type: 'boolean' },
                  tabelaId: { type: 'string', format: 'uuid' },
                  tipoDadosId: { type: ['string', 'null'], format: 'uuid' },
                  politicaInternaId: { type: ['string', 'null'], format: 'uuid' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
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
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request, reply)
  })

  // GET /colunas/:id - Buscar coluna por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar coluna específica por ID com relacionamentos',
      tags: ['Colunas'],
      summary: 'Buscar coluna por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Coluna encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                obrigatorio: { type: 'boolean' },
                unicidade: { type: 'boolean' },
                ativo: { type: 'boolean' },
                tabelaId: { type: 'string', format: 'uuid' },
                tipoDadosId: { type: ['string', 'null'], format: 'uuid' },
                politicaInternaId: { type: ['string', 'null'], format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
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
        },
        404: {
          description: 'Coluna não encontrada',
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

  // POST /colunas - Criar coluna
  app.post('/', {
    schema: {
      description: 'Criar nova coluna em uma tabela',
      tags: ['Colunas'],
      summary: 'Criar coluna',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da coluna' },
          descricao: { type: 'string', description: 'Descrição da coluna' },
          obrigatorio: { type: 'boolean', default: false, description: 'Se a coluna é obrigatória' },
          unicidade: { type: 'boolean', default: false, description: 'Se a coluna tem valores únicos' },
          ativo: { type: 'boolean', default: true, description: 'Se a coluna está ativa' },
          tabelaId: { type: 'string', format: 'uuid', description: 'ID da tabela pai' },
          tipoDadosId: { type: 'string', format: 'uuid', description: 'ID do tipo de dados' },
          politicaInternaId: { type: 'string', format: 'uuid', description: 'ID da política interna' }
        },
        required: ['nome', 'tabelaId']
      },
      response: {
        201: {
          description: 'Coluna criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                obrigatorio: { type: 'boolean' },
                unicidade: { type: 'boolean' },
                ativo: { type: 'boolean' },
                tabelaId: { type: 'string', format: 'uuid' },
                tipoDadosId: { type: ['string', 'null'], format: 'uuid' },
                politicaInternaId: { type: ['string', 'null'], format: 'uuid' },
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
    const validatedData = CreateColunaZod.parse(request.body)
    return controller.create(request, reply)
  })

  // PUT /colunas/:id - Atualizar coluna
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma coluna específica',
      tags: ['Colunas'],
      summary: 'Atualizar coluna',
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
          obrigatorio: { type: 'boolean' },
          unicidade: { type: 'boolean' },
          ativo: { type: 'boolean' },
          tabelaId: { type: 'string', format: 'uuid' },
          tipoDadosId: { type: 'string', format: 'uuid' },
          politicaInternaId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Coluna atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: ['string', 'null'] },
                obrigatorio: { type: 'boolean' },
                unicidade: { type: 'boolean' },
                ativo: { type: 'boolean' },
                tabelaId: { type: 'string', format: 'uuid' },
                tipoDadosId: { type: ['string', 'null'], format: 'uuid' },
                politicaInternaId: { type: ['string', 'null'], format: 'uuid' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Coluna não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validatedData = UpdateColunaZod.parse(request.body)
    return controller.update(request, reply)
  })

  // DELETE /colunas/:id - Deletar coluna
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma coluna do sistema',
      tags: ['Colunas'],
      summary: 'Deletar coluna',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Coluna deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Coluna não encontrada',
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

