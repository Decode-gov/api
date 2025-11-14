import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class RegulacaoCompletaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regulacaoCompleta')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any
      const where: any = {}
      if (query.orgao) where.orgao = { contains: query.orgao, mode: 'insensitive' }
      if (query.ativo !== undefined) {
        const hoje = new Date()
        if (query.ativo) {
          where.AND = [{ dataInicio: { lte: hoje } }, { OR: [{ dataFim: null }, { dataFim: { gte: hoje } }] }]
        } else {
          where.dataFim = { lt: hoje }
        }
      }
      const data = await this.prisma.regulacaoCompleta.findMany({ skip, take, where, orderBy, include: { criticidadesRegulatorias: { include: { regraQualidade: { select: { id: true, descricao: true, dimensao: { select: { id: true, nome: true } } } } } } } })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const data = await this.prisma.regulacaoCompleta.findUnique({ where: { id: validId }, include: { criticidadesRegulatorias: { include: { regraQualidade: { include: { dimensao: { select: { id: true, nome: true, politica: { select: { id: true, nome: true } } } }, tabela: { select: { id: true, nome: true } }, coluna: { select: { id: true, nome: true } }, responsavel: { select: { id: true, nome: true, descricao: true } } } } } } } })
      if (!data) return (reply as any).notFound('Regulação não encontrada')
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any
      const dataInicioDate = new Date(body.dataInicio)
      const dataFimDate = body.dataFim ? new Date(body.dataFim) : null
      if (isNaN(dataInicioDate.getTime())) return reply.status(400).send({ error: 'BadRequest', message: 'Data de início inválida' })
      if (dataFimDate && isNaN(dataFimDate.getTime())) return reply.status(400).send({ error: 'BadRequest', message: 'Data de fim inválida' })
      if (dataFimDate && dataFimDate <= dataInicioDate) return reply.status(400).send({ error: 'BadRequest', message: 'Data de fim deve ser posterior à data de início' })
      const data = await this.prisma.regulacaoCompleta.create({ data: { epigrafe: body.epigrafe, orgao: body.orgao, descricao: body.descricao, dataInicio: dataInicioDate, dataFim: dataFimDate } })
      reply.code(201)
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as any
      if (Object.keys(body).length === 0) return reply.status(400).send({ error: 'BadRequest', message: 'Nenhum campo fornecido para atualização' })
      const processedData: any = { ...body }
      if (body.dataInicio) {
        const dataInicioDate = new Date(body.dataInicio)
        if (isNaN(dataInicioDate.getTime())) return reply.status(400).send({ error: 'BadRequest', message: 'Data de início inválida' })
        processedData.dataInicio = dataInicioDate
      }
      if (body.dataFim) {
        const dataFimDate = new Date(body.dataFim)
        if (isNaN(dataFimDate.getTime())) return reply.status(400).send({ error: 'BadRequest', message: 'Data de fim inválida' })
        processedData.dataFim = dataFimDate
      }
      const regulacaoAtual = await this.prisma.regulacaoCompleta.findUnique({ where: { id: validId } })
      const dataInicioFinal = processedData.dataInicio || regulacaoAtual?.dataInicio
      const dataFimFinal = processedData.dataFim !== undefined ? processedData.dataFim : regulacaoAtual?.dataFim
      if (dataFimFinal && dataFimFinal <= dataInicioFinal) return reply.status(400).send({ error: 'BadRequest', message: 'Data de fim deve ser posterior à data de início' })
      const data = await this.prisma.regulacaoCompleta.update({ where: { id: validId }, data: processedData })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const criticidades = await this.prisma.criticidadeRegulatoria.findMany({ where: { regulacaoId: validId } })
      if (criticidades.length > 0) return reply.status(400).send({ error: 'BadRequest', message: 'Não é possível deletar regulação que possui criticidades regulatórias associadas' })
      await this.prisma.regulacaoCompleta.delete({ where: { id: validId } })
      return { message: 'Regulação deletada com sucesso' }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
