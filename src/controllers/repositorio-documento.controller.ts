import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class RepositorioDocumentoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'repositorioDocumento')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any

      const where: any = {}
      if (query.nome) {
        where.nome = {
          contains: query.nome,
          mode: 'insensitive'
        }
      }
      if (query.ged !== undefined) where.ged = query.ged === 'true' || query.ged === true
      if (query.rede !== undefined) where.rede = query.rede === 'true' || query.rede === true

      const data = await this.prisma.repositorioDocumento.findMany({
        skip,
        take,
        where,
        ...(orderBy && { orderBy }),
        select: {
          id: true,
          nome: true,
          ged: true,
          rede: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Repositórios de documentos encontrados',
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

      const data = await this.prisma.repositorioDocumento.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          ged: true,
          rede: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Repositório de documentos não encontrado')
      }

      return reply.send({
        message: 'Repositório de documentos encontrado',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.repositorioDocumento.create({
        data: body,
        select: {
          id: true,
          nome: true,
          ged: true,
          rede: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.code(201).send({
        message: 'Repositório de documentos criado com sucesso',
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

      const data = await this.prisma.repositorioDocumento.update({
        where: { id: validId },
        data: body,
        select: {
          id: true,
          nome: true,
          ged: true,
          rede: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return reply.send({
        message: 'Repositório de documentos atualizado com sucesso',
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

      await this.prisma.repositorioDocumento.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Repositório de documentos deletado com sucesso'
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
