import type { PrismaClient } from '@prisma/client';
import { BaseController } from './base.controller.js';
import type { CreateSistema, UpdateSistema } from '../schemas/sistema.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export class SistemaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'sistema')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply): Promise < void> {
    try {
      const empresaId = this.getEmpresaFilter(request)

      const data = await this.prisma.sistema.findMany({
        where: empresaId ? { empresaId } : undefined,
        select: {
          id: true,
          nome: true,
          descricao: true,
          repositorio: true,
          bancos: {
            select: {
              id: true,
              nome: true
            }
          },
          _count: {
            select: {
              bancos: true
            }
          }
        }
      })

      return reply.send({
        message: 'Sistemas encontrados',
        data
      })
    } catch(error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply): Promise < void> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.sistema.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          descricao: true,
          repositorio: true,
          bancos: {
            select: {
              id: true,
              nome: true,
              tabelas: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        }
      })

      if(!data) {
        return reply.status(404).send({
          error: 'Sistema não encontrado'
        })
      }

      return reply.send({
        message: 'Sistema encontrado',
        data
      })
    } catch(error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise < void> {
    try {
      const body = request.body as CreateSistema

      const data = await this.prisma.sistema.create({
        data: body,
        select: {
          id: true,
          nome: true,
          descricao: true,
          repositorio: true
        }
      })

      console.log("🚀 ~ SistemaController ~ create ~ data:", data)

      return reply.status(201).send({
        message: 'Sistema criado com sucesso',
        data
      })
    } catch(error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise < void> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as UpdateSistema

      const data = await this.prisma.sistema.update({
        where: { id: validId },
        data: body,
        select: {
          id: true,
          nome: true,
          descricao: true,
          repositorio: true
        }
      })

      return reply.send({
        message: 'Sistema atualizado com sucesso',
        data
      })
    } catch(error) {
      this.handleError(reply, error)
    }
  }

  async delete (request: FastifyRequest, reply: FastifyReply): Promise < void> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      // Verificar se o sistema está sendo usado por algum banco
      const bancosUsandoSistema = await this.prisma.banco.count({
        where: { sistemaId: validId }
      })

      if(bancosUsandoSistema > 0) {
    return reply.status(400).send({
      error: 'BadRequest',
      message: `Não é possível deletar o sistema. Ele está sendo usado por ${bancosUsandoSistema} banco(s).`
    })
  }

  const data = await this.prisma.sistema.delete({
    where: { id: validId },
    select: {
      id: true,
      nome: true,
      descricao: true,
      repositorio: true
    }
  })

  return reply.send({
    message: 'Sistema excluído com sucesso',
    data
  })
} catch (error) {
  this.handleError(reply, error)
}
  }
}
