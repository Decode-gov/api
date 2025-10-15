import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class AtribuicaoPapelDominioController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'atribuicaoPapelDominio')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any

      // Filtros específicos
      const where: any = {}
      if (query.papelId) {
        where.papelId = query.papelId
      }
      if (query.dominioId) {
        where.dominioId = query.dominioId
      }
      if (query.tipoEntidade) {
        where.tipoEntidade = query.tipoEntidade
      }

      const data = await this.prisma.atribuicaoPapelDominio.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          papel: true,
          dominio: true
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

      const data = await this.prisma.atribuicaoPapelDominio.findUnique({
        where: { id: validId },
        include: {
          papel: true,
          dominio: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Atribuição de papel-domínio não encontrada')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.atribuicaoPapelDominio.create({
        data: body,
        include: {
          papel: true,
          dominio: true
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

      const data = await this.prisma.atribuicaoPapelDominio.update({
        where: { id: validId },
        data: body,
        include: {
          papel: true,
          dominio: true
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

      const data = await this.prisma.atribuicaoPapelDominio.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}