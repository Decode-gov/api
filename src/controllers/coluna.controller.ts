import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class ColunaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'coluna')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.coluna.findMany({
        skip,
        take,
        orderBy,
        include: {
          tabela: true,
          
          
          codificacoes: true
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

      const data = await this.prisma.coluna.findUnique({
        where: { id: validId },
        include: {
          tabela: true,
          
          
          codificacoes: true
        }
      })

      if (!data) {
        return reply.notFound('Coluna não encontrada')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.coluna.create({
        data: body,
        include: {
          tabela: true,
          
          
          codificacoes: true
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

      const data = await this.prisma.coluna.update({
        where: { id: validId },
        data: body,
        include: {
          tabela: true,
          
          
          codificacoes: true
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

      const data = await this.prisma.coluna.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
