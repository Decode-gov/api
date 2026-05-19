import { z } from 'zod'

// Schema comum para ID UUID usando z.uuid() do Zod v4
export const IdSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único')
})

// Schema de filtro por empresa para rotas GET
export const EmpresaFilterSchema = z.object({
  empresaId: z.uuid({ message: 'empresaId deve ser um UUID válido' }).optional()
    .describe('Filtrar por empresa (somente ADMIN; USUARIO usa o empresaId do token automaticamente)')
})

// Mantido por compatibilidade — sem paginação
export const PaginationSchema = EmpresaFilterSchema

// Schema comum para timestamps usando z.iso.datetime() do Zod v4
export const TimestampsSchema = z.object({
  createdAt: z.coerce.date({ message: 'Data de criação inválida' }).describe('Data e hora de criação'),
  updatedAt: z.coerce.date({ message: 'Data de atualização inválida' }).describe('Data e hora da última atualização')
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
