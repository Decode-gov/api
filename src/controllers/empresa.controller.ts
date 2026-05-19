import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class EmpresaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'empresa')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await this.prisma.empresa.findMany({
        where: { deletedAt: null },
        orderBy: { nome: 'asc' }
      })

      return reply.send({
        message: 'Empresas encontradas',
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

      const data = await this.prisma.empresa.findFirst({
        where: { id: validId, deletedAt: null }
      })

      if (!data) {
        return (reply as any).notFound('Empresa não encontrada')
      }

      return reply.send({
        message: 'Empresa encontrada',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.empresa.create({
        data: { nome: body.nome }
      })

      return reply.status(201).send({
        message: 'Empresa criada com sucesso',
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

      const existing = await this.prisma.empresa.findFirst({
        where: { id: validId, deletedAt: null }
      })

      if (!existing) {
        return (reply as any).notFound('Empresa não encontrada')
      }

      const data = await this.prisma.empresa.update({
        where: { id: validId },
        data: { nome: body.nome, updatedAt: new Date() }
      })

      return reply.send({
        message: 'Empresa atualizada com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const existing = await this.prisma.empresa.findFirst({
        where: { id: validId, deletedAt: null }
      })

      if (!existing) {
        return (reply as any).notFound('Empresa não encontrada')
      }

      // Soft delete
      const data = await this.prisma.empresa.update({
        where: { id: validId },
        data: { deletedAt: new Date() }
      })

      return reply.send({
        message: 'Empresa excluída com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
