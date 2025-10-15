import { z } from 'zod'

// Schema base da comunidade usando Zod v4
export const ComunidadeSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da comunidade'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da comunidade'),
  descricao: z.string().nullable().describe('Descrição da comunidade'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de comunidade
export const CreateComunidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da comunidade'),
  descricao: z.string().nullable().optional().describe('Descrição opcional da comunidade')
})

// Schema para atualização de comunidade
export const UpdateComunidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da comunidade'),
  descricao: z.string().nullable().optional().describe('Descrição da comunidade')
})

// Schema para resposta com comunidade
export const ComunidadeResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ComunidadeSchema
})

// Schema para lista de comunidades
export const ComunidadesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ComunidadeSchema).describe('Lista de comunidades')
})

// Schema para parâmetros de rota
export const ComunidadeParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da comunidade')
})
