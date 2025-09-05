import { z } from 'zod'

// Schema base do usuário
export const UsuarioSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  email: z.string().email(),
  ativo: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

// Schema para criação de usuário
export const CreateUsuarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email deve ser válido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  ativo: z.boolean().default(true)
})

// Schema para atualização de usuário
export const UpdateUsuarioSchema = z.object({
  nome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  ativo: z.boolean().optional()
})

// Schema para login
export const LoginSchema = z.object({
  email: z.string().email('Email deve ser válido'),
  senha: z.string().min(1, 'Senha é obrigatória')
})

// Schema para resposta de login
export const LoginResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    email: z.string().email()
  })
})

// Schema para resposta com usuário
export const UsuarioResponseSchema = z.object({
  message: z.string(),
  data: UsuarioSchema
})

// Schema para lista de usuários
export const UsuariosListResponseSchema = z.object({
  message: z.string(),
  data: z.array(UsuarioSchema)
})
