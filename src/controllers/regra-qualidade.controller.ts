import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class RegraQualidadeController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regraQualidade')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any
      const where: any = {}
      if (query.regraNegocioId) where.regraNegocioId = query.regraNegocioId
      if (query.dimensaoId) where.dimensaoId = query.dimensaoId
      if (query.tabelaId) where.tabelaId = query.tabelaId
      if (query.colunaId) where.colunaId = query.colunaId
      if (query.responsavelId) where.responsavelId = query.responsavelId
      const data = await this.prisma.regraQualidade.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          descricao: true,
          regraNegocioId: true,
          dimensaoId: true,
          tabelaId: true,
          colunaId: true,
          responsavelId: true,
          regraNegocio: {
            select: {
              id: true,
              descricao: true,
              politicaId: true
            }
          },
          dimensao: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              politicaId: true
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
              nome: true,
              descricao: true
            }
          },
          responsavel: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })
      return reply.send({
        message: 'Regras de qualidade encontradas',
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
      const data = await this.prisma.regraQualidade.findUnique({
        where: { id: validId },
        select: {
          id: true,
          descricao: true,
          regraNegocioId: true,
          dimensaoId: true,
          tabelaId: true,
          colunaId: true,
          responsavelId: true,
          regraNegocio: {
            select: {
              id: true,
              descricao: true,
              politicaId: true
            }
          },
          dimensao: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              politicaId: true
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
              nome: true,
              descricao: true
            }
          },
          responsavel: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })
      if (!data) return (reply as any).notFound('Regra de qualidade não encontrada')
      return reply.send({
        message: 'Regra de qualidade encontrada',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      // Validar regra de negócio se fornecida
      if (body.regraNegocioId) {
        const regraNegocio = await this.prisma.regraNegocio.findUnique({ where: { id: body.regraNegocioId } })
        if (!regraNegocio) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Regra de negócio não encontrada' })
        }
      }

      // Validar dimensão (obrigatória)
      const dimensao = await this.prisma.dimensaoQualidade.findUnique({ where: { id: body.dimensaoId } })
      if (!dimensao) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Dimensão de qualidade não encontrada' })
      }

      // Validar tabela (obrigatória)
      const tabela = await this.prisma.tabela.findUnique({ where: { id: body.tabelaId } })
      if (!tabela) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Tabela não encontrada' })
      }

      // Validar coluna (obrigatória)
      const coluna = await this.prisma.coluna.findUnique({ where: { id: body.colunaId } })
      if (!coluna) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não encontrada' })
      }

      // Verificar se a coluna pertence à tabela
      if (coluna.tabelaId !== body.tabelaId) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não pertence à tabela informada' })
      }

      // Validar responsável (papel, não usuário)
      const responsavel = await this.prisma.papel.findUnique({ where: { id: body.responsavelId } })
      if (!responsavel) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Papel responsável não encontrado' })
      }

      const data = await this.prisma.regraQualidade.create({
        data: body,
        select: {
          id: true,
          descricao: true,
          regraNegocioId: true,
          dimensaoId: true,
          tabelaId: true,
          colunaId: true,
          responsavelId: true,
          regraNegocio: {
            select: {
              id: true,
              descricao: true,
              politicaId: true
            }
          },
          dimensao: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              politicaId: true
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
              nome: true,
              descricao: true
            }
          },
          responsavel: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })
      return reply.code(201).send({
        message: 'Regra de qualidade criada com sucesso',
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

      if (Object.keys(body).length === 0) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Nenhum campo fornecido para atualização' })
      }

      // Validar regra de negócio se fornecida
      if (body.regraNegocioId !== undefined) {
        if (body.regraNegocioId !== null) {
          const regraNegocio = await this.prisma.regraNegocio.findUnique({ where: { id: body.regraNegocioId } })
          if (!regraNegocio) {
            return reply.status(400).send({ error: 'BadRequest', message: 'Regra de negócio não encontrada' })
          }
        }
      }

      // Validar dimensão se fornecida
      if (body.dimensaoId) {
        const dimensao = await this.prisma.dimensaoQualidade.findUnique({ where: { id: body.dimensaoId } })
        if (!dimensao) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Dimensão de qualidade não encontrada' })
        }
      }

      // Validar tabela se fornecida
      if (body.tabelaId) {
        const tabela = await this.prisma.tabela.findUnique({ where: { id: body.tabelaId } })
        if (!tabela) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Tabela não encontrada' })
        }
      }

      // Validar coluna se fornecida
      if (body.colunaId) {
        const coluna = await this.prisma.coluna.findUnique({ where: { id: body.colunaId } })
        if (!coluna) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não encontrada' })
        }

        // Se ambos forem fornecidos, verificar se a coluna pertence à tabela
        if (body.tabelaId && coluna.tabelaId !== body.tabelaId) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Coluna não pertence à tabela informada' })
        }
      }

      // Validar responsável se fornecido (papel, não usuário)
      if (body.responsavelId) {
        const responsavel = await this.prisma.papel.findUnique({ where: { id: body.responsavelId } })
        if (!responsavel) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Papel responsável não encontrado' })
        }
      }

      const data = await this.prisma.regraQualidade.update({
        where: { id: validId },
        data: body,
        select: {
          id: true,
          descricao: true,
          regraNegocioId: true,
          dimensaoId: true,
          tabelaId: true,
          colunaId: true,
          responsavelId: true,
          regraNegocio: {
            select: {
              id: true,
              descricao: true,
              politicaId: true
            }
          },
          dimensao: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              politicaId: true
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
              nome: true,
              descricao: true
            }
          },
          responsavel: {
            select: {
              id: true,
              nome: true,
              descricao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })
      return reply.send({
        message: 'Regra de qualidade atualizada com sucesso',
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
      await this.prisma.regraQualidade.delete({ where: { id: validId } })
      return reply.send({ message: 'Regra de qualidade deletada com sucesso' })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
