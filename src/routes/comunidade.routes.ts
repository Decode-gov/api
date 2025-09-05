import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ComunidadeController } from '../controllers/comunidade.controller.js'

export async function comunidadeRoutes(app: FastifyInstance, _opts: FastifyPluginOptions = {}) {
  const controller = new ComunidadeController(app.prisma)

  // GET /api/comunidades - Listar todas as comunidades
  app.get('/api/comunidades', {
    schema: {
      description: 'Listar todas as comunidades e sub-comunidades',
      tags: ['Comunidades'],
      summary: 'Listar comunidades',
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
          description: 'Lista de comunidades',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Comunidades encontradas' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  nome: { type: 'string', example: 'Tecnologia' },
                  parentId: { type: ['string', 'null'], format: 'uuid' },
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

  // GET /api/comunidades/:id - Buscar comunidade por ID
  app.get('/api/comunidades/:id', {
    schema: {
      description: 'Buscar comunidade específica por ID',
      tags: ['Comunidades'],
      summary: 'Buscar comunidade por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da comunidade' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Comunidade encontrada',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Comunidade encontrada' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Tecnologia' },
                parentId: { type: ['string', 'null'], format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        404: {
          description: 'Comunidade não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Comunidade não encontrada' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request, reply)
  })

  // POST /api/comunidades - Criar nova comunidade
  app.post('/api/comunidades', {
    schema: {
      description: 'Criar nova comunidade ou sub-comunidade',
      tags: ['Comunidades'],
      summary: 'Criar comunidade',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'Desenvolvimento' },
          parentId: { type: ['string', 'null'], format: 'uuid', description: 'ID da comunidade pai (para sub-comunidades)' }
        },
        required: ['nome']
      },
      response: {
        201: {
          description: 'Comunidade criada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Comunidade criada com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Desenvolvimento' },
                parentId: { type: ['string', 'null'], format: 'uuid' },
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

  // PUT /api/comunidades/:id - Atualizar comunidade
  app.put('/api/comunidades/:id', {
    schema: {
      description: 'Atualizar dados de uma comunidade específica',
      tags: ['Comunidades'],
      summary: 'Atualizar comunidade',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da comunidade' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1, example: 'Desenvolvimento Atualizado' },
          parentId: { type: ['string', 'null'], format: 'uuid', description: 'ID da comunidade pai' }
        }
      },
      response: {
        200: {
          description: 'Comunidade atualizada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Comunidade atualizada com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Desenvolvimento Atualizado' },
                parentId: { type: ['string', 'null'], format: 'uuid' },
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
        },
        404: {
          description: 'Comunidade não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Comunidade não encontrada' }
          }
        }
      }
    }
  }, controller.update.bind(controller))

  // DELETE /api/comunidades/:id - Deletar comunidade
  app.delete('/api/comunidades/:id', {
    schema: {
      description: 'Excluir comunidade do sistema',
      tags: ['Comunidades'],
      summary: 'Excluir comunidade',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID único da comunidade' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Comunidade excluída com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Comunidade excluída com sucesso' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nome: { type: 'string', example: 'Tecnologia' },
                parentId: { type: ['string', 'null'], format: 'uuid' }
              }
            }
          }
        },
        404: {
          description: 'Comunidade não encontrada',
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Comunidade não encontrada' }
          }
        }
      }
    }
  }, controller.delete.bind(controller))
}
