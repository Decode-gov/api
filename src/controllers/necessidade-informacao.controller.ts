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

      const data = await this.prisma.necessidadeInformacao.findMany({
        skip,
        take,
        orderBy,
        include: {
          tabelas: true
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
      const validId = this.validateId(id)

      const data = await this.prisma.necessidadeInformacao.findUnique({
        where: { id: validId },
        include: {
          tabelas: true
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
          tabelas: true
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
      const validId = this.validateId(id)
      const body = request.body as any

      const data = await this.prisma.necessidadeInformacao.update({
        where: { id: validId },
        data: body,
        include: {
          tabelas: true
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
      const validId = this.validateId(id)

      const data = await this.prisma.necessidadeInformacao.delete({
        where: { id: validId }
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
