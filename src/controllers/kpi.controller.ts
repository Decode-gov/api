import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class KpiController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'kPI')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.kPI.findMany({
        skip,
        take,
        orderBy,
        include: {
          comunidade: true,
          processo: true
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

      const data = await this.prisma.kPI.findUnique({
        where: { id: validId },
        include: {
          comunidade: true,
          processo: true
        }
      })

      if (!data) {
        return reply.notFound('KPI não encontrado')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      // Validar que o KPI deve estar associado a um processo
      if (!body.processoId) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'KPI deve estar associado a um processo'
        })
      }

      // Validar se processo existe
      const processo = await this.prisma.processo.findUnique({
        where: { id: body.processoId }
      })
      if (!processo) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Processo não encontrado'
        })
      }

      // Validar se comunidade existe (se fornecida)
      if (body.comunidadeId) {
        const comunidade = await this.prisma.comunidade.findUnique({
          where: { id: body.comunidadeId }
        })
        if (!comunidade) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Comunidade não encontrada'
          })
        }
      }

      const data = await this.prisma.kPI.create({
        data: body,
        include: {
          comunidade: true,
          processo: true
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

      const data = await this.prisma.kPI.update({
        where: { id: validId },
        data: body,
        include: {
          comunidade: true,
          processo: true
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

      const data = await this.prisma.kPI.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
