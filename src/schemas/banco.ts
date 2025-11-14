import { z } from 'zod'
import { TimestampsSchema } from './common.js'
import { SistemaSchema } from './sistema.js'

// Schema base para dados do banco (apenas campos de input)
const BancoBaseSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do banco de dados'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).nullable().optional().describe('ID do sistema associado'),
  sistema: SistemaSchema.nullable().optional()
})

// Schema completo com ID e timestamps
export const BancoSchema = BancoBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do banco')
}).merge(TimestampsSchema.partial())

// Schema para criação (apenas campos necessários)
export const CreateBancoSchema = BancoBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateBancoSchema = BancoBaseSchema.partial()

// Schema para resposta com banco
export const BancoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: BancoSchema
})

// Schema para lista de bancos
export const BancosListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(BancoSchema).describe('Lista de bancos')
})

// Schema para parâmetros de rota
export const BancoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do banco')
})

// Type exports para uso em controllers
export type Banco = z.infer<typeof BancoSchema>
export type CreateBanco = z.infer<typeof CreateBancoSchema>
export type UpdateBanco = z.infer<typeof UpdateBancoSchema>
