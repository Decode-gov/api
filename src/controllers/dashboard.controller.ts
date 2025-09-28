import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'

interface DashboardQuery {
  periodo?: 'semana' | 'mes' | 'trimestre' | 'ano'
  usuarioId?: string
}

interface MetricasGerais {
  totalUsuarios: number
  totalSistemas: number
  totalProcessos: number
  totalTabelas: number
  totalColunas: number
  totalTermos: number
  totalPoliticas: number
  totalComunidades: number
}

export class DashboardController {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async obterMetricasGerais(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const metricas: MetricasGerais = {
        totalUsuarios: await this.prisma.usuario.count(),
        totalSistemas: await this.prisma.sistema.count(),
        totalProcessos: await this.prisma.processo.count(),
        totalTabelas: await this.prisma.tabela.count(),
        totalColunas: await this.prisma.coluna.count(),
        totalTermos: await this.prisma.termoClassificacao.count(),
        totalPoliticas: await this.prisma.politicaInterna.count(),
        totalComunidades: await this.prisma.comunidade.count()
      }

      reply.status(200).send({
        message: 'Métricas gerais obtidas com sucesso',
        data: metricas
      })
    } catch (error) {
      reply.status(500).send({
        error: 'InternalServerError',
        message: 'Erro interno do servidor'
      })
    }
  }

  async obterDashboardUsuario(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { usuarioId } = request.query as DashboardQuery

      if (!usuarioId) {
        return reply.status(400).send({
          error: 'ValidationError',
          message: 'ID do usuário é obrigatório'
        })
      }

      // Métricas básicas para o usuário
      const metricas = {
        totalSistemas: await this.prisma.sistema.count(),
        totalProcessos: await this.prisma.processo.count(),
        totalComunidades: await this.prisma.comunidade.count()
      }

      reply.status(200).send({
        message: 'Dashboard do usuário obtido com sucesso',
        data: {
          metricas,
          usuario: { id: usuarioId }
        }
      })
    } catch (error) {
      reply.status(500).send({
        error: 'InternalServerError',
        message: 'Erro interno do servidor'
      })
    }
  }
}
