import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class DefinicaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'definicao')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.definicao.findMany({
        skip,
        take,
        orderBy,
        include: {
          tabelas: true
        }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)

      const data = await this.prisma.definicao.findUniqueOrThrow({
        where: { id },
        include: {
          tabelas: true
        }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { termo, definicao, sigla } = request.body as any

      const data = await this.prisma.definicao.create({
        data: {
          termo,
          definicao,
          sigla
        },
        include: {
          tabelas: true
        }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)
      const { termo, definicao, sigla } = request.body as any

      const data = await this.prisma.definicao.update({
        where: { id },
        data: {
          termo,
          definicao,
          sigla
        },
        include: {
          tabelas: true
        }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)

      const data = await this.prisma.definicao.delete({
        where: { id }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
