import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface TipoDadosParams {
  id: string
}

interface TipoDadosQuery {
  skip?: number
  take?: number
  orderBy?: string
  nome?: string
}

interface TipoDadosBody {
  nome: string
  descricao?: string
}

export class TipoDadosController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'tipoDados')
  }

  async findMany(request: FastifyRequest<{ Querystring: TipoDadosQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'nome', nome } = request.query

      this.validatePagination({ skip, take })

      // Construir filtros dinâmicos
      const where: any = {}
      if (nome) {
        where.nome = {
          contains: nome,
          mode: 'insensitive'
        }
      }

      const tipos = await this.prisma.tipoDados.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          colunas: {
            select: {
              id: true,
              nome: true,
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        }
      })

      // Contar total para paginação
      const total = await this.prisma.tipoDados.count({ where })

      return reply.status(200).send({
        message: 'Tipos de dados encontrados',
        data: tipos,
        pagination: {
          total,
          skip,
          take,
          hasMore: skip + take < total
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: TipoDadosParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const tipo = await this.prisma.tipoDados.findUnique({
        where: { id },
        include: {
          colunas: {
            select: {
              id: true,
              nome: true,
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        }
      })

      if (!tipo) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Tipo de dados não encontrado'
        })
      }

      return reply.status(200).send({
        message: 'Tipo de dados encontrado',
        data: tipo
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: TipoDadosBody }>, reply: FastifyReply) {
    try {
      const { nome, descricao } = request.body

      const tipo = await this.prisma.tipoDados.create({
        data: {
          nome,
          descricao
        }
      })

      return reply.status(201).send({
        message: 'Tipo de dados criado com sucesso',
        data: tipo
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: TipoDadosParams; Body: Partial<TipoDadosBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const updateData = { ...request.body }
      if (Object.keys(updateData).length === 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      const tipo = await this.prisma.tipoDados.update({
        where: { id },
        data: updateData
      })

      return reply.status(200).send({
        message: 'Tipo de dados atualizado com sucesso',
        data: tipo
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: TipoDadosParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      // Verificar se o tipo de dados está sendo usado por alguma coluna
      const colunasUsandoTipo = await this.prisma.coluna.count({
        where: { tipoDadosId: id }
      })

      if (colunasUsandoTipo > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Não é possível deletar o tipo de dados. Ele está sendo usado por ${colunasUsandoTipo} coluna(s).`
        })
      }

      await this.prisma.tipoDados.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Tipo de dados deletado com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
