import { z } from 'zod'

// Schema para parâmetros de rota
export const RegulacaoCompletaParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para query params
export const RegulacaoCompletaQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  orgao: z.string().optional(),
  ativo: z.coerce.boolean().optional()
})

// Schema para criação
export const CreateRegulacaoCompletaSchema = z.object({
  epigrafe: z.string().min(1, { message: 'Epígrafe é obrigatória' }).describe('Epígrafe da regulação'),
  orgao: z.string().min(1, { message: 'Órgão regulador é obrigatório' }).describe('Órgão regulador'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da regulação'),
  dataInicio: z.coerce.date({ message: 'Data de início inválida' }).describe('Data de início da vigência'),
  dataFim: z.coerce.date({ message: 'Data de fim inválida' }).optional().describe('Data de fim da vigência (opcional)')
})

// Schema para atualização
export const UpdateRegulacaoCompletaSchema = z.object({
  epigrafe: z.string().min(1, { message: 'Epígrafe é obrigatória' }).optional(),
  orgao: z.string().min(1, { message: 'Órgão regulador é obrigatório' }).optional(),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional(),
  dataInicio: z.coerce.date({ message: 'Data de início inválida' }).optional(),
  dataFim: z.coerce.date({ message: 'Data de fim inválida' }).nullable().optional()
})

// Schema de regulação com relacionamentos
export const RegulacaoCompletaWithRelationsSchema = z.object({
  id: z.string().uuid(),
  epigrafe: z.string(),
  orgao: z.string(),
  descricao: z.string(),
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date().nullable(),
  criticidadesRegulatorias: z.array(z.object({
    id: z.string().uuid(),
    regulacaoId: z.string().uuid(),
    regraQualidadeId: z.string().uuid(),
    grauCriticidade: z.string(),
    regraQualidade: z.object({
      id: z.string().uuid(),
      descricao: z.string(),
      dimensao: z.object({
        id: z.string().uuid(),
        nome: z.string()
      })
    })
  })).optional(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema para resposta única
export const RegulacaoCompletaResponseSchema = z.object({
  data: RegulacaoCompletaWithRelationsSchema
})

// Schema para lista
export const RegulacoesCompletasListResponseSchema = z.object({
  data: z.array(RegulacaoCompletaWithRelationsSchema)
})

// Tipos derivados
export type RegulacaoCompletaParams = z.infer<typeof RegulacaoCompletaParamsSchema>
export type RegulacaoCompletaQueryParams = z.infer<typeof RegulacaoCompletaQueryParamsSchema>
export type CreateRegulacaoCompleta = z.infer<typeof CreateRegulacaoCompletaSchema>
export type UpdateRegulacaoCompleta = z.infer<typeof UpdateRegulacaoCompletaSchema>
export type RegulacaoCompletaWithRelations = z.infer<typeof RegulacaoCompletaWithRelationsSchema>
