import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class RegraNegocioController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regraNegocio')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.regraNegocio.findMany({
        skip,
        take,
        orderBy,
        include: {
          processo: true
        }
      })

      reply.send({
        message: 'Regras de negócio encontradas',
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

      const data = await this.prisma.regraNegocio.findUnique({
        where: { id: validId },
        include: {
          processo: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Regra de Negócio não encontrada')
      }

      reply.send({
        message: 'Regra de negócio encontrada',
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

      const data = await this.prisma.regraNegocio.create({
        data: body,
        include: {
          processo: true
        }
      })

      reply.status(201).send({
        message: 'Regra de negócio criada com sucesso',
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

      const data = await this.prisma.regraNegocio.update({
        where: { id: validId },
        data: body,
        include: {
          processo: true
        }
      })

      reply.send({
        message: 'Regra de negócio atualizada com sucesso',
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

      const data = await this.prisma.regraNegocio.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Regra de negócio excluída com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
