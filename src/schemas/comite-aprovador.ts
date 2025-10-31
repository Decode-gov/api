import { z } from 'zod'

// Schema base do comitê aprovador
export const ComiteAprovadorSchema = z.object({
  id: z.uuid(),
  nome: z.string()
})

// Schema para criação
export const CreateComiteAprovadorSchema = z.object({
  nome: z.string({ message: 'Nome é obrigatório' }).min(1, 'Nome não pode ser vazio')
})

// Schema para atualização
export const UpdateComiteAprovadorSchema = z.object({
  nome: z.string().min(1, 'Nome não pode ser vazio').optional()
})

// Schema para parâmetros de rota
export const ComiteAprovadorParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para query params
export const ComiteAprovadorQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional()
})

// Schema para resposta individual
export const ComiteAprovadorResponseSchema = z.object({
  message: z.string(),
  data: ComiteAprovadorSchema
})

// Schema para lista
export const ComitesAprovadoresListResponseSchema = z.object({
  message: z.string(),
  data: z.array(ComiteAprovadorSchema)
})

// Schema para resposta de delete
export const ComiteAprovadorDeleteResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.uuid(),
    nome: z.string()
  })
})
