import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { MfaController } from '../controllers/mfa.controller.js'
import {
  SetupMfaSchema,
  EnableMfaSchema,
  VerifyMfaSchema,
  DisableMfaSchema,
  MfaQuerySchema,
  SetupMfaResponseSchema,
  EnableMfaResponseSchema,
  VerifyMfaResponseSchema,
  DisableMfaResponseSchema,
  MfaListResponseSchema,
  MfaResponseSchema,
  MfaParamsSchema
} from '../schemas/mfa.js'
import { ErrorSchema } from '../schemas/common.js'

export async function mfaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /mfa - Listar configurações MFA
  app.get('/', {
    schema: {
      description: 'Listar configurações de MFA',
      tags: ['MFA/2FA'],
      summary: 'Listar configurações MFA',
      querystring: MfaQuerySchema,
      response: {
        200: MfaListResponseSchema
      }
    }
  }, async (request, reply) => {
    const controller = new MfaController(app.prisma)
    return controller.findMany(request as any, reply)
  })

  // GET /mfa/:id - Buscar configuração MFA por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar configuração MFA por ID',
      tags: ['MFA/2FA'],
      summary: 'Buscar configuração MFA',
      params: MfaParamsSchema,
      response: {
        200: MfaResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new MfaController(app.prisma)
    return controller.findById(request as any, reply)
  })

  // POST /mfa/setup - Configurar MFA
  app.post('/setup', {
    schema: {
      description: 'Configurar autenticação multi-fator para um usuário',
      tags: ['MFA/2FA'],
      summary: 'Configurar MFA',
      body: SetupMfaSchema,
      response: {
        201: SetupMfaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new MfaController(app.prisma)
    return controller.setup(request as any, reply)
  })

  // POST /mfa/enable - Ativar MFA com código de verificação
  app.post('/enable', {
    schema: {
      description: 'Ativar MFA após verificação do código',
      tags: ['MFA/2FA'],
      summary: 'Ativar MFA',
      body: EnableMfaSchema,
      response: {
        200: EnableMfaResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new MfaController(app.prisma)
    return controller.enable(request as any, reply)
  })

  // POST /mfa/verify - Verificar código MFA durante login
  app.post('/verify', {
    schema: {
      description: 'Verificar código MFA durante processo de login',
      tags: ['MFA/2FA'],
      summary: 'Verificar código MFA',
      body: VerifyMfaSchema,
      response: {
        200: VerifyMfaResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new MfaController(app.prisma)
    return controller.verify(request as any, reply)
  })

  // PUT /mfa/:id/disable - Desativar MFA
  app.put('/:id/disable', {
    schema: {
      description: 'Desativar configuração MFA',
      tags: ['MFA/2FA'],
      summary: 'Desativar MFA',
      params: MfaParamsSchema,
      body: DisableMfaSchema,
      response: {
        200: DisableMfaResponseSchema,
        400: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    const controller = new MfaController(app.prisma)
    return controller.disable(request as any, reply)
  })
}
