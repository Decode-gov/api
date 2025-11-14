import { z } from 'zod'
import { TimestampsSchema } from './common.js'
import { RegraNegocioWithRelationsSchema } from './regra-negocio.js'
import { DimensaoQualidadeSchema } from './dimensao-qualidade.js'
import { TabelaSchema } from './tabela.js'
import { ColunaSchema } from './coluna.js'
import { PapelSchema } from './papel.js'

// Schemas de relacionamentos reutilizados (pick apenas os campos necessários)
const RegraNegocioSimplifiedSchema = RegraNegocioWithRelationsSchema.pick({
  id: true,
  descricao: true,
  processoId: true,
  politicaId: true
})

const DimensaoQualidadeSimplifiedSchema = DimensaoQualidadeSchema.pick({
  id: true,
  nome: true,
  descricao: true,
  politicaId: true
})

const TabelaSimplifiedSchema = TabelaSchema.pick({
  id: true,
  nome: true
})

const ColunaSimplifiedSchema = ColunaSchema.pick({
  id: true,
  nome: true,
  descricao: true
})

const PapelSimplifiedSchema = PapelSchema.pick({
  id: true,
  nome: true,
  descricao: true
})

// Schema base para dados da regra de qualidade (apenas campos de input)
const RegraQualidadeBaseSchema = z.object({
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da regra'),
  regraNegocioId: z.uuid({ message: 'regraNegocioId deve ser um UUID válido' }).nullable().optional().describe('ID da regra de negócio (opcional)'),
  dimensaoId: z.uuid({ message: 'dimensaoId deve ser um UUID válido' }).describe('ID da dimensão de qualidade'),
  tabelaId: z.uuid({ message: 'tabelaId deve ser um UUID válido' }).describe('ID da tabela'),
  colunaId: z.uuid({ message: 'colunaId deve ser um UUID válido' }).describe('ID da coluna'),
  responsavelId: z.uuid({ message: 'responsavelId deve ser um UUID válido' }).describe('ID do papel responsável')
})

// Schema completo com ID e timestamps
export const RegraQualidadeSchema = RegraQualidadeBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da regra de qualidade')
}).merge(TimestampsSchema.partial())

// Schema para criação (apenas campos necessários)
export const CreateRegraQualidadeSchema = RegraQualidadeBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateRegraQualidadeSchema = RegraQualidadeBaseSchema.partial()

// Schema de regra com relacionamentos
export const RegraQualidadeWithRelationsSchema = RegraQualidadeSchema.extend({
  regraNegocio: RegraNegocioSimplifiedSchema.nullable(),
  dimensao: DimensaoQualidadeSimplifiedSchema,
  tabela: TabelaSimplifiedSchema,
  coluna: ColunaSimplifiedSchema,
  responsavel: PapelSimplifiedSchema
})

// Schema para resposta com regra de qualidade
export const RegraQualidadeResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: RegraQualidadeWithRelationsSchema
})

// Schema para lista de regras de qualidade
export const RegrasQualidadeListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(RegraQualidadeWithRelationsSchema).describe('Lista de regras de qualidade')
})

// Schema para parâmetros de rota
export const RegraQualidadeParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da regra de qualidade')
})

// Schema para query params
export const RegraQualidadeQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  regraNegocioId: z.string().uuid({ message: 'regraNegocioId deve ser um UUID válido' }).optional(),
  dimensaoId: z.string().uuid({ message: 'dimensaoId deve ser um UUID válido' }).optional(),
  tabelaId: z.string().uuid({ message: 'tabelaId deve ser um UUID válido' }).optional(),
  colunaId: z.string().uuid({ message: 'colunaId deve ser um UUID válido' }).optional(),
  responsavelId: z.string().uuid({ message: 'responsavelId deve ser um UUID válido' }).optional()
})

// Type exports para uso em controllers
export type RegraQualidade = z.infer<typeof RegraQualidadeSchema>
export type CreateRegraQualidade = z.infer<typeof CreateRegraQualidadeSchema>
export type UpdateRegraQualidade = z.infer<typeof UpdateRegraQualidadeSchema>
export type RegraQualidadeWithRelations = z.infer<typeof RegraQualidadeWithRelationsSchema>
export type RegraQualidadeParams = z.infer<typeof RegraQualidadeParamsSchema>
export type RegraQualidadeQueryParams = z.infer<typeof RegraQualidadeQueryParamsSchema>
