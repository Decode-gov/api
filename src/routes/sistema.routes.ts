import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { SistemaController } from '../controllers/sistema.controller.js'

export async function sistemaRoutes(app: FastifyInstance, _opts: FastifyPluginOptions = {}) {
  const controller = new SistemaController(app.prisma)

  // GET /api/sistemas - Listar todos os sistemas
  app.get('/api/sistemas', {
    schema: {
      description: 'Listar todos os sistemas cadastrados',
      tags: ['Sistemas'],
      summary: 'Listar sistemas',
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
          description: 'Lista de sistemas',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Sistemas encontrados' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string', example: 'Sistema ERP' },
                  descricao: { type: ['string', 'null'], example: 'Sistema de gestão empresarial' },
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

  // GET /api/sistemas/:id - Buscar sistema por ID
  app.get('/api/sistemas/:id', {
    schema: {
      description: 'Buscar sistema específico por ID',
      tags: ['Sistemas'],
      summary: 'Buscar sistema por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único do sistema' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Sistema encontrado',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Sistema encontrado' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Sistema ERP' },
                descricao: { type: ['string', 'null'], example: 'Sistema de gestão empresarial' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Sistema não encontrado',
          type: 'object', properties: { error: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /api/sistemas - Criar novo sistema
  app.post('/api/sistemas', {
    schema: {
      description: 'Criar novo sistema no catálogo',
      tags: ['Sistemas'],
      summary: 'Criar sistema',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'Sistema CRM' },
          descricao: { type: ['string', 'null'], example: 'Sistema de relacionamento com cliente' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Sistema criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Sistema criado com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Sistema CRM' },
                descricao: { type: ['string', 'null'], example: 'Sistema de relacionamento com cliente' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        400: {
          description: 'Dados inválidos',
          type: 'object', properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.create.bind(controller))

  // PUT /api/sistemas/:id - Atualizar sistema
  app.put('/api/sistemas/:id', {
    schema: {
      description: 'Atualizar dados de um sistema específico',
      tags: ['Sistemas'],
      summary: 'Atualizar sistema',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único do sistema' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'Sistema ERP Atualizado' },
          descricao: { type: ['string', 'null'], example: 'Sistema empresarial com novas funcionalidades' }
        }
      },
      response: {
        200: {
          description: 'Sistema atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Sistema atualizado com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Sistema ERP Atualizado' },
                descricao: { type: ['string', 'null'], example: 'Sistema empresarial com novas funcionalidades' },
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
          description: 'Sistema não encontrado',
          type: 'object', properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.update.bind(controller))

  // DELETE /api/sistemas/:id - Deletar sistema
  app.delete('/api/sistemas/:id', {
    schema: {
      description: 'Excluir sistema do catálogo',
      tags: ['Sistemas'],
      summary: 'Excluir sistema',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único do sistema' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Sistema excluído com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Sistema excluído com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Sistema ERP' },
                descricao: { type: ['string', 'null'], example: 'Sistema de gestão empresarial' }
              }
            }
          }
        },
        404: {
          description: 'Sistema não encontrado',
          type: 'object', properties: { error: { type: 'string' } }
        }
      }
    }
  }, controller.delete.bind(controller))
}
