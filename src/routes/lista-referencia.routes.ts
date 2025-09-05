import type { FastifyInstance } from 'fastify'
import { ListaReferenciaController } from '../controllers/lista-referencia.controller.js'

export async function listaReferenciaRoutes(fastify: FastifyInstance) {
  const controller = new ListaReferenciaController(fastify.prisma)

  // Schema para lista de referência
  const listaReferenciaBodySchema = {
    type: 'object',
    required: ['nome', 'valores'],
    properties: {
      nome: { type: 'string', description: 'Nome da lista de referência' },
      descricao: { type: 'string', description: 'Descrição da lista de referência' },
      valores: { type: 'string', description: 'Array JSON com valores únicos da lista' },
      tabelaId: { type: 'string', format: 'uuid', description: 'ID da tabela associada' },
      colunaId: { type: 'string', format: 'uuid', description: 'ID da coluna associada' }
    }
  }

  const listaReferenciaResponseSchema = {
    type: 'object',
    properties: {
      message: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nome: { type: 'string' },
          descricao: { type: 'string' },
          valores: { type: 'string' },
          tabelaId: { type: 'string' },
          colunaId: { type: 'string' },
          tabela: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nome: { type: 'string' }
            }
          },
          coluna: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nome: { type: 'string' }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }

  // GET /listas-referencia - Listar todas as listas de referência
  fastify.get('/', {
    schema: {
      summary: 'Listar todas as listas de referência',
      description: 'Recupera todas as listas de referência cadastradas no sistema',
      tags: ['Listas de Referência'],
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0, description: 'Número de registros para pular' },
          take: { type: 'integer', minimum: 1, maximum: 100, description: 'Número de registros para retornar' },
          orderBy: { type: 'string', description: 'Campo para ordenação' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: listaReferenciaResponseSchema.properties.data
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request, reply)
  })

  // GET /listas-referencia/:id - Buscar lista de referência por ID
  fastify.get('/:id', {
    schema: {
      summary: 'Buscar lista de referência por ID',
      description: 'Recupera uma lista de referência específica pelo ID',
      tags: ['Listas de Referência'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da lista de referência' }
        }
      },
      response: {
        200: listaReferenciaResponseSchema,
        404: {
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

  // POST /listas-referencia - Criar nova lista de referência
  fastify.post('/', {
    schema: {
      summary: 'Criar nova lista de referência',
      description: 'Cria uma nova lista de referência com valores únicos validados',
      tags: ['Listas de Referência'],
      body: listaReferenciaBodySchema,
      response: {
        201: listaReferenciaResponseSchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.create.bind(controller))

  // PUT /listas-referencia/:id - Atualizar lista de referência
  fastify.put('/:id', {
    schema: {
      summary: 'Atualizar lista de referência',
      description: 'Atualiza uma lista de referência existente',
      tags: ['Listas de Referência'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da lista de referência' }
        }
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', description: 'Nome da lista de referência' },
          descricao: { type: 'string', description: 'Descrição da lista de referência' },
          valores: { type: 'string', description: 'Array JSON com valores únicos da lista' },
          tabelaId: { type: 'string', format: 'uuid', description: 'ID da tabela associada' },
          colunaId: { type: 'string', format: 'uuid', description: 'ID da coluna associada' }
        }
      },
      response: {
        200: listaReferenciaResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, controller.update.bind(controller))

  // DELETE /listas-referencia/:id - Excluir lista de referência
  fastify.delete('/:id', {
    schema: {
      summary: 'Excluir lista de referência',
      description: 'Remove uma lista de referência do sistema',
      tags: ['Listas de Referência'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da lista de referência' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' }
              }
            }
          }
        },
        404: {
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
