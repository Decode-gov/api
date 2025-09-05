import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { PoliticaInternaController } from '../controllers/politica-interna.controller.js'

export async function politicaInternaRoutes(app: FastifyInstance, _opts: FastifyPluginOptions = {}) {
  const controller = new PoliticaInternaController(app.prisma)

  // GET /api/politicas-internas - Listar todas as políticas internas
  app.get('/api/politicas-internas', {
    schema: {
      description: 'Listar todas as políticas internas da organização',
      tags: ['Políticas Internas'],
      summary: 'Listar políticas internas',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0, description: 'Número de registros a pular' },
          take: { type: 'number', minimum: 1, maximum: 100, description: 'Número de registros a retornar' },
          orderBy: { type: 'string', description: 'Campo para ordenação' }
        }
      },
      response: {
        200: {
          description: 'Lista de políticas internas',
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
                  descricao: { type: 'string' },
                  categoria: { type: 'string' },
                  status: { type: 'string', enum: ['Em_elaboracao', 'Vigente', 'Revogada'] },
                  versao: { type: 'string' },
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

  // GET /api/politicas-internas/:id - Buscar política interna por ID
  app.get('/api/politicas-internas/:id', {
    schema: {
      description: 'Buscar política interna específica por ID',
      tags: ['Políticas Internas'],
      summary: 'Buscar política por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da política' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Política encontrada',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                categoria: { type: 'string' },
                objetivo: { type: 'string' },
                escopo: { type: 'string' },
                responsavel: { type: 'string' },
                status: { type: 'string', enum: ['Em_elaboracao', 'Vigente', 'Revogada'] },
                versao: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Política não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /api/politicas-internas - Criar nova política interna
  app.post('/api/politicas-internas', {
    schema: {
      description: 'Criar nova política interna na organização',
      tags: ['Políticas Internas'],
      summary: 'Criar política interna',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da política' },
          descricao: { type: 'string', description: 'Descrição detalhada da política' },
          categoria: { type: 'string', description: 'Categoria da política' },
          objetivo: { type: 'string', description: 'Objetivo da política' },
          escopo: { type: 'string', description: 'Escopo de aplicação' },
          dominioDadosId: { type: ['string', 'null'], format: 'uuid', description: 'ID do domínio de dados' },
          responsavel: { type: 'string', description: 'Responsável pela política' },
          dataCriacao: { type: 'string', format: 'date-time', description: 'Data de criação' },
          dataInicioVigencia: { type: 'string', format: 'date-time', description: 'Data de início de vigência' },
          dataTermino: { type: ['string', 'null'], format: 'date-time', description: 'Data de término (opcional)' },
          status: { type: 'string', enum: ['Em_elaboracao', 'Vigente', 'Revogada'], description: 'Status da política' },
          versao: { type: 'string', description: 'Versão da política' },
          anexosUrl: { type: ['string', 'null'], description: 'URL dos anexos' },
          relacionamento: { type: ['string', 'null'], description: 'Relacionamentos da política' },
          observacoes: { type: ['string', 'null'], description: 'Observações adicionais' }
        },
        required: [
          'nome', 'descricao', 'categoria', 'objetivo', 'escopo',
          'responsavel', 'dataCriacao', 'dataInicioVigencia', 'status', 'versao'
        ]
      },
      response: {
        201: {
          description: 'Política criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                categoria: { type: 'string' },
                status: { type: 'string', enum: ['Em_elaboracao', 'Vigente', 'Revogada'] },
                versao: { type: 'string' },
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
            error: { type: 'string' }
          }
        }
      }
    }
  }, controller.create.bind(controller))

  // PUT /api/politicas-internas/:id - Atualizar política interna
  app.put('/api/politicas-internas/:id', {
    schema: {
      description: 'Atualizar política interna existente',
      tags: ['Políticas Internas'],
      summary: 'Atualizar política interna',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da política interna' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, description: 'Nome da política' },
          descricao: { type: 'string', description: 'Descrição detalhada da política' },
          categoria: { type: 'string', description: 'Categoria da política' },
          objetivo: { type: 'string', description: 'Objetivo da política' },
          escopo: { type: 'string', description: 'Escopo de aplicação' },
          dominioDadosId: { type: ['string', 'null'], format: 'uuid', description: 'ID do domínio de dados' },
          responsavel: { type: 'string', description: 'Responsável pela política' },
          dataCriacao: { type: 'string', format: 'date-time', description: 'Data de criação' },
          dataInicioVigencia: { type: 'string', format: 'date-time', description: 'Data de início de vigência' },
          dataTermino: { type: ['string', 'null'], format: 'date-time', description: 'Data de término (opcional)' },
          status: { type: 'string', enum: ['Em_elaboracao', 'Vigente', 'Revogada'], description: 'Status da política' },
          versao: { type: 'string', description: 'Versão da política' },
          anexosUrl: { type: ['string', 'null'], description: 'URL dos anexos' },
          relacionamento: { type: ['string', 'null'], description: 'Relacionamentos da política' },
          observacoes: { type: ['string', 'null'], description: 'Observações adicionais' }
        }
      },
      response: {
        200: {
          description: 'Política atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string' },
                descricao: { type: 'string' },
                categoria: { type: 'string' },
                status: { type: 'string', enum: ['Em_elaboracao', 'Vigente', 'Revogada'] },
                versao: { type: 'string' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Política não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, controller.update.bind(controller))

  // DELETE /api/politicas-internas/:id - Deletar política interna
  app.delete('/api/politicas-internas/:id', {
    schema: {
      description: 'Deletar política interna da organização',
      tags: ['Políticas Internas'],
      summary: 'Deletar política interna',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da política interna' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Política deletada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        404: {
          description: 'Política não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, controller.delete.bind(controller))
}
