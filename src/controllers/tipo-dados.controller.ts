import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class TipoDadosController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'tipoDados')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const empresaId = this.getEmpresaFilter(request)
      const { nome, categoria, permiteNulo } = request.query as any

      // Construir filtros dinâmicos
      const where: any = {
        ...(empresaId ? { empresaId } : {})
      }
      if (nome) {
        where.nome = {
          contains: nome,
          mode: 'insensitive'
        }
      }
      if (categoria) {
        where.categoria = categoria
      }
      if (permiteNulo !== undefined) {
        where.permiteNulo = permiteNulo
      }

      const data = await this.prisma.tipoDados.findMany({
        where,
        select: {
          id: true,
          nome: true,
          descricao: true
        }
      })

      reply.send({
        message: 'Tipos de dados encontrados',
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

      const data = await this.prisma.tipoDados.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          descricao: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Tipo de dados não encontrado')
      }

      reply.send({
        message: 'Tipo de dados encontrado',
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

      const data = await this.prisma.tipoDados.create({
        data: { ...body, empresaId },
        select: {
          id: true,
          nome: true,
          descricao: true
        }
      })

      reply.code(201).send({
        message: 'Tipo de dados criado com sucesso',
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

      const data = await this.prisma.tipoDados.update({
        where: { id: validId },
        data: body,
        select: {
          id: true,
          nome: true,
          descricao: true
        }
      })

      reply.send({
        message: 'Tipo de dados atualizado com sucesso',
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

      const data = await this.prisma.tipoDados.delete({
        where: { id: validId }
      })

      reply.send({
        message: 'Tipo de dados excluído com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
