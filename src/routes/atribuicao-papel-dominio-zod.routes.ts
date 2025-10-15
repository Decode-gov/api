import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AtribuicaoPapelDominioController } from '../controllers/atribuicao-papel-dominio.controller.js'

export async function atribuicaoPapelDominioRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new AtribuicaoPapelDominioController(app.prisma)

  // Enums para validação
  const TipoEntidadeDocumentoEnum = z.enum([
    'Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI',
    'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'
  ])

  // Schemas Zod para validação
  const CreateAtribuicaoZod = z.object({
    papelId: z.string().uuid('ID do papel deve ser um UUID válido'),
    dominioId: z.string().uuid('ID do domínio deve ser um UUID válido'),
    tipoEntidade: TipoEntidadeDocumentoEnum,
    documentoAtribuicao: z.string().optional(),
    comiteAprovadorId: z.string().optional(),
    onboarding: z.boolean().default(false),
    dataInicioVigencia: z.string().optional(),
    dataTermino: z.string().optional(),
    observacoes: z.string().optional()
  })

  const UpdateAtribuicaoZod = z.object({
    papelId: z.string().optional(),
    dominioId: z.string().optional(),
    tipoEntidade: TipoEntidadeDocumentoEnum.optional(),
    documentoAtribuicao: z.string().optional(),
    comiteAprovadorId: z.string().optional(),
    onboarding: z.boolean().optional(),
    dataInicioVigencia: z.string().optional(),
    dataTermino: z.string().optional(),
    observacoes: z.string().optional()
  })

  // GET /atribuicoes - Listar atribuições
  app.get('/', {
    schema: {
      description: 'Listar todas as atribuições de papel a domínio',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Listar atribuições',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          papelId: {
            type: 'string',
            format: 'uuid',
            description: 'Filtrar por ID do papel'
          },
          dominioId: {
            type: 'string',
            format: 'uuid',
            description: 'Filtrar por ID do domínio'
          },
          tipoEntidade: {
            type: 'string',
            enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'],
            description: 'Filtrar por tipo de entidade'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de atribuições',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  papelId: { type: 'string', format: 'uuid' },
                  dominioId: { type: 'string', format: 'uuid' },
                  tipoEntidade: {
                    type: 'string',
                    enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']
                  },
                  documentoAtribuicao: { type: 'string', nullable: true },
                  comiteAprovadorId: { type: 'string', format: 'uuid', nullable: true },
                  onboarding: { type: 'boolean' },
                  dataInicioVigencia: { type: 'string', format: 'date-time' },
                  dataTermino: { type: 'string', format: 'date-time', nullable: true },
                  observacoes: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  papel: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      nome: { type: 'string' },
                      descricao: { type: 'string', nullable: true }
                    }
                  },
                  dominio: {
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
    return controller.findMany(request as any, reply)
  })

  // GET /atribuicoes/:id - Buscar atribuição por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar atribuição por ID',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Buscar atribuição por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Atribuição encontrada',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                papelId: { type: 'string', format: 'uuid' },
                dominioId: { type: 'string', format: 'uuid' },
                tipoEntidade: {
                  type: 'string',
                  enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']
                },
                documentoAtribuicao: { type: 'string', nullable: true },
                comiteAprovadorId: { type: 'string', format: 'uuid', nullable: true },
                onboarding: { type: 'boolean' },
                dataInicioVigencia: { type: 'string', format: 'date-time' },
                dataTermino: { type: 'string', format: 'date-time', nullable: true },
                observacoes: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                papel: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    nome: { type: 'string' },
                    descricao: { type: 'string', nullable: true }
                  }
                },
                dominio: {
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
          description: 'Atribuição não encontrada',
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

  // POST /atribuicoes - Criar nova atribuição
  app.post('/', {
    schema: {
      description: 'Criar uma nova atribuição de papel a domínio',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Criar atribuição',
      body: {
        type: 'object',
        properties: {
          papelId: { type: 'string', format: 'uuid' },
          dominioId: { type: 'string', format: 'uuid' },
          tipoEntidade: {
            type: 'string',
            enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']
          },
          documentoAtribuicao: { type: 'string' },
          comiteAprovadorId: { type: 'string', format: 'uuid' },
          onboarding: { type: 'boolean', default: false },
          dataInicioVigencia: { type: 'string', format: 'date-time' },
          dataTermino: { type: 'string', format: 'date-time' },
          observacoes: { type: 'string' }
        },
        required: ['papelId', 'dominioId', 'tipoEntidade']
      },
      response: {
        201: {
          description: 'Atribuição criada com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                papelId: { type: 'string', format: 'uuid' },
                dominioId: { type: 'string', format: 'uuid' },
                tipoEntidade: { type: 'string' },
                documentoAtribuicao: { type: 'string', nullable: true },
                comiteAprovadorId: { type: 'string', format: 'uuid', nullable: true },
                onboarding: { type: 'boolean' },
                dataInicioVigencia: { type: 'string', format: 'date-time' },
                dataTermino: { type: 'string', format: 'date-time', nullable: true },
                observacoes: { type: 'string', nullable: true },
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
    const validation = CreateAtribuicaoZod.safeParse(request.body)
    if (!validation.success) {
      return (reply as any).badRequest('Dados de entrada inválidos')
    }
    return controller.create(request as any, reply)
  })

  // PUT /atribuicoes/:id - Atualizar atribuição
  app.put('/:id', {
    schema: {
      description: 'Atualizar uma atribuição existente',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Atualizar atribuição',
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
          papelId: { type: 'string', format: 'uuid' },
          dominioId: { type: 'string', format: 'uuid' },
          tipoEntidade: {
            type: 'string',
            enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']
          },
          documentoAtribuicao: { type: 'string' },
          comiteAprovadorId: { type: 'string', format: 'uuid' },
          onboarding: { type: 'boolean' },
          dataInicioVigencia: { type: 'string', format: 'date-time' },
          dataTermino: { type: 'string', format: 'date-time' },
          observacoes: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Atribuição atualizada com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                papelId: { type: 'string', format: 'uuid' },
                dominioId: { type: 'string', format: 'uuid' },
                tipoEntidade: { type: 'string' },
                documentoAtribuicao: { type: 'string', nullable: true },
                comiteAprovadorId: { type: 'string', format: 'uuid', nullable: true },
                onboarding: { type: 'boolean' },
                dataInicioVigencia: { type: 'string', format: 'date-time' },
                dataTermino: { type: 'string', format: 'date-time', nullable: true },
                observacoes: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Atribuição não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validation = UpdateAtribuicaoZod.safeParse(request.body)
    if (!validation.success) {
      return (reply as any).badRequest('Dados de entrada inválidos')
    }
    return controller.update(request as any, reply)
  })

  // DELETE /atribuicoes/:id - Deletar atribuição
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma atribuição',
      tags: ['Atribuições Papel-Domínio'],
      summary: 'Deletar atribuição',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Atribuição deletada com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                papelId: { type: 'string', format: 'uuid' },
                dominioId: { type: 'string', format: 'uuid' }
              }
            }
          }
        },
        404: {
          description: 'Atribuição não encontrada',
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
