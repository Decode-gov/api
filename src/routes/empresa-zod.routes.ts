import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { EmpresaController } from '../controllers/empresa.controller.js'
import { adminMiddleware } from '../middleware/auth.js'
import {
  CreateEmpresaSchema,
  UpdateEmpresaSchema,
  EmpresaResponseSchema,
  EmpresasListResponseSchema,
  EmpresaParamsSchema
} from '../schemas/empresa.js'
import { ErrorSchema } from '../schemas/common.js'

export async function empresaZodRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new EmpresaController(app.prisma)

  // GET /empresas - Listar todas as empresas
  app.get('/', {
    preHandler: adminMiddleware,
    schema: {
      description: 'Listar todas as empresas cadastradas. Acesso restrito a administradores.',
      tags: ['Empresas'],
      summary: 'Listar empresas',
      security: [{ bearerAuth: [] }],
      response: {
        200: EmpresasListResponseSchema,
        401: ErrorSchema,
        403: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.findMany(request, reply)
  })

  // GET /empresas/:id - Buscar empresa por ID
  app.get('/:id', {
    preHandler: adminMiddleware,
    schema: {
      description: 'Buscar empresa específica por ID. Acesso restrito a administradores.',
      tags: ['Empresas'],
      summary: 'Buscar empresa por ID',
      security: [{ bearerAuth: [] }],
      params: EmpresaParamsSchema,
      response: {
        200: EmpresaResponseSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.findById(request, reply)
  })

  // POST /empresas - Criar nova empresa
  app.post('/', {
    preHandler: adminMiddleware,
    schema: {
      description: 'Criar nova empresa no sistema. Acesso restrito a administradores.',
      tags: ['Empresas'],
      summary: 'Criar empresa',
      security: [{ bearerAuth: [] }],
      body: CreateEmpresaSchema,
      response: {
        201: EmpresaResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.create(request, reply)
  })

  // PUT /empresas/:id - Atualizar empresa
  app.put('/:id', {
    preHandler: adminMiddleware,
    schema: {
      description: 'Atualizar dados de uma empresa. Acesso restrito a administradores.',
      tags: ['Empresas'],
      summary: 'Atualizar empresa',
      security: [{ bearerAuth: [] }],
      params: EmpresaParamsSchema,
      body: UpdateEmpresaSchema,
      response: {
        200: EmpresaResponseSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.update(request, reply)
  })

  // DELETE /empresas/:id - Excluir empresa (soft delete)
  app.delete('/:id', {
    preHandler: adminMiddleware,
    schema: {
      description: 'Excluir empresa (soft delete — registra deletedAt). Acesso restrito a administradores.',
      tags: ['Empresas'],
      summary: 'Excluir empresa',
      security: [{ bearerAuth: [] }],
      params: EmpresaParamsSchema,
      response: {
        200: EmpresaResponseSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    await controller.delete(request, reply)
  })
}
