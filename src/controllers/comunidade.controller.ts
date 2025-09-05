import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class ComunidadeController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'comunidade')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.comunidade.findMany({
        skip,
        take,
        orderBy,
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              papeis: true,
              kpis: true
            }
          }
        }
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

      const data = await this.prisma.comunidade.findUnique({
        where: { id: validId },
        include: {
          parent: true,
          children: true,
          papeis: true,
          kpis: true
        }
      })

      if (!data) {
        return reply.notFound('Comunidade não encontrada')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.comunidade.create({
        data: body,
        include: {
          parent: true,
          children: true
        }
      })

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

      const data = await this.prisma.comunidade.update({
        where: { id: validId },
        data: body,
        include: {
          parent: true,
          children: true
        }
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

      const data = await this.prisma.comunidade.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
