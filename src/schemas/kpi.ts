import { z } from 'zod'
import { TimestampsSchema } from './common.js'

// Schema base do KPI
export const KpiSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  comunidadeId: z.string().uuid().nullable(),
  processoId: z.string().uuid().nullable(),
  ...TimestampsSchema
})

// Schema para criação de KPI
export const CreateKpiSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  comunidadeId: z.string().uuid().optional(),
  processoId: z.string().uuid().optional()
})

// Schema para atualização de KPI
export const UpdateKpiSchema = z.object({
  nome: z.string().min(1).optional(),
  comunidadeId: z.string().uuid().optional(),
  processoId: z.string().uuid().optional()
})

// Schema para KPI com relacionamentos
export const KpiWithRelationsSchema = KpiSchema.extend({
  comunidade: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }).nullable(),
  processo: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }).nullable()
})

// Schema para resposta com KPI
export const KpiResponseSchema = z.object({
  message: z.string(),
  data: KpiSchema
})

// Schema para lista de KPIs
export const KpisListResponseSchema = z.object({
  message: z.string(),
  data: z.array(KpiWithRelationsSchema)
})

// Schema para resposta de KPI com relacionamentos
export const KpiWithRelationsResponseSchema = z.object({
  message: z.string(),
  data: KpiWithRelationsSchema
})
