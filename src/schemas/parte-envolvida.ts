import { z } from 'zod'

// Schema para parâmetros de rota
export const ParteEnvolvidaParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para query params
export const ParteEnvolvidaQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  nome: z.string().optional()
})

// Schema para criação
export const CreateParteEnvolvidaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).describe('Nome da parte envolvida'),
  descricao: z.string().optional().describe('Descrição da parte envolvida'),
  contato: z.string().min(1, { message: 'Contato é obrigatório' }).describe('Informação de contato (email, telefone, etc)')
})

// Schema para atualização
export const UpdateParteEnvolvidaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).optional(),
  descricao: z.string().optional(),
  contato: z.string().min(1, { message: 'Contato é obrigatório' }).optional()
})

// Schema de parte envolvida
export const ParteEnvolvidaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  descricao: z.string().nullable(),
  contato: z.string(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema para resposta única
export const ParteEnvolvidaResponseSchema = z.object({
  data: ParteEnvolvidaSchema
})

// Schema para lista
export const PartesEnvolvidasListResponseSchema = z.object({
  data: z.array(ParteEnvolvidaSchema)
})

// Tipos derivados
export type ParteEnvolvidaParams = z.infer<typeof ParteEnvolvidaParamsSchema>
export type ParteEnvolvidaQueryParams = z.infer<typeof ParteEnvolvidaQueryParamsSchema>
export type CreateParteEnvolvida = z.infer<typeof CreateParteEnvolvidaSchema>
export type UpdateParteEnvolvida = z.infer<typeof UpdateParteEnvolvidaSchema>
export type ParteEnvolvida = z.infer<typeof ParteEnvolvidaSchema>
