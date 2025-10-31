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
      if (query.comiteAprovadorId) {
        where.comiteAprovadorId = query.comiteAprovadorId
      }
      if (query.onboarding !== undefined) {
        where.onboarding = query.onboarding
      }

      const data = await this.prisma.atribuicaoPapelDominio.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          papel: true,
          dominio: true,
          comiteAprovador: true
        }
      })

      return reply.send({
        message: 'Atribuições encontradas',
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

      const data = await this.prisma.atribuicaoPapelDominio.findUnique({
        where: { id: validId },
        include: {
          papel: true,
          dominio: true,
          comiteAprovador: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Atribuição de papel-domínio não encontrada')
      }

      return reply.send({
        message: 'Atribuição encontrada',
        data
      })
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
          dominio: true,
          comiteAprovador: true
        }
      })

      return reply.status(201).send({
        message: 'Atribuição criada com sucesso',
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

      const data = await this.prisma.atribuicaoPapelDominio.update({
        where: { id: validId },
        data: body,
        include: {
          papel: true,
          dominio: true,
          comiteAprovador: true
        }
      })

      return reply.send({
        message: 'Atribuição atualizada com sucesso',
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

      const data = await this.prisma.atribuicaoPapelDominio.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Atribuição excluída com sucesso',
        data: {
          id: data.id,
          papelId: data.papelId,
          dominioId: data.dominioId
        }
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}