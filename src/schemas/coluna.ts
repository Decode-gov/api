import { z } from 'zod'
import { TimestampsSchema } from './common.js'

// Schema base da coluna
export const ColunaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().nullable(),
  obrigatorio: z.boolean(),
  unicidade: z.boolean(),
  ativo: z.boolean(),
  tabelaId: z.string().uuid(),
  tipoDadosId: z.string().uuid().nullable(),
  politicaInternaId: z.string().uuid().nullable(),
  ...TimestampsSchema
})

// Schema para criação de coluna
export const CreateColunaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  obrigatorio: z.boolean().default(false),
  unicidade: z.boolean().default(false),
  ativo: z.boolean().default(true),
  tabelaId: z.string().uuid('ID da tabela deve ser um UUID válido'),
  tipoDadosId: z.string().uuid().optional(),
  politicaInternaId: z.string().uuid().optional()
})

// Schema para atualização de coluna
export const UpdateColunaSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  obrigatorio: z.boolean().optional(),
  unicidade: z.boolean().optional(),
  ativo: z.boolean().optional(),
  tabelaId: z.string().uuid().optional(),
  tipoDadosId: z.string().uuid().optional(),
  politicaInternaId: z.string().uuid().optional()
})

// Schema para coluna com relacionamentos
export const ColunaWithRelationsSchema = ColunaSchema.extend({
  tabela: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }),
  tipoDados: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }).nullable(),
  politicaInterna: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }).nullable()
})

// Schema para resposta com coluna
export const ColunaResponseSchema = z.object({
  message: z.string(),
  data: ColunaSchema
})

// Schema para lista de colunas
export const ColunasListResponseSchema = z.object({
  message: z.string(),
  data: z.array(ColunaWithRelationsSchema)
})

// Schema para resposta de coluna com relacionamentos
export const ColunaWithRelationsResponseSchema = z.object({
  message: z.string(),
  data: ColunaWithRelationsSchema
})
