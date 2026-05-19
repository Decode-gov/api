import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class KpiController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'kPI')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const empresaId = this.getEmpresaFilter(request)

      const data = await this.prisma.kPI.findMany({
        where: empresaId ? { empresaId } : undefined,
        select: {
          id: true,
          nome: true,
          comunidadeId: true,
          comunidade: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      reply.send({
        message: 'KPIs encontrados',
        data
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

      const data = await this.prisma.kPI.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          comunidadeId: true,
          comunidade: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      if (!data) {
        return (reply as any).notFound('KPI não encontrado')
      }

      reply.send({
        message: 'KPI encontrado',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any
      const empresaId = this.resolveEmpresaIdForCreate(request, body)

      const data = await this.prisma.kPI.create({
        data: { ...body, empresaId },
        select: {
          id: true,
          nome: true,
          comunidadeId: true,
          comunidade: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      reply.code(201).send({
        message: 'KPI criado com sucesso',
        data
      })
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

      const data = await this.prisma.kPI.update({
        where: { id: validId },
        data: body,
        select: {
          id: true,
          nome: true,
          comunidadeId: true,
          comunidade: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      reply.send({
        message: 'KPI atualizado com sucesso',
        data
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

      const data = await this.prisma.kPI.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'KPI excluído com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
