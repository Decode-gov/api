import { z } from 'zod'
import { TimestampsSchema } from './common.js'

// Schema base para dados do sistema (apenas campos de input)
const SistemaBaseSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do sistema'),
  descricao: z.string().nullable().optional().describe('Descrição do sistema'),
  repositorio: z.string().describe('URL do repositório do sistema')
})

// Schema completo com ID e timestamps
export const SistemaSchema = SistemaBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do sistema')
}).merge(TimestampsSchema.partial())

// Schema para criação (apenas campos necessários)
export const CreateSistemaSchema = SistemaBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateSistemaSchema = SistemaBaseSchema.partial()

// Schema para resposta com sistema
export const SistemaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: SistemaSchema
})

// Schema para lista de sistemas
export const SistemasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(SistemaSchema).describe('Lista de sistemas')
})

// Schema para parâmetros de rota
export const SistemaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do sistema')
})

// Type exports para uso em controllers
export type Sistema = z.infer<typeof SistemaSchema>
export type CreateSistema = z.infer<typeof CreateSistemaSchema>
export type UpdateSistema = z.infer<typeof UpdateSistemaSchema>
