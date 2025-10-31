import { z } from 'zod'
import { ComunidadeSchema } from './comunidade'

// Schema base da definição - conforme especificação do prompt
export const DefinicaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).optional().describe('Identificador único da definição'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da definição (termo)'),
  descricao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade relacionada'),
  comunidade: ComunidadeSchema,
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de definição - conforme especificação do prompt
export const CreateDefinicaoSchema = z.object({
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade relacionada'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da definição'),
  descricao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo')
})

// Schema para atualização de definição - conforme especificação do prompt
export const UpdateDefinicaoSchema = z.object({
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade relacionada'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da definição'),
  descricao: z.string().optional().describe('Descrição da definição'),
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
