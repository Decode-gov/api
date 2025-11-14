import { z } from 'zod'
import { TimestampsSchema } from './common.js'

// Schema base para dados da tabela (apenas campos de input)
const TabelaBaseSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da tabela'),
  bancoId: z.uuid({ message: 'ID do banco deve ser um UUID válido' }).nullable().optional().describe('ID do banco de dados')
})

// Schema completo com ID e timestamps
export const TabelaSchema = TabelaBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da tabela')
}).merge(TimestampsSchema.partial())

// Schema para criação (apenas campos necessários)
export const CreateTabelaSchema = TabelaBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateTabelaSchema = TabelaBaseSchema.partial()

// Schema para resposta com tabela
export const TabelaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: TabelaSchema
})

// Schema para lista de tabelas
export const TabelasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(TabelaSchema).describe('Lista de tabelas')
})

// Schema para parâmetros de rota
export const TabelaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da tabela')
})

// Type exports para uso em controllers
export type Tabela = z.infer<typeof TabelaSchema>
export type CreateTabela = z.infer<typeof CreateTabelaSchema>
export type UpdateTabela = z.infer<typeof UpdateTabelaSchema>
