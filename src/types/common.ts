import { z } from 'zod'

// ID schema usando novo validador top-level do Zod v4
export const idSchema = z.uuid({ message: 'ID inválido' })

export interface PaginationParams {
  skip?: number
  take?: number
  orderBy?: Record<string, 'asc' | 'desc'>
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
  }
}

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}

export const paginationSchema = z.object({
  skip: z.coerce.number().min(0).optional(),
  take: z.coerce.number().min(1).max(100).optional(),
  orderBy: z.string().optional()
})
