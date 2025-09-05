import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'

interface AuditableRequest extends FastifyRequest {
  auditData?: {
    userId?: string
    action: string
    entity: string
    entityId?: string
    dadosAntes?: any
    dadosDepois?: any
  }
}

export class AuditMiddleware {
  constructor(private prisma: PrismaClient) { }

  // Plugin para registrar middleware de auditoria
  static async register(fastify: FastifyInstance) {
    const auditMiddleware = new AuditMiddleware(fastify.prisma)

    // Hook para capturar dados antes da operação
    fastify.addHook('preHandler', async (request: AuditableRequest, reply) => {
      const method = request.method
      const url = request.url

      // Identificar se é uma operação auditável
      if (auditMiddleware.isAuditableOperation(method, url)) {
        const entityInfo = auditMiddleware.extractEntityInfo(url)

        request.auditData = {
          action: auditMiddleware.mapMethodToAction(method),
          entity: entityInfo.entity,
          entityId: entityInfo.entityId
        }

        // Para UPDATE e DELETE, capturar dados antes da operação
        if ((method === 'PUT' || method === 'DELETE') && entityInfo.entityId) {
          try {
            const dadosAntes = await auditMiddleware.getDadosAntes(entityInfo.entity, entityInfo.entityId)
            request.auditData.dadosAntes = dadosAntes
          } catch (error) {
            // Log error but don't fail the request
            console.warn('Erro ao capturar dados para auditoria:', error)
          }
        }
      }
    })

    // Hook para registrar auditoria após operação
    fastify.addHook('onSend', async (request: AuditableRequest, reply, payload) => {
      if (request.auditData && reply.statusCode < 400) {
        try {
          await auditMiddleware.registrarAuditoria(request, reply, payload)
        } catch (error) {
          console.error('Erro ao registrar auditoria:', error)
          // Não falhar a request por causa da auditoria
        }
      }
    })
  }

  private isAuditableOperation(method: string, url: string): boolean {
    // Entidades críticas que devem ser auditadas
    const entidadesCriticas = [
      'usuarios', 'sistemas', 'tabelas', 'colunas', 'definicoes',
      'necessidades-informacao', 'papeis', 'classificacoes-informacao',
      'tipos-dados', 'regras-qualidade', 'regulacoes-completas'
    ]

    const isWriteOperation = ['POST', 'PUT', 'DELETE'].includes(method)
    const isEntityOperation = entidadesCriticas.some(entity =>
      url.includes(`/${entity}`) || url.includes(`/${entity}/`)
    )

    return isWriteOperation && isEntityOperation
  }

  private extractEntityInfo(url: string): { entity: string; entityId?: string } {
    const pathParts = url.split('/').filter(part => part.length > 0)

    // Formato: /api/entity ou /entity
    let entityIndex = pathParts.findIndex(part =>
      !['api', 'v1'].includes(part.toLowerCase())
    )

    if (entityIndex === -1) entityIndex = 0

    const entity = pathParts[entityIndex] || 'unknown'
    const entityId = pathParts[entityIndex + 1] || undefined

    return { entity, entityId }
  }

  private mapMethodToAction(method: string): string {
    const actionMap: { [key: string]: string } = {
      'POST': 'CREATE',
      'PUT': 'UPDATE',
      'PATCH': 'UPDATE',
      'DELETE': 'DELETE'
    }
    return actionMap[method] || 'UNKNOWN'
  }

  private async getDadosAntes(entity: string, entityId: string): Promise<any> {
    // Mapear nome da entidade para modelo Prisma
    const modelMap: { [key: string]: string } = {
      'usuarios': 'usuario',
      'sistemas': 'sistema',
      'tabelas': 'tabela',
      'colunas': 'coluna',
      'definicoes': 'definicao',
      'necessidades-informacao': 'necessidadeInformacao',
      'papeis': 'papel',
      'classificacoes-informacao': 'classificacaoInformacao',
      'tipos-dados': 'tipoDados',
      'regras-qualidade': 'regraQualidade',
      'regulacoes-completas': 'regulacaoCompleta'
    }

    const modelName = modelMap[entity]
    if (!modelName || !(this.prisma as any)[modelName]) {
      return null
    }

    try {
      return await (this.prisma as any)[modelName].findUnique({
        where: { id: entityId }
      })
    } catch (error) {
      console.warn(`Erro ao buscar dados de ${entity}:`, error)
      return null
    }
  }

  private async registrarAuditoria(
    request: AuditableRequest,
    reply: FastifyReply,
    payload: any
  ): Promise<void> {
    if (!request.auditData) return

    const { action, entity, entityId, dadosAntes } = request.auditData

    // Extrair dados depois da operação do payload
    let dadosDepois = null
    try {
      if (typeof payload === 'string') {
        const parsedPayload = JSON.parse(payload)
        dadosDepois = parsedPayload.data || parsedPayload
      } else if (payload && typeof payload === 'object') {
        dadosDepois = payload.data || payload
      }
    } catch (error) {
      // Payload não é JSON válido
    }

    // Capturar ID da entidade se não estava disponível antes
    const finalEntityId = entityId || dadosDepois?.id

    // Extrair userId do token JWT se disponível
    const userId = this.extractUserIdFromRequest(request)

    const auditData = {
      usuarioId: userId,
      acao: action,
      entidade: entity,
      entidadeId: finalEntityId,
      dadosAntes: dadosAntes ? JSON.stringify(dadosAntes) : null,
      dadosDepois: dadosDepois ? JSON.stringify(dadosDepois) : null,
      timestamp: new Date(),
      ip: request.ip,
      userAgent: request.headers['user-agent'] || null
    }

    await (this.prisma as any).logAuditoria.create({
      data: auditData
    })
  }

  private extractUserIdFromRequest(request: FastifyRequest): string | null {
    // Tentar extrair userId do JWT token
    try {
      const authorization = request.headers.authorization
      if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.substring(7)
        // Aqui você decodificaria o JWT token para extrair o userId
        // Por agora, vamos usar um placeholder
        return 'system-user' // ou extrair do token real
      }
    } catch (error) {
      // Falha silenciosa
    }

    // Fallback para userId via query params ou headers
    return (request.query as any)?.userId ||
      request.headers['x-user-id'] as string ||
      null
  }
}
