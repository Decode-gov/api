import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  RepositorioDocumentoParamsSchema,
  RepositorioDocumentoQueryParamsSchema,
  CreateRepositorioDocumentoSchema,
  UpdateRepositorioDocumentoSchema,
  RepositorioDocumentoResponseSchema,
  RepositoriosDocumentoListResponseSchema,
  type RepositorioDocumentoParams,
  type CreateRepositorioDocumento,
  type UpdateRepositorioDocumento
} from '../schemas/repositorio-documento.js'
import { SuccessMessageSchema } from '../schemas/common.js'
import { RepositorioDocumentoController } from '../controllers/repositorio-documento.controller.js'

export async function repositorioDocumentoZodRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new RepositorioDocumentoController(fastify.prisma)

  // GET /repositorios-documento - Listar repositórios
  server.get('/', {
    schema: {
      description: 'Listar repositórios de documentos com filtros opcionais',
      tags: ['Repositórios de Documento'],
      summary: 'Listar repositórios',
      querystring: RepositorioDocumentoQueryParamsSchema,
      response: {
        200: RepositoriosDocumentoListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request, reply)
  })

  // GET /repositorios-documento/:id - Buscar repositório por ID
  server.get<{
    Params: RepositorioDocumentoParams
  }>('/:id', {
    schema: {
      description: 'Buscar repositório de documentos por ID',
      tags: ['Repositórios de Documento'],
      summary: 'Buscar repositório por ID',
      params: RepositorioDocumentoParamsSchema,
      response: {
        200: RepositorioDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request, reply)
  })

  // POST /repositorios-documento - Criar novo repositório
  server.post<{
    Body: CreateRepositorioDocumento
  }>('/', {
    schema: {
      description: 'Criar novo repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Criar repositório',
      body: CreateRepositorioDocumentoSchema,
      response: {
        201: RepositorioDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.create(request, reply)
  })

  // PUT /repositorios-documento/:id - Atualizar repositório
  server.put<{
    Params: RepositorioDocumentoParams
    Body: UpdateRepositorioDocumento
  }>('/:id', {
    schema: {
      description: 'Atualizar repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Atualizar repositório',
      params: RepositorioDocumentoParamsSchema,
      body: UpdateRepositorioDocumentoSchema,
      response: {
        200: RepositorioDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request, reply)
  })

  // DELETE /repositorios-documento/:id - Deletar repositório
  server.delete<{
    Params: RepositorioDocumentoParams
  }>('/:id', {
    schema: {
      description: 'Deletar repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Deletar repositório',
      params: RepositorioDocumentoParamsSchema,
      response: {
        200: SuccessMessageSchema
      }
    }
  }, async (request, reply) => {
    return controller.delete(request, reply)
  })
}
