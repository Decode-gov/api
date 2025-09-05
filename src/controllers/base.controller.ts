import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { idSchema } from '../types/common.js'

export abstract class BaseController {
  protected constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string
  ) { }

  protected validateId(id: string): string {
    const result = idSchema.safeParse(id)
    if (!result.success) {
      throw new Error(result.error.issues[0].message)
    }
    return result.data
  }

  protected validatePagination(query: any) {
    const skip = query?.skip ? Number(query.skip) : 0
    const take = query?.take ? Math.min(Number(query.take), 100) : 20
    let orderBy = query?.orderBy

    // Se orderBy for uma string JSON, fazer parse
    if (typeof orderBy === 'string') {
      try {
        orderBy = JSON.parse(orderBy)
      } catch {
        orderBy = { id: 'asc' }
      }
    } else if (!orderBy) {
      orderBy = { id: 'asc' }
    }

    return { skip, take, orderBy }
  }

  protected handleError(reply: FastifyReply, error: any) {
    console.error('Controller Error:', error)

    if (error.code === 'P2025') {
      return reply.notFound('Registro não encontrado')
    }
    if (error.code === 'P2002') {
      return reply.conflict('Violação de constraint única')
    }
    if (error.message && error.message.includes('inválido')) {
      return reply.badRequest(error.message)
    }

    reply.log.error(error)
    return reply.internalServerError('Erro interno do servidor')
  }

  abstract findMany(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract findById(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract create(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract update(request: FastifyRequest, reply: FastifyReply): Promise<any>
  abstract delete(request: FastifyRequest, reply: FastifyReply): Promise<any>
}
