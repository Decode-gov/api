import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class RegraNegocioController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'regraNegocio')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any

      const where: any = {}
      if (query.politicaId) where.politicaId = query.politicaId
      if (query.sistemaId) where.sistemaId = query.sistemaId
      if (query.responsavelId) where.responsavelId = query.responsavelId
      if (query.termoId) where.termoId = query.termoId

      const data = await this.prisma.regraNegocio.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          descricao: true,
          politicaId: true,
          sistemaId: true,
          responsavelId: true,
          termoId: true,
          politica: {
            select: {
              id: true,
              nome: true,
              versao: true
            }
          },
          sistema: {
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
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Regras de negócio encontradas',
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

      const data = await this.prisma.regraNegocio.findUnique({
        where: { id: validId },
        select: {
          id: true,
          descricao: true,
          politicaId: true,
          sistemaId: true,
          responsavelId: true,
          termoId: true,
          politica: {
            select: {
              id: true,
              nome: true,
              versao: true
            }
          },
          sistema: {
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
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Regra de negócio não encontrada')
      }

      return reply.send({
        message: 'Regra de negócio encontrada',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      // Validar política (obrigatória)
      const politica = await this.prisma.politicaInterna.findUnique({ where: { id: body.politicaId } })
      if (!politica) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Política interna não encontrada' })
      }

      // Validar sistema se fornecido (opcional)
      if (body.sistemaId) {
        const sistema = await this.prisma.sistema.findUnique({ where: { id: body.sistemaId } })
        if (!sistema) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Sistema não encontrado' })
        }
      }

      // Validar responsável (papel, obrigatório)
      const responsavel = await this.prisma.papel.findUnique({ where: { id: body.responsavelId } })
      if (!responsavel) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Papel responsável não encontrado' })
      }

      // Validar termo (definição, obrigatório)
      const termo = await this.prisma.definicao.findUnique({ where: { id: body.termoId } })
      if (!termo) {
        return reply.status(400).send({ error: 'BadRequest', message: 'Termo (definição) não encontrado' })
      }

      const data = await this.prisma.regraNegocio.create({
        data: body,
        select: {
          id: true,
          descricao: true,
          politicaId: true,
          sistemaId: true,
          responsavelId: true,
          termoId: true,
          politica: {
            select: {
              id: true,
              nome: true,
              versao: true
            }
          },
          sistema: {
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
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.code(201).send({
        message: 'Regra de negócio criada com sucesso',
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

      // Validar política se fornecida
      if (body.politicaId) {
        const politica = await this.prisma.politicaInterna.findUnique({ where: { id: body.politicaId } })
        if (!politica) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Política interna não encontrada' })
        }
      }

      // Validar sistema se fornecido
      if (body.sistemaId !== undefined) {
        if (body.sistemaId !== null) {
          const sistema = await this.prisma.sistema.findUnique({ where: { id: body.sistemaId } })
          if (!sistema) {
            return reply.status(400).send({ error: 'BadRequest', message: 'Sistema não encontrado' })
          }
        }
      }

      // Validar responsável se fornecido
      if (body.responsavelId) {
        const responsavel = await this.prisma.papel.findUnique({ where: { id: body.responsavelId } })
        if (!responsavel) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Papel responsável não encontrado' })
        }
      }

      // Validar termo se fornecido
      if (body.termoId) {
        const termo = await this.prisma.definicao.findUnique({ where: { id: body.termoId } })
        if (!termo) {
          return reply.status(400).send({ error: 'BadRequest', message: 'Termo (definição) não encontrado' })
        }
      }

      const data = await this.prisma.regraNegocio.update({
        where: { id: validId },
        data: body,
        select: {
          id: true,
          descricao: true,
          politicaId: true,
          sistemaId: true,
          responsavelId: true,
          termoId: true,
          politica: {
            select: {
              id: true,
              nome: true,
              versao: true
            }
          },
          sistema: {
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
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Regra de negócio atualizada com sucesso',
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

      await this.prisma.regraNegocio.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Regra de negócio deletada com sucesso'
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
