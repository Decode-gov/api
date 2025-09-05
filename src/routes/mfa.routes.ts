import type { FastifyInstance } from 'fastify'
import { MfaController } from '../controllers/mfa.controller.js'

export async function mfaRoutes(fastify: FastifyInstance) {
  const controller = new MfaController(fastify.prisma)

  // GET /mfa - Listar configurações MFA
  fastify.get('/', {
    schema: {
      description: 'Listar configurações de MFA',
      tags: ['MFA/2FA'],
      summary: 'Listar configurações MFA',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0 },
          take: { type: 'number', minimum: 1, maximum: 100 },
          usuarioId: { type: 'string', format: 'uuid' },
          tipo: { type: 'string', enum: ['SMS', 'EMAIL', 'TOTP'] },
          ativo: { type: 'boolean' }
        }
      },
      response: {
        200: {
          description: 'Lista de configurações MFA',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  usuarioId: { type: 'string', format: 'uuid' },
                  tipo: { type: 'string', enum: ['SMS', 'EMAIL', 'TOTP'] },
                  ativo: { type: 'boolean' },
                  telefone: { type: 'string' },
                  email: { type: 'string' },
                  ativadoEm: { type: 'string', format: 'date-time' },
                  ultimaVerificacao: { type: 'string', format: 'date-time' }
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

  // GET /mfa/:id - Buscar configuração MFA por ID
  fastify.get('/:id', {
    schema: {
      description: 'Buscar configuração MFA por ID',
      tags: ['MFA/2FA'],
      summary: 'Buscar configuração MFA',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      response: {
        200: {
          description: 'Configuração MFA encontrada'
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request as any, reply)
  })

  // POST /mfa/setup - Configurar MFA
  fastify.post('/setup', {
    schema: {
      description: 'Configurar autenticação multi-fator para um usuário',
      tags: ['MFA/2FA'],
      summary: 'Configurar MFA',
      body: {
        type: 'object',
        properties: {
          usuarioId: { type: 'string', format: 'uuid', description: 'ID do usuário' },
          tipo: {
            type: 'string',
            enum: ['SMS', 'EMAIL', 'TOTP'],
            description: 'Tipo de MFA a configurar'
          },
          telefone: { type: 'string', description: 'Telefone para MFA por SMS' },
          email: { type: 'string', format: 'email', description: 'Email para MFA por email' },
          secretKey: { type: 'string', description: 'Secret key para TOTP (opcional)' }
        },
        required: ['usuarioId', 'tipo']
      },
      response: {
        201: {
          description: 'Configuração MFA iniciada com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                configuracaoId: { type: 'string', format: 'uuid' },
                tipo: { type: 'string' },
                codigo: { type: 'string', description: 'Código de verificação' },
                qrCodeData: { type: 'string', description: 'Dados para QR Code (apenas TOTP)' },
                secretKey: { type: 'string', description: 'Secret key (apenas TOTP)' },
                mensagem: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.setup(request as any, reply)
  })

  // POST /mfa/enable - Ativar MFA com código de verificação
  fastify.post('/enable', {
    schema: {
      description: 'Ativar MFA após verificação do código',
      tags: ['MFA/2FA'],
      summary: 'Ativar MFA',
      body: {
        type: 'object',
        properties: {
          usuarioId: { type: 'string', format: 'uuid', description: 'ID do usuário' },
          codigo: { type: 'string', description: 'Código de verificação recebido' }
        },
        required: ['usuarioId', 'codigo']
      },
      response: {
        200: {
          description: 'MFA ativado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                configuracao: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    tipo: { type: 'string' },
                    ativo: { type: 'boolean' },
                    ativadoEm: { type: 'string', format: 'date-time' }
                  }
                },
                codigosBackup: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Códigos de backup para emergência'
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.enable(request as any, reply)
  })

  // POST /mfa/verify - Verificar código MFA durante login
  fastify.post('/verify', {
    schema: {
      description: 'Verificar código MFA durante processo de login',
      tags: ['MFA/2FA'],
      summary: 'Verificar código MFA',
      body: {
        type: 'object',
        properties: {
          usuarioId: { type: 'string', format: 'uuid', description: 'ID do usuário' },
          codigo: { type: 'string', description: 'Código MFA fornecido pelo usuário' },
          tipo: {
            type: 'string',
            enum: ['SMS', 'EMAIL', 'TOTP'],
            description: 'Tipo de MFA sendo verificado'
          }
        },
        required: ['usuarioId', 'codigo', 'tipo']
      },
      response: {
        200: {
          description: 'Código MFA verificado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                verificado: { type: 'boolean' },
                tipo: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.verify(request as any, reply)
  })

  // PUT /mfa/:id/disable - Desativar MFA
  fastify.put('/:id/disable', {
    schema: {
      description: 'Desativar configuração MFA',
      tags: ['MFA/2FA'],
      summary: 'Desativar MFA',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'ID da configuração MFA' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          codigo: { type: 'string', description: 'Código de verificação para desativação' }
        },
        required: ['codigo']
      },
      response: {
        200: {
          description: 'MFA desativado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                ativo: { type: 'boolean' },
                desativadoEm: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return controller.disable(request as any, reply)
  })
}
