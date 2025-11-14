import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'
import type { CreateBanco, UpdateBanco } from '../schemas/banco.js'

export class BancoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'banco')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.banco.findMany({
        skip,
        take,
        orderBy: orderBy && typeof orderBy === 'string' ? { [orderBy]: 'asc' } : { nome: 'asc' },
        select: {
          id: true,
          nome: true,
          sistemaId: true,
          sistema: {
            select: {
              id: true,
              nome: true,
              repositorio: true,
              createdAt: true,
              updatedAt: true
            }
          },
        }
      })

      return reply.send({
        message: 'Bancos encontrados',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.banco.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          sistemaId: true,
          sistema: {
            select: {
              id: true,
              nome: true,
              repositorio: true,
              createdAt: true,
              updatedAt: true
            }
          },
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
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as CreateBanco

      const data = await this.prisma.banco.create({
        data: {
          nome: body.nome,
          sistemaId: body.sistemaId
        },
        select: {
          id: true,
          nome: true,
          sistemaId: true,
          sistema: {
            select: {
              id: true,
              nome: true,
              repositorio: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Banco criado com sucesso',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as UpdateBanco

      const data = await this.prisma.banco.update({
        where: { id: validId },
        data: {
          nome: body.nome,
          sistemaId: body.sistemaId
        },
        select: {
          id: true,
          nome: true,
          sistemaId: true,
          sistema: {
            select: {
              id: true,
              nome: true,
              repositorio: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })

      return reply.send({
        message: 'Banco atualizado com sucesso',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
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
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          sistemaId: true,
          sistema: {
            select: {
              id: true,
              nome: true,
              repositorio: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })

      return reply.send({
        message: 'Banco excluído com sucesso',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
