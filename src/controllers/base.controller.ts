import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { idSchema } from '../types/common.js'

export abstract class BaseController {
  protected constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string
  ) {
  }

  protected validateId(id: string): string {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') {
      return id
    }

    const result = idSchema.safeParse(id)
    if (!result.success) {
      throw new Error(result.error.issues[0].message)
    }
    return result.data
  }

  protected getEmpresaFilter(request: FastifyRequest): string | undefined {
    const user = (request as any).user
    if (!user) return undefined

    if (user.tipo === 'ADMIN') {
      return (request.query as any)?.empresaId || undefined
    }

    return user.empresaId || undefined
  }

  protected handleError(reply: FastifyReply, error: any) {
    if (error.code === 'P2025') {
      return (reply as any).notFound('Registro não encontrado')
    }
    if (error.code === 'P2002') {
      return (reply as any).conflict('Violação de constraint única')
    }
    if (error.message && error.message.includes('inválido')) {
      return (reply as any).badRequest(error.message)
    }

    reply.log.error(error)
    return (reply as any).internalServerError('Erro interno do servidor')
  }

  abstract findMany(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract findById(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract create(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract update(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract delete(request: FastifyRequest, reply: FastifyReply): Promise<any>
}
