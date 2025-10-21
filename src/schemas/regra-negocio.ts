import { z } from 'zod'

// Schema para parâmetros de rota
export const RegraNegocioParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para query params
export const RegraNegocioQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  processoId: z.string().uuid({ message: 'processoId deve ser um UUID válido' }).optional()
})

// Schema para criação
export const CreateRegraNegocioSchema = z.object({
  processoId: z.string().uuid({ message: 'processoId deve ser um UUID válido' }).describe('ID do processo relacionado'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da regra')
})

// Schema para atualização
export const UpdateRegraNegocioSchema = z.object({
  processoId: z.string().uuid({ message: 'processoId deve ser um UUID válido' }).optional().describe('ID do processo relacionado'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição detalhada da regra')
})

// Schema de regra com relacionamentos
export const RegraNegocioWithRelationsSchema = z.object({
  id: z.string().uuid(),
  processoId: z.string().uuid(),
  descricao: z.string(),
  processo: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    descricao: z.string().nullable()
  }),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema para resposta única
export const RegraNegocioResponseSchema = z.object({
  message: z.string(),
  data: RegraNegocioWithRelationsSchema
})

// Schema para lista
export const RegrasNegocioListResponseSchema = z.object({
  message: z.string(),
  data: z.array(RegraNegocioWithRelationsSchema)
})

// Tipos derivados
export type RegraNegocioParams = z.infer<typeof RegraNegocioParamsSchema>
export type RegraNegocioQueryParams = z.infer<typeof RegraNegocioQueryParamsSchema>
export type CreateRegraNegocio = z.infer<typeof CreateRegraNegocioSchema>
export type UpdateRegraNegocio = z.infer<typeof UpdateRegraNegocioSchema>
export type RegraNegocioWithRelations = z.infer<typeof RegraNegocioWithRelationsSchema>
