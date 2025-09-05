import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface DimensaoQualidadeParams {
  id: string
}

interface DimensaoQualidadeQuery {
  skip?: number
  take?: number
  orderBy?: string
  politicaId?: string
}

interface DimensaoQualidadeBody {
  nome: string
  descricao?: string
  politicaId: string
}

export class DimensaoQualidadeController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'dimensaoQualidade')
  }

  async findMany(request: FastifyRequest<{ Querystring: DimensaoQualidadeQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'nome', politicaId } = request.query

      this.validatePagination({ skip, take })

      const where = politicaId ? { politicaId } : {}

      const dimensoes = await (this.prisma as any).dimensaoQualidade.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          politica: {
            select: {
              id: true,
              nome: true,
              categoria: true
            }
          },
          regrasQualidade: {
            select: {
              id: true,
              descricao: true,
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              },
              coluna: {
                select: {
                  id: true,
                  nome: true
                }
              },
              responsavel: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Dimensões de qualidade encontradas',
        data: dimensoes
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: DimensaoQualidadeParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const dimensao = await (this.prisma as any).dimensaoQualidade.findUnique({
        where: { id },
        include: {
          politica: {
            select: {
              id: true,
              nome: true,
              categoria: true,
              status: true
            }
          },
          regrasQualidade: {
            include: {
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              },
              coluna: {
                select: {
                  id: true,
                  nome: true
                }
              },
              responsavel: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              },
              criticidadesRegulatorias: {
                include: {
                  regulacao: {
                    select: {
                      id: true,
                      epigrafe: true,
                      orgao: true
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (!dimensao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Dimensão de qualidade não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Dimensão de qualidade encontrada',
        data: dimensao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: DimensaoQualidadeBody }>, reply: FastifyReply) {
    try {
      const { nome, descricao, politicaId } = request.body

      // Validar se a política existe
      const politica = await this.prisma.politicaInterna.findUnique({
        where: { id: politicaId }
      })

      if (!politica) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Política interna não encontrada'
        })
      }

      const dimensao = await (this.prisma as any).dimensaoQualidade.create({
        data: {
          nome,
          descricao,
          politicaId
        },
        include: {
          politica: {
            select: {
              id: true,
              nome: true,
              categoria: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Dimensão de qualidade criada com sucesso',
        data: dimensao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: DimensaoQualidadeParams; Body: Partial<DimensaoQualidadeBody> }>, reply: FastifyReply) {
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

      // Se está atualizando politicaId, validar se existe
      if (updateData.politicaId) {
        const politica = await this.prisma.politicaInterna.findUnique({
          where: { id: updateData.politicaId }
        })

        if (!politica) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Política interna não encontrada'
          })
        }
      }

      const dimensao = await (this.prisma as any).dimensaoQualidade.update({
        where: { id },
        data: updateData,
        include: {
          politica: {
            select: {
              id: true,
              nome: true,
              categoria: true
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Dimensão de qualidade atualizada com sucesso',
        data: dimensao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: DimensaoQualidadeParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      // Verificar se há regras de qualidade associadas
      const regrasQualidade = await (this.prisma as any).regraQualidade.findMany({
        where: { dimensaoId: id }
      })

      if (regrasQualidade.length > 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Não é possível deletar dimensão que possui regras de qualidade associadas'
        })
      }

      await (this.prisma as any).dimensaoQualidade.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Dimensão de qualidade deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
