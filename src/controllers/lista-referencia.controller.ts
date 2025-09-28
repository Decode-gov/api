import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface ListaReferenciaBody {
  nome: string
  descricao?: string
  valores: string // JSON array
  tabelaId?: string
  colunaId?: string
}

export class ListaReferenciaController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'listaReferencia')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await (this.prisma as any).listaReferencia.findMany({
        skip,
        take,
        orderBy: typeof orderBy === 'object' ? orderBy : { nome: 'asc' },
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })

      return reply.send({
        message: 'Listas de referência encontradas',
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

      const data = await (this.prisma as any).listaReferencia.findUnique({
        where: { id: validId },
        include: {
          tabela: true,
          coluna: true
        }
      })

      if (!data) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Lista de referência não encontrada'
        })
      }

      return reply.send({
        message: 'Lista de referência encontrada',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: ListaReferenciaBody }>, reply: FastifyReply) {
    try {
      const { nome, descricao, valores, tabelaId, colunaId } = request.body

      // Validar e sanitizar valores JSON
      const valoresValidados = this.validarValores(valores)
      if (!valoresValidados.success) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: valoresValidados.error
        })
      }

      // Validar se tabela ou coluna existem (se fornecidos)
      if (tabelaId) {
        const tabela = await this.prisma.tabela.findUnique({
          where: { id: tabelaId }
        })
        if (!tabela) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Tabela não encontrada'
          })
        }
      }

      if (colunaId) {
        const coluna = await this.prisma.coluna.findUnique({
          where: { id: colunaId }
        })
        if (!coluna) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Coluna não encontrada'
          })
        }
      }

      const lista = await (this.prisma as any).listaReferencia.create({
        data: {
          nome,
          descricao,
          valores: JSON.stringify(valoresValidados.valores),
          tabelaId,
          colunaId
        },
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })

      return reply.status(201).send({
        message: 'Lista de referência criada com sucesso',
        data: lista
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: Partial<ListaReferenciaBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const validId = this.validateId(id)
      const updateData = { ...request.body }

      // Validar valores se fornecidos
      if (updateData.valores) {
        const valoresValidados = this.validarValores(updateData.valores)
        if (!valoresValidados.success) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: valoresValidados.error
          })
        }
        updateData.valores = JSON.stringify(valoresValidados.valores)
      }

      const data = await (this.prisma as any).listaReferencia.update({
        where: { id: validId },
        data: updateData,
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })

      return reply.send({
        message: 'Lista de referência atualizada com sucesso',
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

      const data = await (this.prisma as any).listaReferencia.delete({
        where: { id: validId }
      })

      return reply.send({
        message: 'Lista de referência excluída com sucesso',
        data
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  private validarValores(valores: string): { success: boolean; valores?: string[]; error?: string } {
    try {
      let parsedValores: any

      // Tentar fazer parse do JSON
      if (typeof valores === 'string') {
        parsedValores = JSON.parse(valores)
      } else {
        parsedValores = valores
      }

      // Verificar se é um array
      if (!Array.isArray(parsedValores)) {
        return {
          success: false,
          error: 'Valores devem ser fornecidos como um array JSON'
        }
      }

      // Converter todos os valores para string e remover duplicatas
      const valoresString = parsedValores.map(v => String(v).trim())
      const valoresUnicos = [...new Set(valoresString)]

      // Verificar se há valores vazios
      if (valoresUnicos.some(v => v === '')) {
        return {
          success: false,
          error: 'Valores não podem estar vazios'
        }
      }

      // Verificar se houve duplicatas removidas
      if (valoresString.length !== valoresUnicos.length) {
        // Valores duplicados foram removidos automaticamente
      }

      return {
        success: true,
        valores: valoresUnicos
      }
    } catch (error) {
      return {
        success: false,
        error: 'Formato JSON inválido para valores'
      }
    }
  }
}
