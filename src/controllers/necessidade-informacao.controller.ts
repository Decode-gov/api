import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'


export class NecessidadeInformacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'necessidadeInformacao')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any
      const skip = query.skip || 0
      const take = query.take || 10

      // Construir orderBy se fornecido
      let orderBy: any = undefined
      if (query.orderBy) {
        orderBy = { [query.orderBy]: 'asc' }
      }

      // Construir filtros
      const where: any = {}
      if (query.search) {
        where.questaoGerencial = {
          contains: query.search,
          mode: 'insensitive'
        }
      }

      const data = await this.prisma.necessidadeInformacao.findMany({
        skip,
        take,
        orderBy,
        where,
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true,
          tabelasQuestaoGerencial: true,
          colunasQuestaoGerencial: true
        }
      })

      reply.send({
        message: 'Necessidades de informação encontradas',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const data = await this.prisma.necessidadeInformacao.findUnique({
        where: { id },
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true,
          tabelasQuestaoGerencial: true,
          colunasQuestaoGerencial: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Necessidade de Informação não encontrada')
      }

      reply.send({
        message: 'Necessidade de informação encontrada',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.necessidadeInformacao.create({
        data: body,
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true
        }
      })

      reply.status(201).send({
        message: 'Necessidade de informação criada com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as any

      const data = await this.prisma.necessidadeInformacao.update({
        where: { id },
        data: body,
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true
        }
      })

      reply.send({
        message: 'Necessidade de informação atualizada com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }

      const data = await this.prisma.necessidadeInformacao.delete({
        where: { id }
      })

      reply.send({
        message: 'Necessidade de informação excluída com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
