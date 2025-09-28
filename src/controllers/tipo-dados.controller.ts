import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class TipoDadosController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'tipoDados')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const { nome, categoria, permiteNulo } = request.query as any

      // Construir filtros dinâmicos
      const where: any = {}
      if (nome) {
        where.nome = {
          contains: nome,
          mode: 'insensitive'
        }
      }
      if (categoria) {
        where.categoria = categoria
      }
      if (permiteNulo !== undefined) {
        where.permiteNulo = permiteNulo
      }

      const data = await this.prisma.tipoDados.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          colunas: {
            select: {
              id: true,
              nome: true,
              tabelaId: true
            }
          }
        }
      })

      reply.send({
        message: 'Tipos de dados encontrados',
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

      const data = await this.prisma.tipoDados.findUnique({
        where: { id: validId },
        include: {
          colunas: {
            select: {
              id: true,
              nome: true,
              tabelaId: true
            }
          }
        }
      })

      if (!data) {
        return (reply as any).notFound('Tipo de dados não encontrado')
      }

      reply.send({
        message: 'Tipo de dados encontrado',
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

      const data = await this.prisma.tipoDados.create({
        data: body,
        include: {
          colunas: {
            select: {
              id: true,
              nome: true,
              tabelaId: true
            }
          }
        }
      })

      reply.code(201).send({
        message: 'Tipo de dados criado com sucesso',
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

      const data = await this.prisma.tipoDados.update({
        where: { id: validId },
        data: body,
        include: {
          colunas: {
            select: {
              id: true,
              nome: true,
              tabelaId: true
            }
          }
        }
      })

      reply.send({
        message: 'Tipo de dados atualizado com sucesso',
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

      const data = await this.prisma.tipoDados.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Tipo de dados excluído com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
