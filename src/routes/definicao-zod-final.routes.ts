import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DefinicaoController } from '../controllers/definicao.controller.js'

export async function definicaoZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new DefinicaoController(app.prisma)

  // Schemas Zod
  const DefinicaoSchema = z.object({
    id: z.uuid(),
    termo: z.string(),
    definicao: z.string().min(1, 'Descrição é obrigatória'),
    sigla: z.string().nullable(),
    createdAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().nullable()
  })

  const QueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.string().optional(),
    search: z.string().optional()
  })

  const ParamsSchema = z.object({
    id: z.uuid()
  })

  const CreateDefinicaoSchema = z.object({
    termo: z.string().min(1, 'Termo é obrigatório'),
    definicao: z.string().min(1, 'Descrição é obrigatória'),
    sigla: z.string().optional()
  })

  const UpdateDefinicaoSchema = z.object({
    termo: z.string().min(1).optional(),
    definicao: z.string().optional(),
    sigla: z.string().optional()
  })

  const ResponseSchema = z.object({
    message: z.string(),
    data: DefinicaoSchema
  })

  const ListResponseSchema = z.object({
    message: z.string(),
    data: z.array(DefinicaoSchema)
  })

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  // GET /definicoes - Listar termos
  app.get('/', {
    schema: {
      description: 'Listar todas as termos do sistema',
      tags: ['Termos'],
      summary: 'Listar termos',
      querystring: QueryParamsSchema,
      response: {
        200: ListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /definicoes/:id - Buscar definição por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar definição específica por ID',
      tags: ['Termos'],
      summary: 'Buscar definição por ID',
      params: ParamsSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /definicoes - Criar definição
  app.post('/', {
    schema: {
      description: 'Criar nova definição no sistema',
      tags: ['Termos'],
      summary: 'Criar definição',
      body: CreateDefinicaoSchema,
      response: {
        201: ResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /definicoes/:id - Atualizar definição
  app.put('/:id', {
    schema: {
      description: 'Atualizar dados de uma definição específica',
      tags: ['Termos'],
      summary: 'Atualizar definição',
      params: ParamsSchema,
      body: UpdateDefinicaoSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /definicoes/:id - Deletar definição
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma definição do sistema',
      tags: ['Termos'],
      summary: 'Deletar definição',
      params: ParamsSchema,
      response: {
        200: z.object({ message: z.string() }),
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}

