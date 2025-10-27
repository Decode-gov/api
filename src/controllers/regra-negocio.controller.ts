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
      const query = request.query as any

      const where: any = {}
      if (query.processoId) {
        where.processoId = query.processoId
      }

      const data = await this.prisma.regraNegocio.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          processo: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          }
        }
      })

      return { message: 'Regras de negócio listadas com sucesso', data }
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
          processo: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          }
        }
      })

      if (!data) {
        return (reply as any).notFound('Regra de Negócio não encontrada')
      }

      return { message: 'Regra de negócio encontrada com sucesso', data }
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
          processo: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          }
        }
      })

      reply.code(201)
      return { message: 'Regra de negócio criada com sucesso', data }
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
          processo: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          }
        }
      })

      return { message: 'Regra de negócio atualizada com sucesso', data }
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

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
