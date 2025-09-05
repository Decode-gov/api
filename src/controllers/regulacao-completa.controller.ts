import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface RegulacaoCompletaParams {
  id: string
}

interface RegulacaoCompletaQuery {
  skip?: number
  take?: number
  orderBy?: string
  orgao?: string
  ativo?: boolean
}

interface RegulacaoCompletaBody {
  epigrafe: string
  orgao: string
  descricao: string
  dataInicio: string
  dataFim?: string
}

export class RegulacaoCompletaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regulacaoCompleta')
  }

  async findMany(request: FastifyRequest<{ Querystring: RegulacaoCompletaQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'epigrafe', orgao, ativo } = request.query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (orgao) {
        where.orgao = { contains: orgao, mode: 'insensitive' }
      }

      // Filtrar por regulações ativas/inativas baseado na data
      if (ativo !== undefined) {
        const hoje = new Date()
        if (ativo) {
          where.AND = [
            { dataInicio: { lte: hoje } },
            {
              OR: [
                { dataFim: null },
                { dataFim: { gte: hoje } }
              ]
            }
          ]
        } else {
          where.dataFim = { lt: hoje }
        }
      }

      const regulacoes = await (this.prisma as any).regulacaoCompleta.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          criticidadesRegulatorias: {
            include: {
              regraQualidade: {
                select: {
                  id: true,
                  descricao: true,
                  dimensao: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Regulações encontradas',
        data: regulacoes
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: RegulacaoCompletaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const regulacao = await (this.prisma as any).regulacaoCompleta.findUnique({
        where: { id },
        include: {
          criticidadesRegulatorias: {
            include: {
              regraQualidade: {
                include: {
                  dimensao: {
                    select: {
                      id: true,
                      nome: true,
                      politica: {
                        select: {
                          id: true,
                          nome: true
                        }
                      }
                    }
                  },
                  tabela: {
                    select: {
                      id: true,
                      nome: true
                    }
                  },
                  coluna: {
                    select: {
                      id: true,
                      nome: true
                    }
                  },
                  responsavel: {
                    select: {
                      id: true,
                      nome: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (!regulacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Regulação não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Regulação encontrada',
        data: regulacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: RegulacaoCompletaBody }>, reply: FastifyReply) {
    try {
      const { epigrafe, orgao, descricao, dataInicio, dataFim } = request.body

      // Validar datas
      const dataInicioDate = new Date(dataInicio)
      const dataFimDate = dataFim ? new Date(dataFim) : null

      if (isNaN(dataInicioDate.getTime())) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Data de início inválida'
        })
      }

      if (dataFimDate && isNaN(dataFimDate.getTime())) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Data de fim inválida'
        })
      }

      if (dataFimDate && dataFimDate <= dataInicioDate) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Data de fim deve ser posterior à data de início'
        })
      }

      const regulacao = await (this.prisma as any).regulacaoCompleta.create({
        data: {
          epigrafe,
          orgao,
          descricao,
          dataInicio: dataInicioDate,
          dataFim: dataFimDate
        }
      })

      return reply.status(201).send({
        message: 'Regulação criada com sucesso',
        data: regulacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: RegulacaoCompletaParams; Body: Partial<RegulacaoCompletaBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const updateData = { ...request.body }
      if (Object.keys(updateData).length === 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      // Validar datas se fornecidas
      const processedData: any = { ...updateData }

      if (updateData.dataInicio) {
        const dataInicioDate = new Date(updateData.dataInicio)
        if (isNaN(dataInicioDate.getTime())) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Data de início inválida'
          })
        }
        processedData.dataInicio = dataInicioDate
      }

      if (updateData.dataFim) {
        const dataFimDate = new Date(updateData.dataFim)
        if (isNaN(dataFimDate.getTime())) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Data de fim inválida'
          })
        }
        processedData.dataFim = dataFimDate
      }

      // Validar consistência das datas
      const regulacaoAtual = await (this.prisma as any).regulacaoCompleta.findUnique({
        where: { id }
      })

      const dataInicioFinal = processedData.dataInicio || regulacaoAtual.dataInicio
      const dataFimFinal = processedData.dataFim !== undefined ? processedData.dataFim : regulacaoAtual.dataFim

      if (dataFimFinal && dataFimFinal <= dataInicioFinal) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Data de fim deve ser posterior à data de início'
        })
      }

      const regulacao = await (this.prisma as any).regulacaoCompleta.update({
        where: { id },
        data: processedData
      })

      return reply.status(200).send({
        message: 'Regulação atualizada com sucesso',
        data: regulacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: RegulacaoCompletaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      // Verificar se há criticidades regulatórias associadas
      const criticidades = await (this.prisma as any).criticidadeRegulatoria.findMany({
        where: { regulacaoId: id }
      })

      if (criticidades.length > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Não é possível deletar regulação que possui criticidades regulatórias associadas'
        })
      }

      await (this.prisma as any).regulacaoCompleta.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Regulação deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para verificar status da regulação
  async verificarStatus(request: FastifyRequest<{ Params: RegulacaoCompletaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const regulacao = await (this.prisma as any).regulacaoCompleta.findUnique({
        where: { id }
      })

      if (!regulacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Regulação não encontrada'
        })
      }

      const hoje = new Date()
      let status: string

      if (regulacao.dataInicio > hoje) {
        status = 'Pendente'
      } else if (!regulacao.dataFim || regulacao.dataFim >= hoje) {
        status = 'Vigente'
      } else {
        status = 'Expirada'
      }

      return reply.status(200).send({
        message: 'Status da regulação verificado',
        data: {
          ...regulacao,
          status,
          diasParaVencimento: regulacao.dataFim
            ? Math.ceil((regulacao.dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
            : null
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
