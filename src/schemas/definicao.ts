import { z } from 'zod'

// Schema base da definição - conforme especificação do prompt
export const DefinicaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da definição'),
  termo: z.string().min(1, { message: 'Termo é obrigatório' }).describe('Nome da definição (termo)'),
  definicao: z.string().describe('Descrição da definição'),
  sigla: z.string().nullable().describe('Sigla do termo'),
  createdAt: z.coerce.date().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

// Schema para criação de definição - conforme especificação do prompt
export const CreateDefinicaoSchema = z.object({
  termo: z.string().min(1, { message: 'Termo é obrigatório' }).describe('Nome da definição (termo)'),
  definicao: z.string().min(1, { message: 'Definição é obrigatória' }).describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo')
})

// Schema para atualização de definição - conforme especificação do prompt
export const UpdateDefinicaoSchema = z.object({
  termo: z.string().min(1, { message: 'Termo é obrigatório' }).optional().describe('Nome da definição (termo)'),
  definicao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo')
})

// Schema para resposta com definição
export const DefinicaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: DefinicaoSchema
})

// Schema para parâmetros de rota da definição
export const DefinicaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da definição')
})
