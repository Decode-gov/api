import { z } from 'zod'
import { TimestampsSchema } from './common.js'

// Schema base da definição
export const DefinicaoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().nullable(),
  ativo: z.boolean(),
  ...TimestampsSchema
})

// Schema para criação de definição
export const CreateDefinicaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true)
})

// Schema para atualização de definição
export const UpdateDefinicaoSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  ativo: z.boolean().optional()
})

// Schema para definição com relacionamentos
export const DefinicaoWithRelationsSchema = DefinicaoSchema.extend({
  tabelas: z.array(z.object({
    id: z.string().uuid(),
    nome: z.string()
  })).optional(),
  colunas: z.array(z.object({
    id: z.string().uuid(),
    nome: z.string()
  })).optional()
})

// Schema para resposta com definição
export const DefinicaoResponseSchema = z.object({
  message: z.string(),
  data: DefinicaoSchema
})

// Schema para lista de definições
export const DefinicoesListResponseSchema = z.object({
  message: z.string(),
  data: z.array(DefinicaoWithRelationsSchema)
})

// Schema para resposta de definição com relacionamentos
export const DefinicaoWithRelationsResponseSchema = z.object({
  message: z.string(),
  data: DefinicaoWithRelationsSchema
})
