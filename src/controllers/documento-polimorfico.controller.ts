import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

export class DocumentoPolimorficoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'documentoPolimorfico')
  }

  // Método para anexar documentos a qualquer entidade
  async anexarDocumento(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as {
        entidadeId: string
        tipoEntidade: string
        nomeArquivo: string
        tamanhoBytes: bigint
        tipoArquivo: string
        caminhoArquivo: string
        descricao?: string
        metadados?: string
        checksum?: string
        versao?: number
      }

      const dados = await this.prisma.documentoPolimorfico.create({
        data: {
          entidadeId: body.entidadeId,
          tipoEntidade: body.tipoEntidade as any,
          nomeArquivo: body.nomeArquivo,
          tamanhoBytes: body.tamanhoBytes,
          tipoArquivo: body.tipoArquivo,
          caminhoArquivo: body.caminhoArquivo,
          descricao: body.descricao,
          metadados: body.metadados,
          checksum: body.checksum,
          versao: body.versao || 1
        }
      })

      reply.code(201)
      return { data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  // Método para listar documentos de uma entidade
  async listarDocumentosPorEntidade(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { entidadeId, tipoEntidade } = request.params as { entidadeId: string, tipoEntidade: string }
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const dados = await this.prisma.documentoPolimorfico.findMany({
        where: {
          entidadeId,
          tipoEntidade: tipoEntidade as any,
          ativo: true
        },
        skip,
        take,
        orderBy
      })

      return { data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  // Método para buscar um documento específico
  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const dados = await this.prisma.documentoPolimorfico.findUnique({
        where: { id: validId }
      })

      if (!dados) {
        return reply.notFound('Documento não encontrado')
      }

      return { data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  // Método para deletar um documento (soft delete)
  async deletarDocumento(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      // Soft delete - marca como inativo
      const dados = await this.prisma.documentoPolimorfico.update({
        where: { id: validId },
        data: { ativo: false }
      })

      return { message: 'Documento removido com sucesso', data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  // Implementações dos métodos abstratos do BaseController
  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)
      const query = request.query as any

      const where: any = { ativo: true }

      if (query.tipoEntidade) {
        where.tipoEntidade = query.tipoEntidade
      }
      if (query.entidadeId) {
        where.entidadeId = query.entidadeId
      }

      const dados = await this.prisma.documentoPolimorfico.findMany({
        where,
        skip,
        take,
        orderBy
      })

      return { data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    return this.anexarDocumento(request, reply)
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as any
      const validId = this.validateId(id)

      const dados = await this.prisma.documentoPolimorfico.update({
        where: { id: validId },
        data: body
      })

      return { data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      // Usar soft delete
      const dados = await this.prisma.documentoPolimorfico.update({
        where: { id: validId },
        data: { ativo: false }
      })

      return { message: 'Documento removido com sucesso', data: dados }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}