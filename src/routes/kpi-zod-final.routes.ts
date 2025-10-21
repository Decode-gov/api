import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { KpiController } from '../controllers/kpi.controller.js'
import { authMiddleware } from '../middleware/auth.js'

// Schemas Zod para validação
const KpiSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  comunidadeId: z.uuid().nullable(),
  processoId: z.uuid().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
})

const KpiWithRelationsSchema = KpiSchema.extend({
  comunidade: z.object({
    id: z.uuid(),
    nome: z.string()
  }).nullable(),
  processo: z.object({
    id: z.uuid(),
    nome: z.string()
  }).nullable()
})

const QueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  comunidadeId: z.uuid().optional(),
  processoId: z.uuid().optional()
})

const ParamsSchema = z.object({
  id: z.uuid()
})

const CreateKpiSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  comunidadeId: z.string().optional(),
  processoId: z.string().optional()
})

const UpdateKpiSchema = z.object({
  nome: z.string().min(1).optional(),
  comunidadeId: z.string().optional(),
  processoId: z.string().optional()
})

const ResponseSchema = z.object({
  message: z.string(),
  data: KpiWithRelationsSchema
})

const ListResponseSchema = z.object({
  message: z.string(),
  data: z.array(KpiWithRelationsSchema)
})

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})

const DeleteResponseSchema = z.object({
  message: z.string()
})

export async function kpiZodFinalRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new KpiController(app.prisma)

  // GET /kpis - Listar KPIs
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os KPIs do sistema com relacionamentos',
      tags: ['KPIs'],
      summary: 'Listar KPIs',
      querystring: QueryParamsSchema,
      response: {
        200: ListResponseSchema
      }
    }
  }, controller.findMany.bind(controller))

  // GET /kpis/:id - Buscar KPI por ID
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar KPI específico por ID com relacionamentos',
      tags: ['KPIs'],
      summary: 'Buscar KPI por ID',
      params: ParamsSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.findById.bind(controller))

  // POST /kpis - Criar KPI
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Criar novo KPI no sistema',
      tags: ['KPIs'],
      summary: 'Criar KPI',
      body: CreateKpiSchema,
      response: {
        201: ResponseSchema,
        400: ErrorResponseSchema
      }
    }
  }, controller.create.bind(controller))

  // PUT /kpis/:id - Atualizar KPI
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar dados de um KPI específico',
      tags: ['KPIs'],
      summary: 'Atualizar KPI',
      params: ParamsSchema,
      body: UpdateKpiSchema,
      response: {
        200: ResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.update.bind(controller))

  // DELETE /kpis/:id - Deletar KPI
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Deletar um KPI do sistema',
      tags: ['KPIs'],
      summary: 'Deletar KPI',
      params: ParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorResponseSchema
      }
    }
  }, controller.delete.bind(controller))
}

