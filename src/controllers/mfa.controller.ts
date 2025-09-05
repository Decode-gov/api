import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'
import * as crypto from 'crypto'

interface MfaParams {
  id: string
}

interface MfaQuery {
  skip?: number
  take?: number
  usuarioId?: string
  tipo?: string
  ativo?: boolean
}

interface MfaSetupBody {
  usuarioId: string
  tipo: 'SMS' | 'EMAIL' | 'TOTP'
  telefone?: string
  email?: string
  secretKey?: string
}

interface MfaVerifyBody {
  usuarioId: string
  codigo: string
  tipo: 'SMS' | 'EMAIL' | 'TOTP'
}

interface MfaEnableBody {
  usuarioId: string
  codigo: string
}

export class MfaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'mfa')
  }

  async findMany(request: FastifyRequest<{ Querystring: MfaQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, usuarioId, tipo, ativo } = request.query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (usuarioId) where.usuarioId = usuarioId
      if (tipo) where.tipo = tipo
      if (ativo !== undefined) where.ativo = ativo

      const configuracoesMfa = await (this.prisma as any).configuracaoMfa.findMany({
        skip,
        take,
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Remover dados sensíveis
      const configuracoesSanitizadas = configuracoesMfa.map((config: any) => ({
        ...config,
        secretKey: config.secretKey ? '***OCULTO***' : null,
        telefone: config.telefone ? config.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '$1*****$3') : null
      }))

      const total = await (this.prisma as any).configuracaoMfa.count({ where })

      return reply.status(200).send({
        message: 'Configurações MFA encontradas',
        data: configuracoesSanitizadas,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take)
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: MfaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const configuracao = await (this.prisma as any).configuracaoMfa.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      })

      if (!configuracao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Configuração MFA não encontrada'
        })
      }

      // Sanitizar dados sensíveis
      const configuracaoSanitizada = {
        ...configuracao,
        secretKey: configuracao.secretKey ? '***OCULTO***' : null,
        telefone: configuracao.telefone
          ? configuracao.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '$1*****$3')
          : null
      }

      return reply.status(200).send({
        message: 'Configuração MFA encontrada',
        data: configuracaoSanitizada
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Iniciar configuração MFA
  async setup(request: FastifyRequest<{ Body: MfaSetupBody }>, reply: FastifyReply) {
    try {
      const { usuarioId, tipo, telefone, email, secretKey } = request.body

      // Validar se o usuário existe
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId }
      })

      if (!usuario) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Usuário não encontrado'
        })
      }

      // Validar tipo de MFA
      const tiposValidos = ['SMS', 'EMAIL', 'TOTP']
      if (!tiposValidos.includes(tipo)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Tipo de MFA deve ser um dos seguintes: ${tiposValidos.join(', ')}`
        })
      }

      // Validações específicas por tipo
      if (tipo === 'SMS' && !telefone) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Telefone é obrigatório para MFA por SMS'
        })
      }

      if (tipo === 'EMAIL' && !email) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Email é obrigatório para MFA por EMAIL'
        })
      }

      // Verificar se já existe configuração ativa para este usuário e tipo
      const configuracaoExistente = await (this.prisma as any).configuracaoMfa.findFirst({
        where: {
          usuarioId,
          tipo,
          ativo: true
        }
      })

      if (configuracaoExistente) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Já existe uma configuração MFA ativa do tipo ${tipo} para este usuário`
        })
      }

      // Gerar dados específicos para cada tipo
      let dadosConfiguracao: any = {
        usuarioId,
        tipo,
        ativo: false, // Sempre inicia como inativo até verificação
        telefone,
        email
      }

      if (tipo === 'TOTP') {
        // Gerar secret key para TOTP se não fornecida
        dadosConfiguracao.secretKey = secretKey || this.gerarSecretKey()
      }

      // Criar configuração
      const novaConfiguracao = await (this.prisma as any).configuracaoMfa.create({
        data: dadosConfiguracao,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      })

      // Gerar código de verificação
      const codigoVerificacao = this.gerarCodigoVerificacao()
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Expira em 10 minutos

      await (this.prisma as any).codigoMfa.create({
        data: {
          configuracaoMfaId: novaConfiguracao.id,
          codigo: codigoVerificacao,
          tipo: 'SETUP',
          expiresAt,
          usado: false
        }
      })

      // Enviar código (simulado - em produção enviaria SMS/Email real)
      let mensagemEnvio = ''
      if (tipo === 'SMS') {
        mensagemEnvio = `Código enviado via SMS para ${telefone}`
        // Aqui integraria com provedor de SMS
      } else if (tipo === 'EMAIL') {
        mensagemEnvio = `Código enviado via email para ${email}`
        // Aqui integraria com provedor de email
      } else if (tipo === 'TOTP') {
        // Para TOTP, retornar QR Code data
        const qrCodeData = this.gerarQRCodeData(usuario.email, dadosConfiguracao.secretKey)
        mensagemEnvio = 'Configure seu aplicativo autenticador com o QR Code fornecido'

        return reply.status(201).send({
          message: 'Configuração MFA iniciada',
          data: {
            configuracaoId: novaConfiguracao.id,
            tipo,
            qrCodeData,
            secretKey: dadosConfiguracao.secretKey,
            codigo: codigoVerificacao, // Para validação inicial
            mensagem: mensagemEnvio
          }
        })
      }

      // Log de auditoria
      await (this.prisma as any).logAuditoria.create({
        data: {
          entidade: 'ConfiguracaoMfa',
          entidadeId: novaConfiguracao.id,
          operacao: 'CREATE',
          dadosDepois: JSON.stringify({
            tipo,
            usuarioId,
            acao: 'setup_iniciado'
          }),
          usuarioId
        }
      })

      return reply.status(201).send({
        message: 'Configuração MFA iniciada',
        data: {
          configuracaoId: novaConfiguracao.id,
          tipo,
          codigo: codigoVerificacao, // Em produção, não retornaria o código
          mensagem: mensagemEnvio
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Verificar código e ativar MFA
  async enable(request: FastifyRequest<{ Body: MfaEnableBody }>, reply: FastifyReply) {
    try {
      const { usuarioId, codigo } = request.body

      // Buscar código válido
      const codigoValido = await (this.prisma as any).codigoMfa.findFirst({
        where: {
          codigo,
          usado: false,
          expiresAt: { gt: new Date() },
          configuracaoMfa: {
            usuarioId
          }
        },
        include: {
          configuracaoMfa: true
        }
      })

      if (!codigoValido) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Código inválido ou expirado'
        })
      }

      // Marcar código como usado
      await (this.prisma as any).codigoMfa.update({
        where: { id: codigoValido.id },
        data: { usado: true }
      })

      // Ativar configuração MFA
      const configuracaoAtivada = await (this.prisma as any).configuracaoMfa.update({
        where: { id: codigoValido.configuracaoMfaId },
        data: {
          ativo: true,
          ativadoEm: new Date()
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      })

      // Gerar códigos de backup
      const codigosBackup = this.gerarCodigosBackup()

      await Promise.all(
        codigosBackup.map(async (codigoBackup) => {
          await (this.prisma as any).codigoMfa.create({
            data: {
              configuracaoMfaId: configuracaoAtivada.id,
              codigo: codigoBackup,
              tipo: 'BACKUP',
              usado: false
            }
          })
        })
      )

      // Log de auditoria
      await (this.prisma as any).logAuditoria.create({
        data: {
          entidade: 'ConfiguracaoMfa',
          entidadeId: configuracaoAtivada.id,
          operacao: 'UPDATE',
          dadosDepois: JSON.stringify({
            ativado: true,
            tipo: configuracaoAtivada.tipo
          }),
          usuarioId
        }
      })

      return reply.status(200).send({
        message: 'MFA ativado com sucesso',
        data: {
          configuracao: {
            id: configuracaoAtivada.id,
            tipo: configuracaoAtivada.tipo,
            ativo: true,
            ativadoEm: configuracaoAtivada.ativadoEm
          },
          codigosBackup // Mostrar apenas uma vez
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Verificar código MFA durante login
  async verify(request: FastifyRequest<{ Body: MfaVerifyBody }>, reply: FastifyReply) {
    try {
      const { usuarioId, codigo, tipo } = request.body

      // Buscar configuração ativa
      const configuracao = await (this.prisma as any).configuracaoMfa.findFirst({
        where: {
          usuarioId,
          tipo,
          ativo: true
        }
      })

      if (!configuracao) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Configuração MFA não encontrada ou inativa'
        })
      }

      let codigoValido = false

      if (tipo === 'TOTP') {
        // Verificar código TOTP
        codigoValido = this.verificarCodigoTOTP(codigo, configuracao.secretKey)
      } else {
        // Verificar código SMS/Email ou backup
        const codigoDb = await (this.prisma as any).codigoMfa.findFirst({
          where: {
            configuracaoMfaId: configuracao.id,
            codigo,
            usado: false,
            OR: [
              { expiresAt: { gt: new Date() } }, // Códigos com expiração
              { tipo: 'BACKUP' } // Códigos de backup não expiram
            ]
          }
        })

        if (codigoDb) {
          codigoValido = true

          // Marcar código como usado
          await (this.prisma as any).codigoMfa.update({
            where: { id: codigoDb.id },
            data: { usado: true }
          })
        }
      }

      if (!codigoValido) {
        // Log de tentativa falhada
        await (this.prisma as any).logAuditoria.create({
          data: {
            entidade: 'VerificacaoMfa',
            entidadeId: configuracao.id,
            operacao: 'CREATE',
            dadosDepois: JSON.stringify({
              sucesso: false,
              tipo,
              timestamp: new Date()
            }),
            usuarioId
          }
        })

        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Código MFA inválido'
        })
      }

      // Atualizar última verificação
      await (this.prisma as any).configuracaoMfa.update({
        where: { id: configuracao.id },
        data: { ultimaVerificacao: new Date() }
      })

      // Log de verificação bem-sucedida
      await (this.prisma as any).logAuditoria.create({
        data: {
          entidade: 'VerificacaoMfa',
          entidadeId: configuracao.id,
          operacao: 'CREATE',
          dadosDepois: JSON.stringify({
            sucesso: true,
            tipo,
            timestamp: new Date()
          }),
          usuarioId
        }
      })

      return reply.status(200).send({
        message: 'Código MFA verificado com sucesso',
        data: {
          verificado: true,
          tipo,
          timestamp: new Date()
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Desativar MFA
  async disable(request: FastifyRequest<{ Params: MfaParams; Body: { codigo: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { codigo } = request.body

      this.validateId(id)

      const configuracao = await (this.prisma as any).configuracaoMfa.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      })

      if (!configuracao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Configuração MFA não encontrada'
        })
      }

      if (!configuracao.ativo) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Configuração MFA já está inativa'
        })
      }

      // Verificar código antes de desativar
      const verifyRequest = {
        body: {
          usuarioId: configuracao.usuarioId,
          codigo,
          tipo: configuracao.tipo
        }
      } as any

      const verifyReply = {
        status: (code: number) => ({
          send: (data: any) => {
            if (code !== 200) {
              throw new Error('Código inválido para desativação')
            }
          }
        })
      } as any

      await this.verify(verifyRequest, verifyReply)

      // Desativar configuração
      const configuracaoDesativada = await (this.prisma as any).configuracaoMfa.update({
        where: { id },
        data: {
          ativo: false,
          desativadoEm: new Date()
        }
      })

      // Invalidar todos os códigos não usados
      await (this.prisma as any).codigoMfa.updateMany({
        where: {
          configuracaoMfaId: id,
          usado: false
        },
        data: { usado: true }
      })

      // Log de auditoria
      await (this.prisma as any).logAuditoria.create({
        data: {
          entidade: 'ConfiguracaoMfa',
          entidadeId: id,
          operacao: 'UPDATE',
          dadosAntes: JSON.stringify({ ativo: true }),
          dadosDepois: JSON.stringify({ ativo: false }),
          usuarioId: configuracao.usuarioId
        }
      })

      return reply.status(200).send({
        message: 'MFA desativado com sucesso',
        data: {
          id: configuracaoDesativada.id,
          ativo: false,
          desativadoEm: configuracaoDesativada.desativadoEm
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Métodos auxiliares
  private gerarSecretKey(): string {
    // Gera uma chave em hex e converte para base32-like
    return crypto.randomBytes(20).toString('hex').toUpperCase()
  }

  private gerarCodigoVerificacao(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private gerarCodigosBackup(): string[] {
    const codigos = []
    for (let i = 0; i < 8; i++) {
      const codigo = crypto.randomBytes(4).toString('hex').toUpperCase()
      codigos.push(codigo)
    }
    return codigos
  }

  private gerarQRCodeData(email: string, secretKey: string): string {
    // Formato padrão para TOTP QR Code
    const issuer = 'Governança de Dados'
    const accountName = email
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secretKey}&issuer=${encodeURIComponent(issuer)}`
  }

  private verificarCodigoTOTP(codigo: string, secretKey: string): boolean {
    // Implementação simplificada do TOTP
    // Em produção, usaria biblioteca especializada como 'speakeasy'
    const timeStep = Math.floor(Date.now() / 30000)
    const expectedCode = this.generateTOTP(secretKey, timeStep)

    // Verificar também time steps anteriores e posteriores (tolerância)
    const previousCode = this.generateTOTP(secretKey, timeStep - 1)
    const nextCode = this.generateTOTP(secretKey, timeStep + 1)

    return codigo === expectedCode || codigo === previousCode || codigo === nextCode
  }

  private generateTOTP(secretKey: string, timeStep: number): string {
    // Implementação básica do TOTP
    // Em produção, usar biblioteca apropriada
    const time = Buffer.alloc(8)
    time.writeUInt32BE(timeStep, 4)

    const hmac = crypto.createHmac('sha1', Buffer.from(secretKey, 'hex'))
    hmac.update(time)
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0x0f
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)

    const otp = binary % 1000000
    return otp.toString().padStart(6, '0')
  }

  // Métodos herdados não aplicáveis
  async create(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Use o endpoint /setup para configurar MFA'
    })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Use os endpoints específicos para gerenciar MFA'
    })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Use o endpoint /disable para desativar MFA'
    })
  }
}
