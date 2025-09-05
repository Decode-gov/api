import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class TabelaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'tabela')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.tabela.findMany({
        skip,
        take,
        orderBy,
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true,
          colunas: true,
          _count: {
            select: {
              colunas: true,
              codificacoes: true
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

      const data = await this.prisma.tabela.findUnique({
        where: { id: validId },
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true,
          colunas: {
            include: {
              necessidadeInfo: true
            }
          },
          codificacoes: true
        }
      })

      if (!data) {
        return reply.notFound('Tabela não encontrada')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.tabela.create({
        data: body,
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true
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

      const data = await this.prisma.tabela.update({
        where: { id: validId },
        data: body,
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true
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

      const data = await this.prisma.tabela.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
