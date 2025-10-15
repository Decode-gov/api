import { z } from 'zod'

// Schema base do banco usando funcionalidades do Zod v4
export const BancoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do banco'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do banco de dados'),
  descricao: z.string().nullable().describe('Descrição do banco'),
  servidor: z.string().nullable().describe('Endereço do servidor'),
  porta: z.coerce.number().int().positive({ message: 'Porta deve ser um número positivo' }).nullable().describe('Porta de conexão'),
  tipo: z.string().nullable().describe('Tipo do banco de dados'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de banco
export const CreateBancoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do banco'),
  descricao: z.string().nullable().optional().describe('Descrição opcional'),
  servidor: z.string().nullable().optional().describe('Endereço do servidor'),
  porta: z.coerce.number().int().positive({ message: 'Porta deve ser um número positivo' }).nullable().optional().describe('Porta de conexão'),
  tipo: z.string().nullable().optional().describe('Tipo do banco')
})

// Schema para atualização de banco
export const UpdateBancoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do banco'),
  descricao: z.string().nullable().optional().describe('Descrição'),
  servidor: z.string().nullable().optional().describe('Endereço do servidor'),
  porta: z.coerce.number().int().positive({ message: 'Porta deve ser um número positivo' }).nullable().optional().describe('Porta de conexão'),
  tipo: z.string().nullable().optional().describe('Tipo do banco')
})

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
