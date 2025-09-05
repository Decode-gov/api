import type { FastifyInstance } from 'fastify'
import { RepositorioDocumentoController } from '../controllers/repositorio-documento.controller.js'

export async function repositorioDocumentoRoutes(fastify: FastifyInstance) {
  const controller = new RepositorioDocumentoController(fastify.prisma)

  // GET /repositorios-documento - Listar repositórios
  fastify.get('/', {
    schema: {
      description: 'Listar repositórios de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Listar repositórios',
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'number', minimum: 0 },
          take: { type: 'number', minimum: 1, maximum: 100 },
          tipo: { type: 'string', enum: ['LOCAL', 'NUVEM', 'HIBRIDO'] },
          nome: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findMany(request as any, reply)
  })

  // GET /repositorios-documento/:id - Buscar repositório por ID
  fastify.get('/:id', {
    schema: {
      description: 'Buscar repositório de documentos por ID',
      tags: ['Repositórios de Documento'],
      summary: 'Buscar repositório',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    reply.status(200)
    return controller.findById(request as any, reply)
  })

  // POST /repositorios-documento - Criar novo repositório
  fastify.post('/', {
    schema: {
      description: 'Criar novo repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Criar repositório',
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          tipo: { type: 'string', enum: ['LOCAL', 'NUVEM', 'HIBRIDO'] },
          caminho: { type: 'string' },
          configuracao: { type: 'string' }
        },
        required: ['nome', 'tipo', 'caminho']
      }
    }
  }, async (request, reply) => {
    return controller.create(request as any, reply)
  })

  // PUT /repositorios-documento/:id - Atualizar repositório
  fastify.put('/:id', {
    schema: {
      description: 'Atualizar repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Atualizar repositório',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 1 },
          descricao: { type: 'string' },
          tipo: { type: 'string', enum: ['LOCAL', 'NUVEM', 'HIBRIDO'] },
          caminho: { type: 'string' },
          configuracao: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    return controller.update(request as any, reply)
  })

  // DELETE /repositorios-documento/:id - Deletar repositório
  fastify.delete('/:id', {
    schema: {
      description: 'Deletar repositório de documentos',
      tags: ['Repositórios de Documento'],
      summary: 'Deletar repositório',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    return controller.delete(request as any, reply)
  })

  // POST /repositorios-documento/:id/upload - Upload de documento
  fastify.post('/:id/upload', {
    schema: {
      description: 'Upload de documento para o repositório',
      tags: ['Repositórios de Documento'],
      summary: 'Upload documento',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          nomeArquivo: { type: 'string' },
          conteudo: { type: 'string' },
          metadados: { type: 'string' }
        },
        required: ['nomeArquivo', 'conteudo']
      }
    }
  }, async (request, reply) => {
    return controller.uploadDocumento(request as any, reply)
  })
}
