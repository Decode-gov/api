import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class ProdutoDadosController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'produtoDados')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.produtoDados.findMany({
        skip,
        take,
        orderBy
      })

      reply.send({
        message: 'Produtos de dados encontrados',
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

      const data = await this.prisma.produtoDados.findUnique({
        where: { id: validId }
      })

      if (!data) {
        return (reply as any).notFound('Produto de dados não encontrado')
      }

      reply.send({
        message: 'Produto de dados encontrado',
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

      const data = await this.prisma.produtoDados.create({
        data: body
      })

      reply.status(201).send({
        message: 'Produto de dados criado com sucesso',
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

      const data = await this.prisma.produtoDados.update({
        where: { id: validId },
        data: body
      })

      reply.send({
        message: 'Produto de dados atualizado com sucesso',
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

      const data = await this.prisma.produtoDados.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Produto de dados excluído com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}