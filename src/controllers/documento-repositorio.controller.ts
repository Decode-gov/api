import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class DocumentoRepositorioController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'documentoRepositorio')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'dataUpload', termoId, repositorioId } = request.query as any

      this.validatePagination({ skip, take })

      const where: any = {}
      if (termoId) where.termoId = termoId
      if (repositorioId) where.repositorioId = repositorioId

      const documentos = await (this.prisma as any).documentoRepositorio.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: orderBy === 'createdAt' ? 'desc' : 'asc' },
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true,
              sigla: true
            }
          },
          repositorio: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              localizacao: true
            }
          }
        }
      })

      const total = await (this.prisma as any).documentoRepositorio.count({ where })

      return reply.status(200).send({
        message: 'Documentos encontrados',
        data: documentos,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take)
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any
      this.validateId(id)

      const documento = await (this.prisma as any).documentoRepositorio.findUnique({
        where: { id },
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true,
              sigla: true
            }
          },
          repositorio: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              localizacao: true
            }
          }
        }
      })

      if (!documento) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Documento não encontrado'
        })
      }

      return reply.status(200).send({
        message: 'Documento encontrado',
        data: documento
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { termoId, repositorioId } = request.body as any

      // Validar FK: Termo
      const termo = await (this.prisma as any).definicao.findUnique({
        where: { id: termoId }
      })
      if (!termo) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Termo não encontrado'
        })
      }

      // Validar FK: Repositório
      const repositorio = await (this.prisma as any).repositorioDocumento.findUnique({
        where: { id: repositorioId }
      })
      if (!repositorio) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Repositório de documentos não encontrado'
        })
      }

      // Validar se já existe a mesma associação
      const existingDoc = await (this.prisma as any).documentoRepositorio.findFirst({
        where: {
          termoId,
          repositorioId
        }
      })
      if (existingDoc) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Esta associação termo-repositório já existe'
        })
      }

      const documento = await (this.prisma as any).documentoRepositorio.create({
        data: {
          termoId,
          repositorioId
        },
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true,
              sigla: true
            }
          },
          repositorio: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              localizacao: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Documento criado com sucesso',
        data: documento
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any
      this.validateId(id)

      const body = request.body as any
      const updateData = { ...body }
      if (Object.keys(updateData).length === 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      // Validar FK: Termo (se fornecido)
      if (updateData.termoId) {
        const termo = await (this.prisma as any).definicao.findUnique({
          where: { id: updateData.termoId }
        })
        if (!termo) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Termo não encontrado'
          })
        }
      }

      // Validar FK: Repositório (se fornecido)
      if (updateData.repositorioId) {
        const repositorio = await (this.prisma as any).repositorioDocumento.findUnique({
          where: { id: updateData.repositorioId }
        })
        if (!repositorio) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Repositório de documentos não encontrado'
          })
        }
      }

      const documento = await (this.prisma as any).documentoRepositorio.update({
        where: { id },
        data: updateData,
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true,
              sigla: true
            }
          },
          repositorio: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              localizacao: true
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Documento atualizado com sucesso',
        data: documento
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any
      this.validateId(id)

      await (this.prisma as any).documentoRepositorio.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Documento deletado com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
