import { z } from 'zod'

// Schemas comuns para reuso usando funcionalidades do Zod v4
export const uuidSchema = z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único UUID')
export const emailSchema = z.email({ message: 'Email deve ser válido' }).describe('Endereço de email válido')
export const passwordSchema = z.string()
  .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  .max(100, { message: 'Senha muito longa' })
  .describe('Senha de acesso')
export const nomeSchema = z.string()
  .min(1, { message: 'Nome é obrigatório' })
  .max(100, { message: 'Nome muito longo' })
  .describe('Nome completo')

// Schemas de validação para autenticação com Zod v4
export const loginSchema = z.object({
  email: z.email({ message: 'Email deve ser válido' }).describe('Endereço de email válido'),
  senha: z.string().min(1, { message: 'Senha é obrigatória' }).describe('Senha do usuário')
})

export const registerSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  senha: passwordSchema
})

export const changePasswordSchema = z.object({
  senhaAtual: z.string().min(1, { message: 'Senha atual é obrigatória' }).describe('Senha atual do usuário'),
  novaSenha: passwordSchema
})

export const updateUserSchema = z.object({
  nome: nomeSchema.optional(),
  email: emailSchema.optional(),
  ativo: z.boolean().optional().describe('Status ativo do usuário')
})

// Schema para usuário completo
export const userSchema = z.object({
  id: uuidSchema,
  nome: nomeSchema,
  email: emailSchema,
  ativo: z.boolean().describe('Status de ativação do usuário'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para JWT Payload
export const jwtPayloadSchema = z.object({
  userId: uuidSchema,
  email: emailSchema,
  iat: z.number().optional(),
  exp: z.number().optional()
})

// Schema para resposta de login
export const loginResponseSchema = z.object({
  message: z.string(),
})

// Tipos derivados dos schemas (com melhor inferência do Zod v4)
export type LoginRequest = z.infer<typeof loginSchema>
export type RegisterRequest = z.infer<typeof registerSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type UpdateUserRequest = z.infer<typeof updateUserSchema>
export type JwtPayload = z.infer<typeof jwtPayloadSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type User = z.infer<typeof userSchema>

// Declaração de módulo para Fastify Request
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}
