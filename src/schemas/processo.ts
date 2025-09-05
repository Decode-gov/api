import { z } from 'zod'
import { TimestampsSchema } from './common.js'

// Schema base do processo
export const ProcessoSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  descricao: z.string().nullable(),
  ativo: z.boolean(),
  sistemaId: z.string().uuid(),
  usuarioId: z.string().uuid(),
  ...TimestampsSchema
})

// Schema para criação de processo
export const CreateProcessoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  sistemaId: z.string().uuid('ID do sistema deve ser um UUID válido'),
  usuarioId: z.string().uuid('ID do usuário deve ser um UUID válido')
})

// Schema para atualização de processo
export const UpdateProcessoSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().optional(),
  ativo: z.boolean().optional(),
  sistemaId: z.string().uuid().optional(),
  usuarioId: z.string().uuid().optional()
})

// Schema para processo com relacionamentos
export const ProcessoWithRelationsSchema = ProcessoSchema.extend({
  sistema: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }),
  usuario: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }),
  atividades: z.array(z.object({
    id: z.string().uuid(),
    nome: z.string()
  })).optional(),
  kpis: z.array(z.object({
    id: z.string().uuid(),
    nome: z.string()
  })).optional()
})

// Schema para resposta com processo
export const ProcessoResponseSchema = z.object({
  message: z.string(),
  data: ProcessoSchema
})

// Schema para lista de processos
export const ProcessosListResponseSchema = z.object({
  message: z.string(),
  data: z.array(ProcessoWithRelationsSchema)
})

// Schema para resposta de processo com relacionamentos
export const ProcessoWithRelationsResponseSchema = z.object({
  message: z.string(),
  data: ProcessoWithRelationsSchema
})
