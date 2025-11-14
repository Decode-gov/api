import { z } from 'zod'
import { TimestampsSchema } from './common.js'
import { DefinicaoSchema } from './definicao.js'
import { NecessidadeInformacaoSchema } from './necessidade-informacao.js'
import { TabelaSchema } from './tabela.js'

// Schema base para dados da coluna (apenas campos de input)
const ColunaBaseSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da coluna'),
  descricao: z.string().nullable().optional().describe('Descrição da coluna'),
  tabelaId: z.uuid({ message: 'ID da tabela deve ser um UUID válido' }).describe('ID da tabela pai'),
  tabela: TabelaSchema.optional(),
  necessidadeInformacaoId: z.uuid({ message: 'ID da necessidade de informação deve ser um UUID válido' }).describe('ID da necessidade de informação'),
  necessidadeInformacao: NecessidadeInformacaoSchema.optional(),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).describe('ID do termo/definição'),
  termo: DefinicaoSchema.optional()
})

// Schema completo com ID e timestamps
export const ColunaSchema = ColunaBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da coluna')
}).merge(TimestampsSchema.partial())


// Schema para criação (apenas campos necessários)
export const CreateColunaSchema = ColunaBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateColunaSchema = ColunaBaseSchema.partial()

// Schema para resposta com coluna
export const ColunaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ColunaSchema
})

// Schema para lista de colunas
export const ColunasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ColunaSchema).describe('Lista de colunas')
})

// Schema para parâmetros de rota da coluna
export const ColunaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da coluna')
})

// Type exports para uso em controllers
export type Coluna = z.infer<typeof ColunaSchema>
export type CreateColuna = z.infer<typeof CreateColunaSchema>
export type UpdateColuna = z.infer<typeof UpdateColunaSchema>
