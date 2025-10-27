import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class PoliticaInternaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'politicaInterna')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.politicaInterna.findMany({
        skip,
        take,
        orderBy,
        include: {
          dominioDados: true,
          papeis: true,
          listaClassificacoes: true,
          listaDimensoes: true
        }
      })

      return { message: 'Políticas internas listadas com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.politicaInterna.findUnique({
        where: { id: validId },
        include: {
          dominioDados: true,
          papeis: true,
          listaClassificacoes: true,
          listaDimensoes: true
        }
      })

      if (!data) {
        return (reply as any).notFound('Política interna não encontrada')
      }

      return { message: 'Política interna encontrada com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any

      const data = await this.prisma.politicaInterna.create({
        data: body,
        include: {
          dominioDados: true
        }
      })

      reply.code(201)
      return { message: 'Política interna criada com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const body = request.body as any

      const data = await this.prisma.politicaInterna.update({
        where: { id: validId },
        data: body,
        include: {
          dominioDados: true
        }
      })

      return { message: 'Política interna atualizada com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.politicaInterna.delete({
        where: { id: validId }
      })

      return { message: 'Política interna excluída com sucesso', data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  private validarDatas(body: any): { success: boolean; error?: string } {
    try {
      const agora = new Date()

      // Validar data de criação
      if (body.dataCriacao) {
        const dataCriacao = new Date(body.dataCriacao)
        if (isNaN(dataCriacao.getTime())) {
          return { success: false, error: 'Data de criação inválida' }
        }
      }

      // Validar data de início de vigência
      if (body.dataInicioVigencia) {
        const dataInicio = new Date(body.dataInicioVigencia)
        if (isNaN(dataInicio.getTime())) {
          return { success: false, error: 'Data de início de vigência inválida' }
        }
      }

      // Validar data de término (se fornecida)
      if (body.dataTermino) {
        const dataTermino = new Date(body.dataTermino)
        if (isNaN(dataTermino.getTime())) {
          return { success: false, error: 'Data de término inválida' }
        }

        // Validar que data de término é posterior à data de início
        if (body.dataInicioVigencia) {
          const dataInicio = new Date(body.dataInicioVigencia)
          if (dataTermino <= dataInicio) {
            return {
              success: false,
              error: 'Data de término deve ser posterior à data de início de vigência'
            }
          }
        }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro na validação de datas' }
    }
  }
}
