import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class DefinicaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'definicao')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const empresaId = this.getEmpresaFilter(request)

      const data = await this.prisma.definicao.findMany({
        where: empresaId ? { empresaId } : undefined,
        include: {
          comunidade: true
        }
      })

      console.log("🚀 ~ DefinicaoController ~ findMany ~ data:", data)

      return reply.send({
        message: 'Definições encontradas',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)

      const data = await this.prisma.definicao.findUniqueOrThrow({
        where: { id },
        include: {
          comunidade: true
        }
      })

      return reply.send({
        message: 'Definição encontrada',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { termo, definicao, sigla, comunidadeId } = request.body as any
      const empresaId = this.resolveEmpresaIdForCreate(request, request.body)

      const data = await this.prisma.definicao.create({
        data: {
          termo,
          definicao,
          sigla,
          comunidadeId,
          empresaId
        },
        include: {
          comunidade: true
        }
      })

      return reply.status(201).send({
        message: 'Definição criada com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)
      const { termo, definicao, sigla, comunidadeId } = request.body as any

      const data = await this.prisma.definicao.update({
        where: { id },
        data: {
          termo,
          definicao,
          sigla,
          comunidadeId
        },
        include: {
          comunidade: true
        }
      })

      return reply.send({
        message: 'Definição atualizada com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete (request: FastifyRequest, reply: FastifyReply) {
    try {
      const id = this.validateId((request.params as any)?.id)

      const data = await this.prisma.definicao.delete({
        where: { id }
      })

      return reply.send({
        message: 'Definição excluída com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
