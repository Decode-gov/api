import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'


export class NecessidadeInformacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'necessidadeInformacao')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any

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
      })

      return reply.send({ message: 'Necessidades de informação encontradas', data })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.necessidadeInformacao.findUnique({
        where: { id: validId },
      })

      if (!data) {
        return (reply as any).notFound('Necessidade de Informação não encontrada')
      }

      return reply.send({ message: 'Necessidade de informação encontrada', data })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.necessidadeInformacao.create({
        data: body,
      })

      return reply.send({ message: 'Necessidade de informação criada com sucesso', data })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as any

      const data = await this.prisma.necessidadeInformacao.update({
        where: { id: validId },
        data: body
      })

      return reply.send({ message: 'Necessidade de informação atualizada com sucesso', data })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.necessidadeInformacao.delete({
        where: { id: validId }
      })

      return reply.send({ message: 'Necessidade de informação excluída com sucesso', data })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
