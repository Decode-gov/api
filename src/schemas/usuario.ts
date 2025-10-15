import { z } from 'zod'

// Schema base do usuário usando funcionalidades do Zod v4
export const UsuarioSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do usuário'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).describe('Nome completo do usuário'),
  email: z.email({ message: 'Email deve ser válido' }).describe('Endereço de email'),
  ativo: z.boolean().describe('Status de ativação do usuário'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de usuário
export const CreateUsuarioSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(100, { message: 'Nome muito longo' }).describe('Nome completo'),
  email: z.email({ message: 'Email deve ser válido' }).describe('Endereço de email válido'),
  senha: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).max(100, { message: 'Senha muito longa' }).describe('Senha de acesso'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de usuário
export const UpdateUsuarioSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(100, { message: 'Nome muito longo' }).optional().describe('Nome completo'),
  email: z.email({ message: 'Email deve ser válido' }).optional().describe('Endereço de email'),
  senha: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).max(100, { message: 'Senha muito longa' }).optional().describe('Nova senha'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para login
export const LoginSchema = z.object({
  email: z.email({ message: 'Email deve ser válido' }).describe('Email de acesso'),
  senha: z.string().min(1, { message: 'Senha é obrigatória' }).describe('Senha de acesso')
})

// Schema para resposta de login
export const LoginResponseSchema = z.object({
  message: z.string().describe('Mensagem de sucesso'),
})

// Schema para resposta com usuário
export const UsuarioResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
})

// Schema para lista de usuários
export const UsuariosListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(UsuarioSchema).describe('Lista de usuários')
})
