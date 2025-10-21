import { z } from 'zod'

// Schema para parâmetros de rota
export const CriticidadeRegulatoriaParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para query params
export const CriticidadeRegulatoriaQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  regulacaoId: z.string().uuid({ message: 'regulacaoId deve ser um UUID válido' }).optional(),
  regraQualidadeId: z.string().uuid({ message: 'regraQualidadeId deve ser um UUID válido' }).optional()
})

// Schema para criação
export const CreateCriticidadeRegulatoriaSchema = z.object({
  regulacaoId: z.string().uuid({ message: 'regulacaoId deve ser um UUID válido' }).describe('ID da regulação'),
  regraQualidadeId: z.string().uuid({ message: 'regraQualidadeId deve ser um UUID válido' }).describe('ID da regra de qualidade'),
  grauCriticidade: z.string().min(1, { message: 'Grau de criticidade é obrigatório' }).describe('Grau de criticidade (ex: Alta, Média, Baixa)')
})

// Schema para atualização
export const UpdateCriticidadeRegulatoriaSchema = z.object({
  regulacaoId: z.string().uuid({ message: 'regulacaoId deve ser um UUID válido' }).optional(),
  regraQualidadeId: z.string().uuid({ message: 'regraQualidadeId deve ser um UUID válido' }).optional(),
  grauCriticidade: z.string().min(1, { message: 'Grau de criticidade é obrigatório' }).optional()
})

// Schema de criticidade com relacionamentos
export const CriticidadeRegulatoriaWithRelationsSchema = z.object({
  id: z.string().uuid(),
  regulacaoId: z.string().uuid(),
  regraQualidadeId: z.string().uuid(),
  grauCriticidade: z.string(),
  regulacao: z.object({
    id: z.string().uuid(),
    epigrafe: z.string(),
    orgao: z.string(),
    descricao: z.string()
  }),
  regraQualidade: z.object({
    id: z.string().uuid(),
    descricao: z.string(),
    dimensao: z.object({
      id: z.string().uuid(),
      nome: z.string()
    })
  }),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema para resposta única
export const CriticidadeRegulatoriaResponseSchema = z.object({
  data: CriticidadeRegulatoriaWithRelationsSchema
})

// Schema para lista
export const CriticidadesRegulatoriasListResponseSchema = z.object({
  data: z.array(CriticidadeRegulatoriaWithRelationsSchema)
})

// Tipos derivados
export type CriticidadeRegulatoriaParams = z.infer<typeof CriticidadeRegulatoriaParamsSchema>
export type CriticidadeRegulatoriaQueryParams = z.infer<typeof CriticidadeRegulatoriaQueryParamsSchema>
export type CreateCriticidadeRegulatoria = z.infer<typeof CreateCriticidadeRegulatoriaSchema>
export type UpdateCriticidadeRegulatoria = z.infer<typeof UpdateCriticidadeRegulatoriaSchema>
export type CriticidadeRegulatoriaWithRelations = z.infer<typeof CriticidadeRegulatoriaWithRelationsSchema>
