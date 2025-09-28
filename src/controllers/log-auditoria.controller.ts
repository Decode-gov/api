import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface LogAuditoriaParams {
  id: string
}

interface LogAuditoriaQuery {
  skip?: number
  take?: number
  orderBy?: string
  entidade?: string
  entidadeId?: string
  operacao?: string
  usuarioId?: string
  dataInicio?: string
  dataFim?: string
}

interface LogAuditoriaBody {
  entidade: string
  entidadeId: string
  operacao: 'CREATE' | 'UPDATE' | 'DELETE'
  dadosAntes?: string
  dadosDepois?: string
  usuarioId: string
}

export class LogAuditoriaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'logAuditoria')
  }

  async findMany(request: FastifyRequest<{ Querystring: LogAuditoriaQuery }>, reply: FastifyReply) {
    try {
      const {
        skip = 0,
        take = 10,
        orderBy = 'timestamp',
        entidade,
        entidadeId,
        operacao,
        usuarioId,
        dataInicio,
        dataFim
      } = request.query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (entidade) where.entidade = entidade
      if (entidadeId) where.entidadeId = entidadeId
      if (operacao) where.operacao = operacao
      if (usuarioId) where.usuarioId = usuarioId

      // Filtros de data
      if (dataInicio || dataFim) {
        where.timestamp = {}
        if (dataInicio) {
          const dataInicioDate = new Date(dataInicio)
          if (!isNaN(dataInicioDate.getTime())) {
            where.timestamp.gte = dataInicioDate
          }
        }
        if (dataFim) {
          const dataFimDate = new Date(dataFim)
          if (!isNaN(dataFimDate.getTime())) {
            where.timestamp.lte = dataFimDate
          }
        }
      }

      const logs = await (this.prisma as any).logAuditoria.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'desc' },
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

      const total = await (this.prisma as any).logAuditoria.count({ where })

      return reply.status(200).send({
        message: 'Logs de auditoria encontrados',
        data: logs,
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

  async findById(request: FastifyRequest<{ Params: LogAuditoriaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const log = await (this.prisma as any).logAuditoria.findUnique({
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

      if (!log) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Log de auditoria não encontrado'
        })
      }

      // Parse dos dados JSON se existirem
      const logFormatted = {
        ...log,
        dadosAntes: log.dadosAntes ? JSON.parse(log.dadosAntes) : null,
        dadosDepois: log.dadosDepois ? JSON.parse(log.dadosDepois) : null
      }

      return reply.status(200).send({
        message: 'Log de auditoria encontrado',
        data: logFormatted
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: LogAuditoriaBody }>, reply: FastifyReply) {
    try {
      const { entidade, entidadeId, operacao, dadosAntes, dadosDepois, usuarioId } = request.body

      // Validar operação
      const operacoesValidas = ['CREATE', 'UPDATE', 'DELETE']
      if (!operacoesValidas.includes(operacao)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Operação deve ser uma das seguintes: ${operacoesValidas.join(', ')}`
        })
      }

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

      const log = await (this.prisma as any).logAuditoria.create({
        data: {
          entidade,
          entidadeId,
          operacao,
          dadosAntes,
          dadosDepois,
          usuarioId
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

      return reply.status(201).send({
        message: 'Log de auditoria criado com sucesso',
        data: log
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para não permitir update (logs de auditoria são imutáveis)
  async update(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Logs de auditoria não podem ser alterados'
    })
  }

  // Método para não permitir delete (logs de auditoria são permanentes)
  async delete(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Logs de auditoria não podem ser deletados'
    })
  }

  // Método para obter relatório de auditoria por entidade
  async relatorioEntidade(request: FastifyRequest<{ Params: { entidade: string; entidadeId: string } }>, reply: FastifyReply) {
    try {
      const { entidade, entidadeId } = request.params
      this.validateId(entidadeId)

      const logs = await (this.prisma as any).logAuditoria.findMany({
        where: {
          entidade,
          entidadeId
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          timestamp: 'asc'
        }
      })

      // Estatísticas
      const estatisticas = {
        totalOperacoes: logs.length,
        operacoesPorTipo: {
          CREATE: logs.filter((log: any) => log.operacao === 'CREATE').length,
          UPDATE: logs.filter((log: any) => log.operacao === 'UPDATE').length,
          DELETE: logs.filter((log: any) => log.operacao === 'DELETE').length
        },
        primeiraOperacao: logs.length > 0 ? logs[0].timestamp : null,
        ultimaOperacao: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
        usuariosEnvolvidos: [...new Set(logs.map((log: any) => log.usuario.nome))].length
      }

      return reply.status(200).send({
        message: 'Relatório de auditoria gerado',
        data: {
          entidade,
          entidadeId,
          estatisticas,
          logs: logs.map((log: any) => ({
            ...log,
            dadosAntes: log.dadosAntes ? JSON.parse(log.dadosAntes) : null,
            dadosDepois: log.dadosDepois ? JSON.parse(log.dadosDepois) : null
          }))
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para obter atividades recentes de um usuário
  async atividadesUsuario(request: FastifyRequest<{
    Params: { usuarioId: string }
    Querystring: { dias?: number; skip?: number; take?: number }
  }>, reply: FastifyReply) {
    try {
      const { usuarioId } = request.params
      const { dias = 30, skip = 0, take = 20 } = request.query

      this.validateId(usuarioId)
      this.validatePagination({ skip, take })

      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - dias)

      const logs = await (this.prisma as any).logAuditoria.findMany({
        skip,
        take,
        where: {
          usuarioId,
          timestamp: {
            gte: dataLimite
          }
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      })

      const estatisticas = {
        totalOperacoes: logs.length,
        operacoesPorTipo: {
          CREATE: logs.filter((log: any) => log.operacao === 'CREATE').length,
          UPDATE: logs.filter((log: any) => log.operacao === 'UPDATE').length,
          DELETE: logs.filter((log: any) => log.operacao === 'DELETE').length
        },
        entidadesAfetadas: [...new Set(logs.map((log: any) => log.entidade))],
        diasAnalisados: dias
      }

      return reply.status(200).send({
        message: 'Atividades do usuário encontradas',
        data: {
          usuarioId,
          estatisticas,
          logs
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método utilitário para criar log de auditoria (usado por outros controllers)
  static async criarLog(
    prisma: any,
    entidade: string,
    entidadeId: string,
    operacao: 'CREATE' | 'UPDATE' | 'DELETE',
    usuarioId: string,
    dadosAntes?: any,
    dadosDepois?: any
  ) {
    try {
      await prisma.logAuditoria.create({
        data: {
          entidade,
          entidadeId,
          operacao,
          dadosAntes: dadosAntes ? JSON.stringify(dadosAntes) : null,
          dadosDepois: dadosDepois ? JSON.stringify(dadosDepois) : null,
          usuarioId
        }
      })
    } catch (error) {
      // Não propagar o erro para não afetar a operação principal
      // Erro silencioso na criação do log de auditoria
    }
  }
}
