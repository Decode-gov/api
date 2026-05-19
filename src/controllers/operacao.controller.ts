import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class OperacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'operacao')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const empresaId = this.getEmpresaFilter(request)

      const data = await (this.prisma as any).operacao.findMany({
        where: empresaId ? { empresaId } : undefined
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await (this.prisma as any).operacao.findUnique({
        where: { id: validId }
      })

      if (!data) {
        return (reply as any).notFound('Operação não encontrada')
      }

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await (this.prisma as any).operacao.create({
        data: body
      })

      reply.code(201)
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as any

      const data = await (this.prisma as any).operacao.update({
        where: { id: validId },
        data: body
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await (this.prisma as any).operacao.delete({
        where: { id: validId }
      })

      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
