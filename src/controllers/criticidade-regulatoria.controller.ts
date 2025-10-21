import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class CriticidadeRegulatoriaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'criticidadeRegulatoria')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any
      const where: any = {}
      if (query.regulacaoId) where.regulacaoId = query.regulacaoId
      if (query.regraQualidadeId) where.regraQualidadeId = query.regraQualidadeId
      const data = await this.prisma.criticidadeRegulatoria.findMany({ skip, take, where, orderBy, include: { regulacao: { select: { id: true, epigrafe: true, orgao: true, descricao: true } }, regraQualidade: { select: { id: true, descricao: true, dimensao: { select: { id: true, nome: true } } } } } })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const data = await this.prisma.criticidadeRegulatoria.findUnique({ where: { id: validId }, include: { regulacao: { select: { id: true, epigrafe: true, orgao: true, descricao: true } }, regraQualidade: { select: { id: true, descricao: true, dimensao: { select: { id: true, nome: true } } } } } })
      if (!data) return (reply as any).notFound('Criticidade regulatória não encontrada')
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any
      const regulacao = await this.prisma.regulacaoCompleta.findUnique({ where: { id: body.regulacaoId } })
      if (!regulacao) return reply.status(400).send({ error: 'BadRequest', message: 'Regulação não encontrada' })
      const regraQualidade = await this.prisma.regraQualidade.findUnique({ where: { id: body.regraQualidadeId } })
      if (!regraQualidade) return reply.status(400).send({ error: 'BadRequest', message: 'Regra de qualidade não encontrada' })
      const existente = await this.prisma.criticidadeRegulatoria.findFirst({ where: { regulacaoId: body.regulacaoId, regraQualidadeId: body.regraQualidadeId } })
      if (existente) return reply.status(400).send({ error: 'BadRequest', message: 'Já existe uma criticidade regulatória para esta combinação de regulação e regra de qualidade' })
      const data = await this.prisma.criticidadeRegulatoria.create({ data: body, include: { regulacao: { select: { id: true, epigrafe: true, orgao: true, descricao: true } }, regraQualidade: { select: { id: true, descricao: true, dimensao: { select: { id: true, nome: true } } } } } })
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
      if (body.regulacaoId) {
        const regulacao = await this.prisma.regulacaoCompleta.findUnique({ where: { id: body.regulacaoId } })
        if (!regulacao) return reply.status(400).send({ error: 'BadRequest', message: 'Regulação não encontrada' })
      }
      if (body.regraQualidadeId) {
        const regraQualidade = await this.prisma.regraQualidade.findUnique({ where: { id: body.regraQualidadeId } })
        if (!regraQualidade) return reply.status(400).send({ error: 'BadRequest', message: 'Regra de qualidade não encontrada' })
      }
      if (body.regulacaoId || body.regraQualidadeId) {
        const criticidadeAtual = await this.prisma.criticidadeRegulatoria.findUnique({ where: { id: validId } })
        const regulacaoIdFinal = body.regulacaoId || criticidadeAtual?.regulacaoId
        const regraQualidadeIdFinal = body.regraQualidadeId || criticidadeAtual?.regraQualidadeId
        const existente = await this.prisma.criticidadeRegulatoria.findFirst({ where: { regulacaoId: regulacaoIdFinal, regraQualidadeId: regraQualidadeIdFinal, NOT: { id: validId } } })
        if (existente) return reply.status(400).send({ error: 'BadRequest', message: 'Já existe outra criticidade regulatória para esta combinação' })
      }
      const data = await this.prisma.criticidadeRegulatoria.update({ where: { id: validId }, data: body, include: { regulacao: { select: { id: true, epigrafe: true, orgao: true, descricao: true } }, regraQualidade: { select: { id: true, descricao: true, dimensao: { select: { id: true, nome: true } } } } } })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      await this.prisma.criticidadeRegulatoria.delete({ where: { id: validId } })
      return { message: 'Criticidade regulatória deletada com sucesso' }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
