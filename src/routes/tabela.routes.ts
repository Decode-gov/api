import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { TabelaController } from '../controllers/tabela.controller.js'

export async function tabelaRoutes(app: FastifyInstance, _opts: FastifyPluginOptions = {}) {
  const controller = new TabelaController(app.prisma)

  // GET /api/tabelas - Listar todas as tabelas
  app.get('/api/tabelas', {
    schema: {
      description: 'Listar todas as tabelas cadastradas no sistema',
      tags: ['Tabelas'],
      summary: 'Listar tabelas',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0, description: 'Número de registros a pular', example: 0 },
          take: { type: 'number', minimum: 1, maximum: 100, description: 'Número de registros a retornar', example: 20 },
          orderBy: { type: 'string', description: 'Campo para ordenação', example: 'nome' }
        }
      },
      response: {
        200: {
          description: 'Lista de tabelas',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Tabelas encontradas' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string', example: 'usuarios' },
                  bancoId: { type: ['string', 'null'], format: 'uuid' },
                  sistemaId: { type: ['string', 'null'], format: 'uuid' },
                  termoId: { type: ['string', 'null'], format: 'uuid' },
                  necessidadeInfoId: { type: ['string', 'null'], format: 'uuid' },
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

  // GET /api/tabelas/:id - Buscar tabela por ID
  app.get('/api/tabelas/:id', {
    schema: {
      description: 'Buscar tabela específica por ID',
      tags: ['Tabelas'],
      summary: 'Buscar tabela por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da tabela' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Tabela encontrada',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Tabela encontrada' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'usuarios' },
                bancoId: { type: ['string', 'null'], format: 'uuid' },
                sistemaId: { type: ['string', 'null'], format: 'uuid' },
                termoId: { type: ['string', 'null'], format: 'uuid' },
                necessidadeInfoId: { type: ['string', 'null'], format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Tabela não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Tabela não encontrada' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /api/tabelas - Criar nova tabela
  app.post('/api/tabelas', {
    schema: {
      description: 'Criar nova tabela no catálogo de dados',
      tags: ['Tabelas'],
      summary: 'Criar tabela',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'clientes' },
          bancoId: { type: ['string', 'null'], format: 'uuid', description: 'ID do banco de dados' },
          sistemaId: { type: ['string', 'null'], format: 'uuid', description: 'ID do sistema' },
          termoId: { type: ['string', 'null'], format: 'uuid', description: 'ID do termo' },
          necessidadeInfoId: { type: ['string', 'null'], format: 'uuid', description: 'ID da necessidade de informação' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Tabela criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Tabela criada com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'clientes' },
                bancoId: { type: ['string', 'null'], format: 'uuid' },
                sistemaId: { type: ['string', 'null'], format: 'uuid' },
                termoId: { type: ['string', 'null'], format: 'uuid' },
                necessidadeInfoId: { type: ['string', 'null'], format: 'uuid' },
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
            error: { type: 'string', example: 'Dados inválidos' }
          }
        }
      }
    }
  }, controller.create.bind(controller))

  // PUT /api/tabelas/:id - Atualizar tabela
  app.put('/api/tabelas/:id', {
    schema: {
      description: 'Atualizar dados de uma tabela específica',
      tags: ['Tabelas'],
      summary: 'Atualizar tabela',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da tabela' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'clientes_atualizados' },
          bancoId: { type: ['string', 'null'], format: 'uuid', description: 'ID do banco de dados' },
          sistemaId: { type: ['string', 'null'], format: 'uuid', description: 'ID do sistema' },
          termoId: { type: ['string', 'null'], format: 'uuid', description: 'ID do termo' },
          necessidadeInfoId: { type: ['string', 'null'], format: 'uuid', description: 'ID da necessidade de informação' }
        }
      },
      response: {
        200: {
          description: 'Tabela atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Tabela atualizada com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'clientes_atualizados' },
                bancoId: { type: ['string', 'null'], format: 'uuid' },
                sistemaId: { type: ['string', 'null'], format: 'uuid' },
                termoId: { type: ['string', 'null'], format: 'uuid' },
                necessidadeInfoId: { type: ['string', 'null'], format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object', properties: { error: { type: 'string' } }
        },
        404: {
          description: 'Tabela não encontrada',
          type: 'object', properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.update.bind(controller))

  // DELETE /api/tabelas/:id - Deletar tabela
  app.delete('/api/tabelas/:id', {
    schema: {
      description: 'Excluir tabela do catálogo de dados',
      tags: ['Tabelas'],
      summary: 'Excluir tabela',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da tabela' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Tabela excluída com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Tabela excluída com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'usuarios' },
                bancoId: { type: ['string', 'null'], format: 'uuid' },
                sistemaId: { type: ['string', 'null'], format: 'uuid' }
              }
            }
          }
        },
        404: {
          description: 'Tabela não encontrada',
          type: 'object', properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.delete.bind(controller))
}
