import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface ParteEnvolvidaParams {
  id: string
}

interface ParteEnvolvidaQuery {
  skip?: number
  take?: number
  orderBy?: string
  search?: string
}

interface ParteEnvolvidaBody {
  nome: string
  descricao?: string
  contato: string
}

export class ParteEnvolvidaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'parteEnvolvida')
  }

  async findMany(request: FastifyRequest<{ Querystring: ParteEnvolvidaQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'nome', search } = request.query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (search) {
        where.OR = [
          { nome: { contains: search, mode: 'insensitive' } },
          { descricao: { contains: search, mode: 'insensitive' } },
          { contato: { contains: search, mode: 'insensitive' } }
        ]
      }

      const partes = await (this.prisma as any).parteEnvolvida.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' }
      })

      const total = await (this.prisma as any).parteEnvolvida.count({ where })

      return reply.status(200).send({
        message: 'Partes envolvidas encontradas',
        data: partes,
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

  async findById(request: FastifyRequest<{ Params: ParteEnvolvidaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const parte = await (this.prisma as any).parteEnvolvida.findUnique({
        where: { id }
      })

      if (!parte) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Parte envolvida não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Parte envolvida encontrada',
        data: parte
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: ParteEnvolvidaBody }>, reply: FastifyReply) {
    try {
      const { nome, descricao, contato } = request.body

      // Validar se já existe uma parte com o mesmo nome ou contato
      const existingParte = await (this.prisma as any).parteEnvolvida.findFirst({
        where: {
          OR: [
            { nome },
            { contato }
          ]
        }
      })

      if (existingParte) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Já existe uma parte envolvida com este nome ou contato'
        })
      }

      const parte = await (this.prisma as any).parteEnvolvida.create({
        data: {
          nome,
          descricao,
          contato
        }
      })

      return reply.status(201).send({
        message: 'Parte envolvida criada com sucesso',
        data: parte
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: ParteEnvolvidaParams; Body: Partial<ParteEnvolvidaBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const updateData = { ...request.body }
      if (Object.keys(updateData).length === 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      // Validar unicidade se estiver atualizando nome ou contato
      if (updateData.nome || updateData.contato) {
        const conditions: any[] = []
        if (updateData.nome) conditions.push({ nome: updateData.nome })
        if (updateData.contato) conditions.push({ contato: updateData.contato })

        const existingParte = await (this.prisma as any).parteEnvolvida.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              { OR: conditions }
            ]
          }
        })

        if (existingParte) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Já existe uma parte envolvida com este nome ou contato'
          })
        }
      }

      const parte = await (this.prisma as any).parteEnvolvida.update({
        where: { id },
        data: updateData
      })

      return reply.status(200).send({
        message: 'Parte envolvida atualizada com sucesso',
        data: parte
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: ParteEnvolvidaParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      await (this.prisma as any).parteEnvolvida.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Parte envolvida deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
