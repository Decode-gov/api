import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class ProcessoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'processo')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.processo.findMany({
        skip,
        take,
        orderBy,
        include: {
          regrasNegocio: true,
          kpis: true
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

      const data = await this.prisma.processo.findUniqueOrThrow({
        where: { id },
        include: {
          regrasNegocio: true,
          kpis: true
        }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { nome, descricao } = request.body as any

      const data = await this.prisma.processo.create({
        data: {
          nome,
          descricao
        },
        include: {
          regrasNegocio: true,
          kpis: true
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
      const { nome, descricao } = request.body as any

      const data = await this.prisma.processo.update({
        where: { id },
        data: {
          nome,
          descricao
        },
        include: {
          regrasNegocio: true,
          kpis: true
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

      const data = await this.prisma.processo.delete({
        where: { id }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
