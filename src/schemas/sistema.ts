import { z } from 'zod'

// Schema base do sistema usando Zod v4
export const SistemaSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do sistema'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do sistema'),
  descricao: z.string().nullable().describe('Descrição do sistema'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de sistema
export const CreateSistemaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do sistema'),
  descricao: z.string().nullable().optional().describe('Descrição opcional do sistema')
})

// Schema para atualização de sistema
export const UpdateSistemaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do sistema'),
  descricao: z.string().nullable().optional().describe('Descrição do sistema')
})

// Schema para resposta com sistema
export const SistemaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: SistemaSchema
})

// Schema para lista de sistemas
export const SistemasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(SistemaSchema).describe('Lista de sistemas')
})

// Schema para parâmetros de rota
export const SistemaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do sistema')
})
