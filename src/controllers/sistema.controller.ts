import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class SistemaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'sistema')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.sistema.findMany({
        skip,
        take,
        orderBy,
        include: {
          tabelas: true,
          _count: {
            select: {
              tabelas: true
            }
          }
        }
      })

      reply.send({
        message: 'Sistemas encontrados',
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

      const data = await this.prisma.sistema.findUnique({
        where: { id: validId },
        include: {
          tabelas: {
            include: {
              banco: true,
              colunas: true
            }
          }
        }
      })

      if (!data) {
        return reply.status(404).send({
          error: 'Sistema não encontrado'
        })
      }

      reply.send({
        message: 'Sistema encontrado',
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

      const data = await this.prisma.sistema.create({
        data: body
      })

      reply.status(201).send({
        message: 'Sistema criado com sucesso',
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

      const data = await this.prisma.sistema.update({
        where: { id: validId },
        data: body
      })

      reply.send({
        message: 'Sistema atualizado com sucesso',
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

      const data = await this.prisma.sistema.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Sistema excluído com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
