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
        }
      })

      reply.send({
        message: 'Comunidades encontradas',
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

      const data = await this.prisma.comunidade.findUnique({
        where: { id: validId },
        include: {
          parent: true,
          children: true,
        }
      })

      if (!data) {
        return (reply as any).notFound('Comunidade não encontrada')
      }

      reply.send({
        message: 'Comunidade encontrada',
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

      const data = await this.prisma.comunidade.create({
        data: body,
        include: {
          parent: true,
          children: true
        }
      })

      reply.status(201).send({
        message: 'Comunidade criada com sucesso',
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

      const data = await this.prisma.comunidade.update({
        where: { id: validId },
        data: body,
        include: {
          parent: true,
          children: true
        }
      })

      reply.send({
        message: 'Comunidade atualizada com sucesso',
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

      const data = await this.prisma.comunidade.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Comunidade excluída com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
