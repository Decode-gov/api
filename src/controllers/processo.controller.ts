import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class ProcessoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'processo')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const empresaId = this.getEmpresaFilter(request)

      const data = await this.prisma.processo.findMany({
        where: empresaId ? { empresaId } : undefined,
      })

      return reply.send({
        message: 'Processos encontrados',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)

      const data = await this.prisma.processo.findUniqueOrThrow({
        where: { id },
      })

      return reply.send({
        message: 'Processo encontrado',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { nome, descricao } = request.body as any
      const empresaId = this.resolveEmpresaIdForCreate(request, request.body)

      const data = await this.prisma.processo.create({
        data: {
          nome,
          descricao,
          empresaId
        },
      })

      return reply.status(201).send({
        message: 'Processo criado com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)
      const { nome, descricao } = request.body as any

      const data = await this.prisma.processo.update({
        where: { id },
        data: {
          nome,
          descricao
        },
      })

      return reply.send({
        message: 'Processo atualizado com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete (request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)

      const data = await this.prisma.processo.delete({
        where: { id }
      })

      return reply.send({
        message: 'Processo excluído com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
