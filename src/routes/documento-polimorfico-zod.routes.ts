import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DocumentoPolimorficoController } from '../controllers/documento-polimorfico.controller.js'

export async function documentoPolimorficoRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new DocumentoPolimorficoController(app.prisma)

  // Enums para validação
  const TipoEntidadeDocumentoEnum = z.enum([
    'Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI',
    'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'
  ])

  // Schemas Zod para validação
  const CreateDocumentoZod = z.object({
    entidadeId: z.string().uuid('ID da entidade deve ser um UUID válido'),
    tipoEntidade: TipoEntidadeDocumentoEnum,
    nomeArquivo: z.string().min(1, 'Nome do arquivo é obrigatório'),
    tamanhoBytes: z.string().transform(s => BigInt(s)),
    tipoArquivo: z.string().min(1, 'Tipo do arquivo é obrigatório'),
    caminhoArquivo: z.string().min(1, 'Caminho do arquivo é obrigatório'),
    descricao: z.string().optional(),
    metadados: z.string().optional(),
    checksum: z.string().optional(),
    versao: z.number().int().min(1).default(1)
  })

  const UpdateDocumentoZod = z.object({
    nomeArquivo: z.string().min(1).optional(),
    tamanhoBytes: z.string().transform(s => BigInt(s)).optional(),
    tipoArquivo: z.string().min(1).optional(),
    caminhoArquivo: z.string().min(1).optional(),
    descricao: z.string().optional(),
    metadados: z.string().optional(),
    checksum: z.string().optional(),
    versao: z.number().int().min(1).optional(),
    ativo: z.boolean().optional()
  })

  // GET /documentos - Listar documentos
  app.get('/', {
    schema: {
      description: 'Listar todos os documentos polimórficos',
      tags: ['Documentos Polimórficos'],
      summary: 'Listar documentos',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, default: 0 },
          take: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          orderBy: { type: 'string' },
          tipoEntidade: {
            type: 'string',
            enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'],
            description: 'Filtrar por tipo de entidade'
          },
          entidadeId: {
            type: 'string',
            format: 'uuid',
            description: 'Filtrar por ID da entidade'
          }
        }
      },
      response: {
        200: {
          description: 'Lista de documentos',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  entidadeId: { type: 'string', format: 'uuid' },
                  tipoEntidade: { type: 'string' },
                  nomeArquivo: { type: 'string' },
                  tamanhoBytes: { type: 'string' },
                  tipoArquivo: { type: 'string' },
                  caminhoArquivo: { type: 'string' },
                  descricao: { type: 'string', nullable: true },
                  metadados: { type: 'string', nullable: true },
                  checksum: { type: 'string', nullable: true },
                  versao: { type: 'integer' },
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
    return controller.findMany(request as any, reply)
  })

  // GET /documentos/entidade/:tipoEntidade/:entidadeId - Listar documentos de uma entidade específica
  app.get('/entidade/:tipoEntidade/:entidadeId', {
    schema: {
      description: 'Listar documentos de uma entidade específica',
      tags: ['Documentos Polimórficos'],
      summary: 'Listar documentos por entidade',
      params: {
        type: 'object',
        properties: {
          tipoEntidade: {
            type: 'string',
            enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']
          },
          entidadeId: { type: 'string', format: 'uuid' }
        },
        required: ['tipoEntidade', 'entidadeId']
      },
      response: {
        200: {
          description: 'Lista de documentos da entidade',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  entidadeId: { type: 'string', format: 'uuid' },
                  tipoEntidade: { type: 'string' },
                  nomeArquivo: { type: 'string' },
                  tamanhoBytes: { type: 'string' },
                  tipoArquivo: { type: 'string' },
                  caminhoArquivo: { type: 'string' },
                  descricao: { type: 'string', nullable: true },
                  versao: { type: 'integer' },
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
    return controller.listarDocumentosPorEntidade(request as any, reply)
  })

  // GET /documentos/:id - Buscar documento por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar documento por ID',
      tags: ['Documentos Polimórficos'],
      summary: 'Buscar documento por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Documento encontrado',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                entidadeId: { type: 'string', format: 'uuid' },
                tipoEntidade: { type: 'string' },
                nomeArquivo: { type: 'string' },
                tamanhoBytes: { type: 'string' },
                tipoArquivo: { type: 'string' },
                caminhoArquivo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                metadados: { type: 'string', nullable: true },
                checksum: { type: 'string', nullable: true },
                versao: { type: 'integer' },
                ativo: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Documento não encontrado',
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

  // POST /documentos - Anexar novo documento
  app.post('/', {
    schema: {
      description: 'Anexar um novo documento a uma entidade',
      tags: ['Documentos Polimórficos'],
      summary: 'Anexar documento',
      body: {
        type: 'object',
        properties: {
          entidadeId: { type: 'string', format: 'uuid' },
          tipoEntidade: {
            type: 'string',
            enum: ['Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna']
          },
          nomeArquivo: { type: 'string', minLength: 1 },
          tamanhoBytes: { type: 'string' },
          tipoArquivo: { type: 'string', minLength: 1 },
          caminhoArquivo: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          metadados: { type: 'string' },
          checksum: { type: 'string' },
          versao: { type: 'integer', minimum: 1, default: 1 }
        },
        required: ['entidadeId', 'tipoEntidade', 'nomeArquivo', 'tamanhoBytes', 'tipoArquivo', 'caminhoArquivo']
      },
      response: {
        201: {
          description: 'Documento anexado com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                entidadeId: { type: 'string', format: 'uuid' },
                tipoEntidade: { type: 'string' },
                nomeArquivo: { type: 'string' },
                tamanhoBytes: { type: 'string' },
                tipoArquivo: { type: 'string' },
                caminhoArquivo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                versao: { type: 'integer' },
                ativo: { type: 'boolean' },
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
    const validation = CreateDocumentoZod.safeParse(request.body)
    if (!validation.success) {
      return (reply as any).badRequest('Dados de entrada inválidos')
    }
    return controller.anexarDocumento(request as any, reply)
  })

  // PUT /documentos/:id - Atualizar documento
  app.put('/:id', {
    schema: {
      description: 'Atualizar metadados de um documento',
      tags: ['Documentos Polimórficos'],
      summary: 'Atualizar documento',
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
          nomeArquivo: { type: 'string', minLength: 1 },
          tamanhoBytes: { type: 'string' },
          tipoArquivo: { type: 'string', minLength: 1 },
          caminhoArquivo: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          metadados: { type: 'string' },
          checksum: { type: 'string' },
          versao: { type: 'integer', minimum: 1 },
          ativo: { type: 'boolean' }
        }
      },
      response: {
        200: {
          description: 'Documento atualizado com sucesso',
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                entidadeId: { type: 'string', format: 'uuid' },
                tipoEntidade: { type: 'string' },
                nomeArquivo: { type: 'string' },
                tamanhoBytes: { type: 'string' },
                tipoArquivo: { type: 'string' },
                caminhoArquivo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                versao: { type: 'integer' },
                ativo: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Documento não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const validation = UpdateDocumentoZod.safeParse(request.body)
    if (!validation.success) {
      return (reply as any).badRequest('Dados de entrada inválidos')
    }
    return controller.update(request as any, reply)
  })

  // DELETE /documentos/:id - Remover documento (soft delete)
  app.delete('/:id', {
    schema: {
      description: 'Remover um documento (marca como inativo)',
      tags: ['Documentos Polimórficos'],
      summary: 'Remover documento',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Documento removido com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                ativo: { type: 'boolean' }
              }
            }
          }
        },
        404: {
          description: 'Documento não encontrado',
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.deletarDocumento.bind(controller))
}
