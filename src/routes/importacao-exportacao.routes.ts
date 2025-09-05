import type { FastifyInstance } from 'fastify'
import { ImportacaoExportacaoController } from '../controllers/importacao-exportacao.controller.js'

export async function importacaoExportacaoRoutes(fastify: FastifyInstance) {
  const controller = new ImportacaoExportacaoController(fastify.prisma)

  // GET /importacao-exportacao - Listar operações
  fastify.get('/', {
    schema: {
      description: 'Listar operações de importação e exportação',
      tags: ['Importação/Exportação'],
      summary: 'Listar operações',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0 },
          take: { type: 'number', minimum: 1, maximum: 100 },
          tipo: { type: 'string', enum: ['IMPORTACAO', 'EXPORTACAO'] },
          status: { type: 'string', enum: ['PROCESSANDO', 'CONCLUIDO', 'CONCLUIDO_COM_ERROS', 'ERRO'] },
          usuarioId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Lista de operações de importação/exportação'
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request as any, reply)
  })

  // GET /importacao-exportacao/:id - Buscar operação por ID
  fastify.get('/:id', {
    schema: {
      description: 'Buscar operação de importação/exportação por ID',
      tags: ['Importação/Exportação'],
      summary: 'Buscar operação',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Operação encontrada'
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request as any, reply)
  })

  // POST /importacao-exportacao/exportar - Exportar dados
  fastify.post('/exportar', {
    schema: {
      description: 'Exportar dados do sistema em diferentes formatos',
      tags: ['Importação/Exportação'],
      summary: 'Exportar dados',
      querystring: {
        type: 'object',
        properties: {
          tipoEntidade: {
            type: 'string',
            description: 'Tipo de entidade para exportar',
            enum: [
              'usuario', 'sistema', 'processo', 'comunidade',
              'politica', 'tabela', 'coluna', 'termo',
              'tipoDados', 'classificacaoInformacao',
              'repositorioDocumento', 'dimensaoQualidade', 'regraQualidade',
              'parteEnvolvida', 'regulacaoCompleta', 'criticidadeRegulatoria'
            ]
          },
          formato: {
            type: 'string',
            enum: ['json', 'csv', 'excel'],
            description: 'Formato de exportação (padrão: json)'
          },
          filtros: {
            type: 'string',
            description: 'Filtros em formato JSON'
          }
        },
        required: ['tipoEntidade']
      },
      response: {
        200: {
          description: 'Dados exportados com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                tipoEntidade: { type: 'string' },
                formato: { type: 'string' },
                totalRegistros: { type: 'number' },
                arquivo: { type: 'string', description: 'Conteúdo do arquivo exportado' },
                logId: { type: 'string', format: 'uuid', description: 'ID do log de auditoria' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.exportar(request as any, reply)
  })

  // POST /importacao-exportacao/importar - Importar dados
  fastify.post('/importar', {
    schema: {
      description: 'Importar dados para o sistema',
      tags: ['Importação/Exportação'],
      summary: 'Importar dados',
      body: {
        type: 'object',
        properties: {
          arquivo: {
            type: 'string',
            description: 'Conteúdo do arquivo em formato JSON (array de objetos)'
          },
          tipoEntidade: {
            type: 'string',
            description: 'Tipo de entidade sendo importada',
            enum: [
              'usuario', 'sistema', 'processo', 'comunidade',
              'politica', 'tabela', 'coluna', 'termo',
              'tipoDados', 'classificacaoInformacao',
              'repositorioDocumento', 'dimensaoQualidade', 'regraQualidade',
              'parteEnvolvida', 'regulacaoCompleta', 'criticidadeRegulatoria'
            ]
          },
          sobrescrever: {
            type: 'boolean',
            description: 'Se deve sobrescrever registros existentes (padrão: false)'
          },
          usuarioId: {
            type: 'string',
            format: 'uuid',
            description: 'ID do usuário responsável pela importação'
          }
        },
        required: ['arquivo', 'tipoEntidade', 'usuarioId']
      },
      response: {
        200: {
          description: 'Importação processada',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                importacaoId: { type: 'string', format: 'uuid' },
                status: {
                  type: 'string',
                  enum: ['CONCLUIDO', 'CONCLUIDO_COM_ERROS']
                },
                totalRegistros: { type: 'number' },
                registrosProcessados: { type: 'number' },
                registrosComErro: { type: 'number' },
                erros: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      linha: { type: 'number' },
                      erro: { type: 'string' }
                    }
                  },
                  description: 'Primeiros 10 erros encontrados'
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.importar(request as any, reply)
  })
}
