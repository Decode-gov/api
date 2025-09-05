import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface RegraQualidadeParams {
  id: string
}

interface RegraQualidadeQuery {
  skip?: number
  take?: number
  orderBy?: string
  dimensaoId?: string
  tabelaId?: string
  colunaId?: string
  responsavelId?: string
}

interface RegraQualidadeBody {
  descricao: string
  dimensaoId: string
  tabelaId?: string
  colunaId?: string
  responsavelId: string
}

export class RegraQualidadeController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regraQualidade')
  }

  async findMany(request: FastifyRequest<{ Querystring: RegraQualidadeQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'descricao', dimensaoId, tabelaId, colunaId, responsavelId } = request.query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (dimensaoId) where.dimensaoId = dimensaoId
      if (tabelaId) where.tabelaId = tabelaId
      if (colunaId) where.colunaId = colunaId
      if (responsavelId) where.responsavelId = responsavelId

      const regras = await (this.prisma as any).regraQualidade.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          dimensao: {
            select: {
              id: true,
              nome: true,
              politica: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          },
          tabela: {
            select: {
              id: true,
              nome: true,
              sistema: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          },
          coluna: {
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
                  orgao: true,
                  dataInicio: true,
                  dataFim: true
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Regras de qualidade encontradas',
        data: regras
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: RegraQualidadeParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const regra = await (this.prisma as any).regraQualidade.findUnique({
        where: { id },
        include: {
          dimensao: {
            include: {
              politica: {
                select: {
                  id: true,
                  nome: true,
                  categoria: true,
                  status: true
                }
              }
            }
          },
          tabela: {
            include: {
              sistema: {
                select: {
                  id: true,
                  nome: true,
                  descricao: true
                }
              },
              banco: {
                select: {
                  id: true,
                  nome: true,
                  descricao: true
                }
              }
            }
          },
          coluna: {
            include: {
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          },
          responsavel: {
            select: {
              id: true,
              nome: true,
              email: true,
              ativo: true
            }
          },
          criticidadesRegulatorias: {
            include: {
              regulacao: true
            }
          }
        }
      })

      if (!regra) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Regra de qualidade não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Regra de qualidade encontrada',
        data: regra
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: RegraQualidadeBody }>, reply: FastifyReply) {
    try {
      const { descricao, dimensaoId, tabelaId, colunaId, responsavelId } = request.body

      // Validações de integridade referencial
      const dimensao = await (this.prisma as any).dimensaoQualidade.findUnique({
        where: { id: dimensaoId }
      })

      if (!dimensao) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Dimensão de qualidade não encontrada'
        })
      }

      const responsavel = await this.prisma.usuario.findUnique({
        where: { id: responsavelId }
      })

      if (!responsavel) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Usuário responsável não encontrado'
        })
      }

      // Validar tabela se fornecida
      if (tabelaId) {
        const tabela = await this.prisma.tabela.findUnique({
          where: { id: tabelaId }
        })

        if (!tabela) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Tabela não encontrada'
          })
        }
      }

      // Validar coluna se fornecida (e deve pertencer à tabela se ambas forem fornecidas)
      if (colunaId) {
        const whereColuna: any = { id: colunaId }
        if (tabelaId) {
          whereColuna.tabelaId = tabelaId
        }

        const coluna = await this.prisma.coluna.findUnique({
          where: whereColuna
        })

        if (!coluna) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: tabelaId
              ? 'Coluna não encontrada ou não pertence à tabela informada'
              : 'Coluna não encontrada'
          })
        }
      }

      const regra = await (this.prisma as any).regraQualidade.create({
        data: {
          descricao,
          dimensaoId,
          tabelaId,
          colunaId,
          responsavelId
        },
        include: {
          dimensao: {
            select: {
              id: true,
              nome: true
            }
          },
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
      })

      return reply.status(201).send({
        message: 'Regra de qualidade criada com sucesso',
        data: regra
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: RegraQualidadeParams; Body: Partial<RegraQualidadeBody> }>, reply: FastifyReply) {
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

      // Validações similares ao create para campos que estão sendo atualizados
      if (updateData.dimensaoId) {
        const dimensao = await (this.prisma as any).dimensaoQualidade.findUnique({
          where: { id: updateData.dimensaoId }
        })

        if (!dimensao) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Dimensão de qualidade não encontrada'
          })
        }
      }

      if (updateData.responsavelId) {
        const responsavel = await this.prisma.usuario.findUnique({
          where: { id: updateData.responsavelId }
        })

        if (!responsavel) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Usuário responsável não encontrado'
          })
        }
      }

      if (updateData.tabelaId) {
        const tabela = await this.prisma.tabela.findUnique({
          where: { id: updateData.tabelaId }
        })

        if (!tabela) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Tabela não encontrada'
          })
        }
      }

      if (updateData.colunaId) {
        const whereColuna: any = { id: updateData.colunaId }
        if (updateData.tabelaId) {
          whereColuna.tabelaId = updateData.tabelaId
        }

        const coluna = await this.prisma.coluna.findUnique({
          where: whereColuna
        })

        if (!coluna) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Coluna não encontrada ou não pertence à tabela informada'
          })
        }
      }

      const regra = await (this.prisma as any).regraQualidade.update({
        where: { id },
        data: updateData,
        include: {
          dimensao: {
            select: {
              id: true,
              nome: true
            }
          },
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
      })

      return reply.status(200).send({
        message: 'Regra de qualidade atualizada com sucesso',
        data: regra
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: RegraQualidadeParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      await (this.prisma as any).regraQualidade.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Regra de qualidade deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
