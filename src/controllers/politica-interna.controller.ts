import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'
import { PoliticaInternaParamsSchema } from '../schemas/politica-interna.js'

export class PoliticaInternaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'politicaInterna')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.politicaInterna.findMany({
        skip,
        take,
        orderBy,
        include: {
          dominioDados: true,
        }
      })

      return { message: 'Políticas internas listadas com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = await PoliticaInternaParamsSchema.parseAsync(request.params)
      const validId = this.validateId(id)

      const data = await this.prisma.politicaInterna.findUnique({
        where: { id: validId },
        include: {
          dominioDados: true,
          papeis: true,
          listaClassificacoes: true,
          listaDimensoes: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Política interna não encontrada')
      }

      return { message: 'Política interna encontrada com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.politicaInterna.create({
        data: body,
        include: {
          dominioDados: true
        }
      })

      reply.code(201)
      return { message: 'Política interna criada com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = await PoliticaInternaParamsSchema.parseAsync(request.params)
      const validId = this.validateId(id)
      const body = request.body as any

      const data = await this.prisma.politicaInterna.update({
        where: { id: validId },
        data: body,
        include: {
          dominioDados: true
        }
      })

      return { message: 'Política interna atualizada com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = await PoliticaInternaParamsSchema.parseAsync(request.params)
      const validId = this.validateId(id)

      const data = await this.prisma.politicaInterna.delete({
        where: { id: validId }
      })

      return { message: 'Política interna excluída com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
