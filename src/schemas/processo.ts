import { z } from 'zod'

// Schema base do processo - conforme modelo Prisma
export const ProcessoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do processo'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do processo'),
  descricao: z.string().nullable().describe('Descrição do processo'),
  createdAt: z.coerce.date().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

// Schema para criação de processo - conforme modelo Prisma
export const CreateProcessoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição opcional do processo')
})

// Schema para atualização de processo - conforme modelo Prisma
export const UpdateProcessoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição do processo')
})

// Schema para resposta com processo
export const ProcessoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ProcessoSchema
})

// Schema para lista de processos
export const ProcessosListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ProcessoSchema).describe('Lista de processos')
})

// Schema para resposta de processo com relacionamentos
export const ProcessoWithRelationsResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ProcessoSchema
})

// Schema para parâmetros de rota do processo
export const ProcessoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do processo')
})

// Schema para query de listagem
export const ProcessoQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).describe('Número de registros a pular'),
  take: z.coerce.number().int().min(1).max(100).default(10).describe('Número de registros a retornar'),
  orderBy: z.string().optional().describe('Campo para ordenação')
})
