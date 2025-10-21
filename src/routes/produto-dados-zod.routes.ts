import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ProdutoDadosController } from '../controllers/produto-dados.controller.js'

export async function produtoDadosRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new ProdutoDadosController(app.prisma)

  // Schemas Zod
  const ProdutoDadosSchema = z.object({
    id: z.uuid(),
    nome: z.string(),
    descricao: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
  })

  const QueryParamsSchema = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.string().optional()
  })

  const ParamsSchema = z.object({
    id: z.uuid()
  })

  const CreateProdutoDadosSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória')
  })

  const UpdateProdutoDadosSchema = z.object({
    nome: z.string().min(1).optional(),
    descricao: z.string().min(1).optional()
  })

  const ResponseSchema = z.object({
    data: ProdutoDadosSchema
  })

  const ListResponseSchema = z.object({
    data: z.array(ProdutoDadosSchema)
  })

  const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string()
  })

  const DeleteResponseSchema = z.object({
    message: z.string()
  })

  // GET /produtos-dados - Listar produtos
  app.get('/', {
    schema: {
      description: 'Listar todos os produtos de dados do sistema',
      tags: ['Produtos de Dados'],
      summary: 'Listar produtos de dados',
      querystring: QueryParamsSchema,
      response: {
        200: ListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /produtos-dados/:id - Buscar produto por ID
  app.get('/:id', {
    schema: {
      description: 'Buscar produto de dados por ID',
      tags: ['Produtos de Dados'],
      summary: 'Buscar produto por ID',
      params: ParamsSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /produtos-dados - Criar novo produto
  app.post('/', {
    schema: {
      description: 'Criar um novo produto de dados no sistema',
      tags: ['Produtos de Dados'],
      summary: 'Criar produto de dados',
      body: CreateProdutoDadosSchema,
      response: {
        201: ResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /produtos-dados/:id - Atualizar produto
  app.put('/:id', {
    schema: {
      description: 'Atualizar um produto de dados existente',
      tags: ['Produtos de Dados'],
      summary: 'Atualizar produto de dados',
      params: ParamsSchema,
      body: UpdateProdutoDadosSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /produtos-dados/:id - Deletar produto
  app.delete('/:id', {
    schema: {
      description: 'Deletar um produto de dados',
      tags: ['Produtos de Dados'],
      summary: 'Deletar produto de dados',
      params: ParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}
