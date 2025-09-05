import { z } from 'zod'

// Schema comum para ID UUID
export const IdSchema = z.object({
  id: z.string().uuid()
})

// Schema comum para paginação
export const PaginationSchema = z.object({
  skip: z.number().int().min(0).default(0),
  take: z.number().int().min(1).max(100).default(10),
  orderBy: z.string().optional()
})

// Schema comum para timestamps
export const TimestampsSchema = {
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}

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
