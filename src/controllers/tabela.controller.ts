import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'
import type { CreateTabela, UpdateTabela } from '../schemas/tabela.js'

export class TabelaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'tabela')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.tabela.findMany({
        skip,
        take,
        orderBy: orderBy && typeof orderBy === 'string' ? { [orderBy]: 'asc' } : { nome: 'asc' },
        select: {
          id: true,
          nome: true,
          bancoId: true,
          banco: {
            select: {
              id: true,
              nome: true
            }
          },
          _count: {
            select: {
              colunas: true
            }
          }
        }
      })

      return reply.send({
        message: 'Tabelas encontradas',
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

      const data = await this.prisma.tabela.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          bancoId: true,
          banco: {
            select: {
              id: true,
              nome: true,
              sistemaId: true
            }
          },
          colunas: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          },
          regrasQualidade: {
            select: {
              id: true,
              descricao: true
            }
          }
        }
      })

      if (!data) {
        return reply.status(404).send({
          message: 'Tabela não encontrada',
          error: 'NotFound'
        })
      }

      return reply.send({
        message: 'Tabela encontrada',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as CreateTabela

      const data = await this.prisma.tabela.create({
        data: body as any,
        select: {
          id: true,
          nome: true,
          bancoId: true,
          banco: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Tabela criada com sucesso',
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
      const body = request.body as UpdateTabela

      const data = await this.prisma.tabela.update({
        where: { id: validId },
        data: body as any,
        select: {
          id: true,
          nome: true,
          bancoId: true,
          banco: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      return reply.send({
        message: 'Tabela atualizada com sucesso',
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

      // Verificar se a tabela está sendo usada por colunas
      const colunasUsandoTabela = await this.prisma.coluna.count({
        where: { tabelaId: validId }
      })

      if (colunasUsandoTabela > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Não é possível deletar a tabela. Ela possui ${colunasUsandoTabela} coluna(s) associada(s).`
        })
      }

      const data = await this.prisma.tabela.delete({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          bancoId: true
        }
      })

      return reply.send({
        message: 'Tabela excluída com sucesso',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
