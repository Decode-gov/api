import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'
import type { CreateColuna, UpdateColuna } from '../schemas/coluna.js'

export class ColunaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'coluna')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.coluna.findMany({
        skip,
        take,
        orderBy: orderBy && typeof orderBy === 'string' ? { [orderBy]: 'asc' } : { nome: 'asc' },
        select: {
          id: true,
          nome: true,
          descricao: true,
          tabelaId: true,
          necessidadeInformacaoId: true,
          necessidadeInformacao: true,
          termoId: true,
          termo: true,
          tabela: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Colunas encontradas',
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

      const data = await this.prisma.coluna.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          descricao: true,
          tabelaId: true,
          necessidadeInformacaoId: true,
          necessidadeInformacao: true,
          termoId: true,
          termo: true,
          tabela: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!data) {
        return reply.status(404).send({
          message: 'Coluna não encontrada',
          error: 'NotFound'
        })
      }

      return reply.send({
        message: 'Coluna encontrada',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as CreateColuna

      const data = await this.prisma.coluna.create({
        data: body as any,
        select: {
          id: true,
          nome: true,
          descricao: true,
          tabelaId: true,
          necessidadeInformacaoId: true,
          necessidadeInformacao: true,
          termoId: true,
          termo: true,
          tabela: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.status(201).send({
        message: 'Coluna criada com sucesso',
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
      const body = request.body as UpdateColuna

      const data = await this.prisma.coluna.update({
        where: { id: validId },
        data: body as any,
        select: {
          id: true,
          nome: true,
          descricao: true,
          tabelaId: true,
          necessidadeInformacaoId: true,
          necessidadeInformacao: true,
          termoId: true,
          termo: true,
          tabela: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Coluna atualizada com sucesso',
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

      // Verificar se a coluna está sendo usada por regras de qualidade
      const regrasQualidadeUsandoColuna = await this.prisma.regraQualidade.count({
        where: { colunaId: validId }
      })

      if (regrasQualidadeUsandoColuna > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Não é possível deletar a coluna. Ela está sendo usada por ${regrasQualidadeUsandoColuna} regra(s) de qualidade.`
        })
      }

      // Verificar se a coluna está sendo usada por listas de referência
      const listasReferenciaUsandoColuna = await this.prisma.listaReferencia.count({
        where: { colunaId: validId }
      })

      if (listasReferenciaUsandoColuna > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Não é possível deletar a coluna. Ela está sendo usada por ${listasReferenciaUsandoColuna} lista(s) de referência.`
        })
      }

      const data = await this.prisma.coluna.delete({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          descricao: true,
          tabelaId: true,
          necessidadeInformacaoId: true,
          necessidadeInformacao: true,
          termoId: true,
          termo: true,
          tabela: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Coluna excluída com sucesso',
        data
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
