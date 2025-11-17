import { z } from 'zod'
import { ComunidadeSchema } from './comunidade'

// Schema base da definição - conforme especificação do prompt
export const DefinicaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da definição'),
  termo: z.string().min(1, { message: 'Termo é obrigatório' }).describe('Nome da definição (termo)'),
  definicao: z.string().describe('Descrição da definição'),
  sigla: z.string().nullable().describe('Sigla do termo'),
  comunidadeId: z.uuid().nullable().describe('ID da comunidade relacionada'),
  comunidade: ComunidadeSchema.nullable().optional(),
  createdAt: z.coerce.date().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

// Schema para criação de definição - conforme especificação do prompt
export const CreateDefinicaoSchema = z.object({
  termo: z.string().min(1, { message: 'Termo é obrigatório' }).describe('Nome da definição (termo)'),
  definicao: z.string().min(1, { message: 'Definição é obrigatória' }).describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo'),
  comunidadeId: z.string().uuid().optional().describe('ID da comunidade relacionada')
})

// Schema para atualização de definição - conforme especificação do prompt
export const UpdateDefinicaoSchema = z.object({
  termo: z.string().min(1, { message: 'Termo é obrigatório' }).optional().describe('Nome da definição (termo)'),
  definicao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo'),
  comunidadeId: z.string().uuid().optional().describe('ID da comunidade relacionada')
})

// Schema para resposta com definição
export const DefinicaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: DefinicaoSchema
})

// Schema para parâmetros de rota da definição
export const DefinicaoParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da definição')
})
