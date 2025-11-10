import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface ClassificacaoInformacaoParams {
  id: string
}

interface ClassificacaoInformacaoQuery {
  skip?: number
  take?: number
  orderBy?: string
}

interface ClassificacaoInformacaoBody {
  classificacaoId: string
  termoId: string
}

export class ClassificacaoInformacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'classificacao')
  }

  async findMany(request: FastifyRequest<{ Querystring: ClassificacaoInformacaoQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'createdAt' } = request.query

      this.validatePagination({ skip, take })

      const classificacoes = await this.prisma.classificacao.findMany({
        skip,
        take,
        orderBy: { [orderBy]: 'asc' },
        include: {
          classificacao: {
            include: {
              politica: true
            }
          },
          termo: true
        }
      })

      return reply.status(200).send({
        message: 'Classificações de informação encontradas',
        data: classificacoes
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: ClassificacaoInformacaoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const classificacao = await this.prisma.classificacao.findUnique({
        where: { id },
        include: {
          classificacao: {
            include: {
              politica: true
            }
          },
          termo: true
        }
      })

      if (!classificacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Classificação de informação não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Classificação de informação encontrada',
        data: classificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: ClassificacaoInformacaoBody }>, reply: FastifyReply) {
    try {
      const { classificacaoId, termoId } = request.body

      // Validar se a lista de classificação existe
      const listaClassificacao = await this.prisma.listaClassificacao.findUnique({
        where: { id: classificacaoId }
      })

      if (!listaClassificacao) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Lista de classificação não encontrada'
        })
      }

      // Validar se o termo existe
      const termo = await this.prisma.definicao.findUnique({
        where: { id: termoId }
      })

      if (!termo) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Termo de definição não encontrado'
        })
      }

      const classificacao = await this.prisma.classificacao.create({
        data: {
          classificacaoId,
          termoId
        },
        include: {
          classificacao: {
            include: {
              politica: true
            }
          },
          termo: true
        }
      })

      return reply.status(201).send({
        message: 'Classificação de informação criada com sucesso',
        data: classificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: ClassificacaoInformacaoParams; Body: Partial<ClassificacaoInformacaoBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const { classificacaoId, termoId } = request.body

      if (!classificacaoId && !termoId) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      // Se está atualizando classificacaoId, validar se existe
      if (classificacaoId) {
        const listaClassificacao = await this.prisma.listaClassificacao.findUnique({
          where: { id: classificacaoId }
        })

        if (!listaClassificacao) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Lista de classificação não encontrada'
          })
        }
      }

      // Se está atualizando termoId, validar se existe
      if (termoId) {
        const termo = await this.prisma.definicao.findUnique({
          where: { id: termoId }
        })

        if (!termo) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Termo de definição não encontrado'
          })
        }
      }

      const classificacao = await this.prisma.classificacao.update({
        where: { id },
        data: {
          ...(classificacaoId && { classificacaoId }),
          ...(termoId && { termoId })
        },
        include: {
          classificacao: {
            include: {
              politica: true
            }
          },
          termo: true
        }
      })

      return reply.status(200).send({
        message: 'Classificação de informação atualizada com sucesso',
        data: classificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: ClassificacaoInformacaoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      await this.prisma.classificacao.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Classificação de informação deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
