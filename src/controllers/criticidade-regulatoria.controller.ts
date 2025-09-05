import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface CriticidadeRegulatoriaParams {
  id: string
}

interface CriticidadeRegulatoriaQuery {
  skip?: number
  take?: number
  orderBy?: string
  regulacaoId?: string
  regraQualidadeId?: string
  grauCriticidade?: string
}

interface CriticidadeRegulatoriaBody {
  regulacaoId: string
  regraQualidadeId: string
  grauCriticidade: string
}

export class CriticidadeRegulatoriaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'criticidadeRegulatoria')
  }

  async findMany(request: FastifyRequest<{ Querystring: CriticidadeRegulatoriaQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'grauCriticidade', regulacaoId, regraQualidadeId, grauCriticidade } = request.query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (regulacaoId) where.regulacaoId = regulacaoId
      if (regraQualidadeId) where.regraQualidadeId = regraQualidadeId
      if (grauCriticidade) where.grauCriticidade = grauCriticidade

      const criticidades = await (this.prisma as any).criticidadeRegulatoria.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          regulacao: {
            select: {
              id: true,
              epigrafe: true,
              orgao: true,
              dataInicio: true,
              dataFim: true
            }
          },
          regraQualidade: {
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
        message: 'Criticidades regulatórias encontradas',
        data: criticidades
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: CriticidadeRegulatoriaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const criticidade = await (this.prisma as any).criticidadeRegulatoria.findUnique({
        where: { id },
        include: {
          regulacao: true,
          regraQualidade: {
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
                      nome: true
                    }
                  },
                  banco: {
                    select: {
                      id: true,
                      nome: true
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
              }
            }
          }
        }
      })

      if (!criticidade) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Criticidade regulatória não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Criticidade regulatória encontrada',
        data: criticidade
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: CriticidadeRegulatoriaBody }>, reply: FastifyReply) {
    try {
      const { regulacaoId, regraQualidadeId, grauCriticidade } = request.body

      // Validar grau de criticidade
      const grausValidos = ['Baixa', 'Média', 'Alta', 'Crítica']
      if (!grausValidos.includes(grauCriticidade)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Grau de criticidade deve ser um dos seguintes: ${grausValidos.join(', ')}`
        })
      }

      // Validar se a regulação existe
      const regulacao = await (this.prisma as any).regulacaoCompleta.findUnique({
        where: { id: regulacaoId }
      })

      if (!regulacao) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Regulação não encontrada'
        })
      }

      // Validar se a regra de qualidade existe
      const regraQualidade = await (this.prisma as any).regraQualidade.findUnique({
        where: { id: regraQualidadeId }
      })

      if (!regraQualidade) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Regra de qualidade não encontrada'
        })
      }

      // Verificar se já existe essa combinação
      const existingCriticidade = await (this.prisma as any).criticidadeRegulatoria.findUnique({
        where: {
          regulacaoId_regraQualidadeId: {
            regulacaoId,
            regraQualidadeId
          }
        }
      })

      if (existingCriticidade) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Já existe uma criticidade regulatória para esta combinação de regulação e regra de qualidade'
        })
      }

      const criticidade = await (this.prisma as any).criticidadeRegulatoria.create({
        data: {
          regulacaoId,
          regraQualidadeId,
          grauCriticidade
        },
        include: {
          regulacao: {
            select: {
              id: true,
              epigrafe: true,
              orgao: true
            }
          },
          regraQualidade: {
            select: {
              id: true,
              descricao: true,
              dimensao: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Criticidade regulatória criada com sucesso',
        data: criticidade
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: CriticidadeRegulatoriaParams; Body: Partial<CriticidadeRegulatoriaBody> }>, reply: FastifyReply) {
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

      // Validar grau de criticidade se fornecido
      if (updateData.grauCriticidade) {
        const grausValidos = ['Baixa', 'Média', 'Alta', 'Crítica']
        if (!grausValidos.includes(updateData.grauCriticidade)) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: `Grau de criticidade deve ser um dos seguintes: ${grausValidos.join(', ')}`
          })
        }
      }

      // Validações de integridade referencial se necessário
      if (updateData.regulacaoId) {
        const regulacao = await (this.prisma as any).regulacaoCompleta.findUnique({
          where: { id: updateData.regulacaoId }
        })

        if (!regulacao) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Regulação não encontrada'
          })
        }
      }

      if (updateData.regraQualidadeId) {
        const regraQualidade = await (this.prisma as any).regraQualidade.findUnique({
          where: { id: updateData.regraQualidadeId }
        })

        if (!regraQualidade) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Regra de qualidade não encontrada'
          })
        }
      }

      // Verificar unicidade se estiver mudando regulacaoId ou regraQualidadeId
      if (updateData.regulacaoId || updateData.regraQualidadeId) {
        const criticidadeAtual = await (this.prisma as any).criticidadeRegulatoria.findUnique({
          where: { id }
        })

        const novaRegulacaoId = updateData.regulacaoId || criticidadeAtual.regulacaoId
        const novaRegraQualidadeId = updateData.regraQualidadeId || criticidadeAtual.regraQualidadeId

        const existingCriticidade = await (this.prisma as any).criticidadeRegulatoria.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              { regulacaoId: novaRegulacaoId },
              { regraQualidadeId: novaRegraQualidadeId }
            ]
          }
        })

        if (existingCriticidade) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Já existe uma criticidade regulatória para esta combinação de regulação e regra de qualidade'
          })
        }
      }

      const criticidade = await (this.prisma as any).criticidadeRegulatoria.update({
        where: { id },
        data: updateData,
        include: {
          regulacao: {
            select: {
              id: true,
              epigrafe: true,
              orgao: true
            }
          },
          regraQualidade: {
            select: {
              id: true,
              descricao: true,
              dimensao: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Criticidade regulatória atualizada com sucesso',
        data: criticidade
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: CriticidadeRegulatoriaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      await (this.prisma as any).criticidadeRegulatoria.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Criticidade regulatória deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para listar criticidades por grau
  async listarPorGrau(request: FastifyRequest<{ Params: { grau: string } }>, reply: FastifyReply) {
    try {
      const { grau } = request.params

      const grausValidos = ['Baixa', 'Média', 'Alta', 'Crítica']
      if (!grausValidos.includes(grau)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Grau de criticidade deve ser um dos seguintes: ${grausValidos.join(', ')}`
        })
      }

      const criticidades = await (this.prisma as any).criticidadeRegulatoria.findMany({
        where: { grauCriticidade: grau },
        include: {
          regulacao: {
            select: {
              id: true,
              epigrafe: true,
              orgao: true,
              dataInicio: true,
              dataFim: true
            }
          },
          regraQualidade: {
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
              responsavel: {
                select: {
                  id: true,
                  nome: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          regulacao: {
            epigrafe: 'asc'
          }
        }
      })

      return reply.status(200).send({
        message: `Criticidades regulatórias com grau ${grau} encontradas`,
        data: criticidades
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
