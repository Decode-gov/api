import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class RegraQualidadeController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regraQualidade')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any
      const where: any = {}
      if (query.dimensaoId) where.dimensaoId = query.dimensaoId
      if (query.tabelaId) where.tabelaId = query.tabelaId
      if (query.colunaId) where.colunaId = query.colunaId
      if (query.responsavelId) where.responsavelId = query.responsavelId
      const data = await this.prisma.regraQualidade.findMany({ skip, take, where, orderBy, include: { dimensao: { select: { id: true, nome: true, descricao: true, politicaId: true } }, tabela: { select: { id: true, nome: true } }, coluna: { select: { id: true, nome: true, descricao: true } }, responsavel: { select: { id: true, nome: true, email: true } } } })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const data = await this.prisma.regraQualidade.findUnique({ where: { id: validId }, include: { dimensao: { select: { id: true, nome: true, descricao: true, politicaId: true } }, tabela: { select: { id: true, nome: true } }, coluna: { select: { id: true, nome: true, descricao: true } }, responsavel: { select: { id: true, nome: true, email: true } } } })
      if (!data) return (reply as any).notFound('Regra de qualidade não encontrada')
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any
      const dimensao = await this.prisma.dimensaoQualidade.findUnique({ where: { id: body.dimensaoId } })
      if (!dimensao) return reply.status(400).send({ error: 'BadRequest', message: 'Dimensão de qualidade não encontrada' })
      const responsavel = await this.prisma.usuario.findUnique({ where: { id: body.responsavelId } })
      if (!responsavel) return reply.status(400).send({ error: 'BadRequest', message: 'Usuário responsável não encontrado' })
      if (body.tabelaId) {
        const tabela = await this.prisma.tabela.findUnique({ where: { id: body.tabelaId } })
        if (!tabela) return reply.status(400).send({ error: 'BadRequest', message: 'Tabela não encontrada' })
      }
      if (body.colunaId) {
        const coluna = await this.prisma.coluna.findUnique({ where: { id: body.colunaId } })
        if (!coluna) return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não encontrada' })
        if (body.tabelaId && coluna.tabelaId !== body.tabelaId) return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não pertence à tabela informada' })
      }
      const data = await this.prisma.regraQualidade.create({ data: body, include: { dimensao: { select: { id: true, nome: true, descricao: true, politicaId: true } }, tabela: { select: { id: true, nome: true } }, coluna: { select: { id: true, nome: true, descricao: true } }, responsavel: { select: { id: true, nome: true, email: true } } } })
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
      if (body.dimensaoId) {
        const dimensao = await this.prisma.dimensaoQualidade.findUnique({ where: { id: body.dimensaoId } })
        if (!dimensao) return reply.status(400).send({ error: 'BadRequest', message: 'Dimensão de qualidade não encontrada' })
      }
      if (body.responsavelId) {
        const responsavel = await this.prisma.usuario.findUnique({ where: { id: body.responsavelId } })
        if (!responsavel) return reply.status(400).send({ error: 'BadRequest', message: 'Usuário responsável não encontrado' })
      }
      if (body.tabelaId) {
        const tabela = await this.prisma.tabela.findUnique({ where: { id: body.tabelaId } })
        if (!tabela) return reply.status(400).send({ error: 'BadRequest', message: 'Tabela não encontrada' })
      }
      if (body.colunaId) {
        const coluna = await this.prisma.coluna.findUnique({ where: { id: body.colunaId } })
        if (!coluna) return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não encontrada' })
        if (body.tabelaId && coluna.tabelaId !== body.tabelaId) return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não pertence à tabela informada' })
      }
      const data = await this.prisma.regraQualidade.update({ where: { id: validId }, data: body, include: { dimensao: { select: { id: true, nome: true, descricao: true, politicaId: true } }, tabela: { select: { id: true, nome: true } }, coluna: { select: { id: true, nome: true, descricao: true } }, responsavel: { select: { id: true, nome: true, email: true } } } })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      await this.prisma.regraQualidade.delete({ where: { id: validId } })
      return { message: 'Regra de qualidade deletada com sucesso' }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
