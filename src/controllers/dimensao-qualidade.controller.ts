import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class DimensaoQualidadeController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'dimensaoQualidade')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any

      const where: any = {}
      if (query.politicaId) {
        where.politicaId = query.politicaId
      }

      const data = await this.prisma.dimensaoQualidade.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          regrasQualidade: {
            select: {
              id: true,
              descricao: true
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

      const data = await this.prisma.dimensaoQualidade.findUnique({
        where: { id: validId },
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          regrasQualidade: {
            select: {
              id: true,
              descricao: true
            }
          }
        }
      })

      if (!data) {
        return (reply as any).notFound('Dimensão de qualidade não encontrada')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.dimensaoQualidade.create({
        data: body,
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          regrasQualidade: {
            select: {
              id: true,
              descricao: true
            }
          }
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

      const data = await this.prisma.dimensaoQualidade.update({
        where: { id: validId },
        data: body,
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          regrasQualidade: {
            select: {
              id: true,
              descricao: true
            }
          }
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

      const data = await this.prisma.dimensaoQualidade.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
