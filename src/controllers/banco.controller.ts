import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class BancoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'banco')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.banco.findMany({
        skip,
        take,
        orderBy: typeof orderBy === 'object' ? orderBy : { nome: 'asc' },
        include: {
          tabelas: true,
          _count: {
            select: {
              tabelas: true
            }
          }
        }
      })

      return reply.send({
        message: 'Bancos encontrados',
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

      const data = await this.prisma.banco.findUnique({
        where: { id: validId },
        include: {
          tabelas: true
        }
      })

      if (!data) {
        return reply.status(404).send({
          message: 'Banco não encontrado',
          error: 'NotFound'
        })
      }

      return reply.send({
        message: 'Banco encontrado',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.banco.create({
        data: body
      })

      return reply.status(201).send({
        message: 'Banco criado com sucesso',
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

      const data = await this.prisma.banco.update({
        where: { id: validId },
        data: body
      })

      return reply.send({
        message: 'Banco atualizado com sucesso',
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

      // Verificar se o banco está sendo usado por alguma tabela
      const tabelasUsandoBanco = await this.prisma.tabela.count({
        where: { bancoId: validId }
      })

      if (tabelasUsandoBanco > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Não é possível deletar o banco de dados. Ele está sendo usado por ${tabelasUsandoBanco} tabela(s).`
        })
      }

      const data = await this.prisma.banco.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Banco excluído com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
