import { z } from 'zod'

// Schema comum para ID UUID usando z.uuid() do Zod v4
export const IdSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único')
})

// Schema comum para paginação com coerção de tipos
export const PaginationSchema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'Skip deve ser >= 0' }).default(0).describe('Número de registros para pular'),
  take: z.coerce.number().int().min(1, { message: 'Take deve ser >= 1' }).max(100, { message: 'Take deve ser <= 100' }).default(10).describe('Número de registros para retornar'),
  orderBy: z.string().optional().describe('Campo para ordenação')
})

// Schema comum para timestamps usando z.string().datetime() do Zod v4
export const TimestampsSchema = z.object({
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data e hora de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data e hora da última atualização')
})

// Schema comum para respostas de erro
export const ErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional()
})

// Schema comum para respostas de sucesso
export const SuccessMessageSchema = z.object({
  message: z.string()
})
