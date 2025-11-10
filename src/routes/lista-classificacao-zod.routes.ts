import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ListaClassificacaoController } from '../controllers/lista-classificacao.controller.js'
import { PoliticaInternaSchema } from '../schemas/politica-interna.js'

export const ListaClassificacaoSchema = z.object({
  id: z.uuid(),
  classificacao: z.string(),
  descricao: z.string(),
  politicaId: z.uuid(),
  politica: PoliticaInternaSchema,
  createdAt: z.coerce.date().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

export async function listaClassificacaoRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ListaClassificacaoController(app.prisma)

  // Schemas Zod

  const QueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.string().optional(),
  })

  const ParamsSchema = z.object({
    id: z.uuid()
  })

  const CreateListaClassificacaoSchema = z.object({
    classificacao: z.string().min(1, 'Classificação da informação é obrigatória'),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' })
  })

  const UpdateListaClassificacaoSchema = z.object({
    classificacao: z.string().min(1).optional(),
    descricao: z.string().min(1).optional(),
    politicaId: z.uuid().optional()
  })

  const ResponseSchema = z.object({
    data: ListaClassificacaoSchema
  })

  const ListResponseSchema = z.object({
    data: z.array(ListaClassificacaoSchema)
  })

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  const DeleteResponseSchema = z.object({
    message: z.string()
  })

  // GET /listas-classificacao - Listar listas de classificação
  app.get('/', {
    schema: {
      description: 'Listar todas as listas de classificação de segurança do sistema',
      tags: ['Listas de Classificação'],
      summary: 'Listar listas de classificação',
      querystring: QueryParamsSchema,
      response: {
        200: ListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /listas-classificacao/:id - Buscar lista por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar lista de classificação por ID',
      tags: ['Listas de Classificação'],
      summary: 'Buscar lista por ID',
      params: ParamsSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /listas-classificacao - Criar nova lista
  app.post('/', {
    schema: {
      description: 'Criar uma nova lista de classificação de segurança',
      tags: ['Listas de Classificação'],
      summary: 'Criar lista de classificação',
      body: CreateListaClassificacaoSchema,
      response: {
        201: ResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /listas-classificacao/:id - Atualizar lista
  app.put('/:id', {
    schema: {
      description: 'Atualizar uma lista de classificação existente',
      tags: ['Listas de Classificação'],
      summary: 'Atualizar lista de classificação',
      params: ParamsSchema,
      body: UpdateListaClassificacaoSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /listas-classificacao/:id - Deletar lista
  app.delete('/:id', {
    schema: {
      description: 'Deletar uma lista de classificação',
      tags: ['Listas de Classificação'],
      summary: 'Deletar lista de classificação',
      params: ParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
