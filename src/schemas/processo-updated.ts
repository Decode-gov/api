import { z } from 'zod'

// Schema base de Processos - conforme especificação do prompt
export const ProcessoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do processo'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição do processo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de Processo - conforme especificação do prompt
export const CreateProcessoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição do processo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade')
})

// Schema para atualização de Processo - conforme especificação do prompt
export const UpdateProcessoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição do processo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade')
})

// Schema para resposta com processo
export const ProcessoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ProcessoSchema.describe('Dados do processo')
})

// Schema para lista de processos
export const ProcessosListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ProcessoSchema).describe('Lista de processos')
})