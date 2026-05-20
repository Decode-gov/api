import type { PrismaClient } from '@prisma/client'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { createWriteStream, createReadStream, existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import { BaseController } from './base.controller.js'

export class ArquivoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'arquivo')
  }

  async findMany(request: FastifyRequest, reply: FastifyReply) {
    try {
      const empresaId = this.getEmpresaFilter(request)

      const rows = await (this.prisma as any).arquivo.findMany({
        where: { ...(empresaId ? { empresaId } : {}), ativo: true },
        orderBy: { createdAt: 'desc' },
      })

      return { data: rows.map(this.serialize) }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const row = await (this.prisma as any).arquivo.findUnique({ where: { id: validId } })
      if (!row) return (reply as any).notFound('Arquivo não encontrado')

      return { data: this.serialize(row) }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file()
      if (!data) return (reply as any).badRequest('Nenhum arquivo enviado')

      const empresaId = this.resolveEmpresaIdForCreate(request, request.query)
      const user = (request as any).user
      const usuarioId: string = user?.userId

      const ext = extname(data.filename) || ''
      const nomeArquivo = `${randomUUID()}${ext}`
      const dir = join(process.cwd(), 'uploads', empresaId)
      mkdirSync(dir, { recursive: true })
      const destPath = join(dir, nomeArquivo)

      const isImage = data.mimetype.startsWith('image/')

      if (isImage) {
        const transformer = sharp()
          .resize({ width: 1920, withoutEnlargement: true })
        await pipeline(data.file, transformer, createWriteStream(destPath))
      } else {
        await pipeline(data.file, createWriteStream(destPath))
      }

      if ((data.file as any).truncated) {
        return reply.code(413).send({ error: 'Arquivo muito grande' })
      }

      const { size: tamanhoBytes } = await import('node:fs').then(fs =>
        new Promise<{ size: number }>((res, rej) =>
          fs.stat(destPath, (err, s) => err ? rej(err) : res({ size: s.size }))
        )
      )

      const arquivo = await (this.prisma as any).arquivo.create({
        data: {
          nomeOriginal: data.filename,
          nomeArquivo,
          diretorioArquivo: destPath,
          tipoMime: data.mimetype,
          tamanhoBytes,
          empresaId,
          usuarioId,
        },
      })

      reply.code(201)
      return { data: this.serialize(arquivo) }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(405).send({ error: 'Método não suportado' })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const row = await (this.prisma as any).arquivo.findUnique({ where: { id: validId } })
      if (!row) return (reply as any).notFound('Arquivo não encontrado')

      if (existsSync(row.diretorioArquivo)) {
        unlinkSync(row.diretorioArquivo)
      }

      await (this.prisma as any).arquivo.delete({ where: { id: validId } })

      return { message: 'Arquivo removido com sucesso' }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async download(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const row = await (this.prisma as any).arquivo.findUnique({ where: { id: validId } })
      if (!row) return (reply as any).notFound('Arquivo não encontrado')

      if (!existsSync(row.diretorioArquivo)) {
        return (reply as any).notFound('Arquivo não encontrado em disco')
      }

      return reply
        .type(row.tipoMime)
        .header('Content-Disposition', `attachment; filename="${row.nomeOriginal}"`)
        .send(createReadStream(row.diretorioArquivo))
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  private serialize(row: any) {
    return {
      ...row,
      tamanhoBytes: Number(row.tamanhoBytes),
      createdAt: row.createdAt?.toISOString() ?? null,
      updatedAt: row.updatedAt?.toISOString() ?? null,
    }
  }
}
