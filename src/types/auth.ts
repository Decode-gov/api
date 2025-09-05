import { z } from 'zod'

// Schemas de validação para autenticação
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const registerSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const changePasswordSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres')
})

export const updateUserSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().email('Email inválido').optional(),
  ativo: z.boolean().optional()
})

// Tipos derivados dos schemas
export type LoginRequest = z.infer<typeof loginSchema>
export type RegisterRequest = z.infer<typeof registerSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type UpdateUserRequest = z.infer<typeof updateUserSchema>

// Interface para JWT Payload
export interface JwtPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

// Interface para resposta de login
export interface LoginResponse {
  user: {
    id: string
    nome: string
    email: string
    ativo: boolean
  }
  token: string
}

// Declaração de módulo para Fastify Request
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}
