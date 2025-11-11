import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class PapelController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'papel')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.papel.findMany({
        skip,
        take,
        orderBy,
        include: {
          politica: true
        }
      })

      return reply.send({
        message: 'Papéis encontrados',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.papel.findUnique({
        where: { id: validId },
        include: {
          politica: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Papel não encontrado')
      }

      return reply.send({
        message: 'Papel encontrado',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.papel.create({
        data: body,
        include: {
          politica: true
        }
      })

      return reply.status(201).send({
        message: 'Papel criado com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as any

      const data = await this.prisma.papel.update({
        where: { id: validId },
        data: body,
        include: {
          politica: true
        }
      })

      return reply.send({
        message: 'Papel atualizado com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.papel.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Papel excluído com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
