import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class ListaClassificacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'listaClassificacao')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.listaClassificacao.findMany({
        skip,
        take,
        orderBy,
        include: {
          politica: true
        }
      })

      reply.send({
        message: 'Listas de classificação encontradas',
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

      const data = await this.prisma.listaClassificacao.findUnique({
        where: { id: validId },
        include: {
          politica: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Lista de Classificação não encontrada')
      }

      reply.send({
        message: 'Lista de classificação encontrada',
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

      const data = await this.prisma.listaClassificacao.create({
        data: body,
        include: {
          politica: true
        }
      })

      reply.status(201).send({
        message: 'Lista de classificação criada com sucesso',
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

      const data = await this.prisma.listaClassificacao.update({
        where: { id: validId },
        data: body,
        include: {
          politica: true
        }
      })

      reply.send({
        message: 'Lista de classificação atualizada com sucesso',
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

      const data = await this.prisma.listaClassificacao.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Lista de classificação excluída com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
