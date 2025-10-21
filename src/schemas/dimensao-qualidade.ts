import { z } from 'zod'

// Schema base da dimensão de qualidade
export const DimensaoQualidadeSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  descricao: z.string().nullable(),
  politicaId: z.uuid(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema com relacionamentos
export const DimensaoQualidadeWithRelationsSchema = DimensaoQualidadeSchema.extend({
  politica: z.object({
    id: z.uuid(),
    nome: z.string()
  }),
  regrasQualidade: z.array(z.object({
    id: z.uuid(),
    descricao: z.string()
  })).optional()
})

// Schema para criação
export const CreateDimensaoQualidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }),
  descricao: z.string().optional(),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' })
})

// Schema para atualização
export const UpdateDimensaoQualidadeSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().nullable().optional(),
  politicaId: z.uuid().optional()
})

// Schema para query params
export const DimensaoQualidadeQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  politicaId: z.uuid().optional()
})

// Schema para parâmetros de rota
export const DimensaoQualidadeParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para resposta individual
export const DimensaoQualidadeResponseSchema = z.object({
  data: DimensaoQualidadeWithRelationsSchema
})

// Schema para lista
export const DimensoesQualidadeListResponseSchema = z.object({
  data: z.array(DimensaoQualidadeWithRelationsSchema)
})

// Schema para resposta de delete
export const DimensaoQualidadeDeleteResponseSchema = z.object({
  data: DimensaoQualidadeSchema
})

// Schema para erro
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})