import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class ComiteAprovadorController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'comiteAprovador')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.comiteAprovador.findMany({
        skip,
        take,
        orderBy
      })

      return reply.send({
        message: 'Comitês aprovadores encontrados',
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

      const data = await this.prisma.comiteAprovador.findUnique({
        where: { id: validId }
      })

      if (!data) {
        return (reply as any).notFound('Comitê aprovador não encontrado')
      }

      return reply.send({
        message: 'Comitê aprovador encontrado',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.comiteAprovador.create({
        data: body
      })

      return reply.status(201).send({
        message: 'Comitê aprovador criado com sucesso',
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

      const data = await this.prisma.comiteAprovador.update({
        where: { id: validId },
        data: body
      })

      return reply.send({
        message: 'Comitê aprovador atualizado com sucesso',
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

      const data = await this.prisma.comiteAprovador.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Comitê aprovador excluído com sucesso',
        data: {
          id: data.id,
          nome: data.nome
        }
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
