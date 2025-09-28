import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  repositorioDocumentoParamsSchema,
  listRepositoriosQuerySchema,
  createRepositorioDocumentoSchema,
  updateRepositorioDocumentoSchema,
  uploadDocumentoSchema,
  repositorioDocumentoResponseSchema,
  listRepositoriosResponseSchema,
  uploadDocumentoResponseSchema,
  type RepositorioDocumentoParams,
  type ListRepositoriosQuery,
  type CreateRepositorioDocumentoBody,
  type UpdateRepositorioDocumentoBody,
  type UploadDocumentoBody,
  type RepositorioDocumentoResponse,
  type ListRepositoriosResponse,
  type UploadDocumentoResponse
} from '../schemas/repositorio-documento.js'
import { RepositorioDocumentoController } from '../controllers/repositorio-documento.controller.js'

export async function repositorioDocumentoZodRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new RepositorioDocumentoController(fastify.prisma)

  // GET /repositorios-documento - Listar repositórios
  server.get<{
    Querystring: ListRepositoriosQuery
    Reply: ListRepositoriosResponse
  }>('/', {
    schema: {
      description: 'Listar repositórios de documentos com filtros opcionais',
      tags: ['Repositórios de Documento'],
      summary: 'Listar repositórios',
      querystring: listRepositoriosQuerySchema,
      response: {
        200: listRepositoriosResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request as any, reply)
  })

  // GET /repositorios-documento/:id - Buscar repositório por ID
  server.get<{
    Params: RepositorioDocumentoParams
    Reply: RepositorioDocumentoResponse
  }>('/:id', {
    schema: {
      description: 'Buscar repositório de documentos por ID',
      tags: ['Repositórios de Documento'],
      summary: 'Buscar repositório por ID',
      params: repositorioDocumentoParamsSchema,
      response: {
        200: repositorioDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request as any, reply)
  })

  // POST /repositorios-documento - Criar novo repositório
  server.post<{
    Body: CreateRepositorioDocumentoBody
    Reply: RepositorioDocumentoResponse
  }>('/', {
    schema: {
      description: 'Criar novo repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Criar repositório',
      body: createRepositorioDocumentoSchema,
      response: {
        201: repositorioDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(201)
    return controller.create(request as any, reply)
  })

  // PUT /repositorios-documento/:id - Atualizar repositório
  server.put<{
    Params: RepositorioDocumentoParams
    Body: UpdateRepositorioDocumentoBody
    Reply: RepositorioDocumentoResponse
  }>('/:id', {
    schema: {
      description: 'Atualizar repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Atualizar repositório',
      params: repositorioDocumentoParamsSchema,
      body: updateRepositorioDocumentoSchema,
      response: {
        200: repositorioDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.update(request as any, reply)
  })

  // DELETE /repositorios-documento/:id - Deletar repositório
  server.delete<{
    Params: RepositorioDocumentoParams
    Reply: { message: string }
  }>('/:id', {
    schema: {
      description: 'Deletar repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Deletar repositório',
      params: repositorioDocumentoParamsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.delete(request as any, reply)
  })

  // POST /repositorios-documento/:id/upload - Upload de documento
  server.post<{
    Params: RepositorioDocumentoParams
    Body: UploadDocumentoBody
    Reply: UploadDocumentoResponse
  }>('/:id/upload', {
    schema: {
      description: 'Upload de documento para o repositório',
      tags: ['Repositórios de Documento'],
      summary: 'Upload documento',
      params: repositorioDocumentoParamsSchema,
      body: uploadDocumentoSchema,
      response: {
        201: uploadDocumentoResponseSchema
      }
    }
  }, async (request, reply) => {
    reply.status(201)
    return controller.uploadDocumento(request as any, reply)
  })
}
