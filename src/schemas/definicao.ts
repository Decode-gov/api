import { z } from 'zod'

// Schema base da definição - conforme especificação do prompt
export const DefinicaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da definição'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da definição (termo)'),
  descricao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de definição - conforme especificação do prompt
export const CreateDefinicaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da definição'),
  descricao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo')
})

// Schema para atualização de definição - conforme especificação do prompt
export const UpdateDefinicaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da definição'),
  descricao: z.string().optional().describe('Descrição da definição'),
  sigla: z.string().optional().describe('Sigla do termo')
})

// Schema para definição com relacionamentos
export const DefinicaoWithRelationsSchema = DefinicaoSchema.extend({
  tabelas: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da tabela'),
    nome: z.string().describe('Nome da tabela')
  })).optional().describe('Tabelas relacionadas'),
  colunas: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da coluna'),
    nome: z.string().describe('Nome da coluna')
  })).optional().describe('Colunas relacionadas')
})

// Schema para resposta com definição
export const DefinicaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: DefinicaoSchema
})

// Schema para lista de definições
export const DefinicoesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(DefinicaoWithRelationsSchema).describe('Lista de definições')
})

// Schema para resposta de definição com relacionamentos
export const DefinicaoWithRelationsResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: DefinicaoWithRelationsSchema
})

// Schema para parâmetros de rota da definição
export const DefinicaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da definição')
})
