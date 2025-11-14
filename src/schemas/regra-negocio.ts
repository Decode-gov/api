import { z } from 'zod'
import { TimestampsSchema } from './common.js'
import { PoliticaInternaSchema } from './politica-interna.js'
import { SistemaSchema } from './sistema.js'
import { PapelSchema } from './papel.js'
import { DefinicaoSchema } from './definicao.js'

// Schemas simplificados para relacionamentos (usando .pick() do Zod v4)
const PoliticaSimplifiedSchema = PoliticaInternaSchema.pick({
  id: true,
  nome: true,
  versao: true
})

const SistemaSimplifiedSchema = SistemaSchema.pick({
  id: true,
  nome: true,
  descricao: true
})

const PapelSimplifiedSchema = PapelSchema.pick({
  id: true,
  nome: true,
  descricao: true
})

const DefinicaoSimplifiedSchema = DefinicaoSchema.pick({
  id: true,
  termo: true,
  definicao: true
})

// Schema base para dados da regra de negócio (apenas campos de input)
const RegraNegocioBaseSchema = z.object({
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da regra de negócio'),
  politicaId: z.uuid({ message: 'politicaId deve ser um UUID válido' }).describe('ID da política interna relacionada'),
  sistemaId: z.uuid({ message: 'sistemaId deve ser um UUID válido' }).nullable().optional().describe('ID do sistema relacionado (opcional)'),
  responsavelId: z.uuid({ message: 'responsavelId deve ser um UUID válido' }).describe('ID do papel responsável'),
  termoId: z.uuid({ message: 'termoId deve ser um UUID válido' }).describe('ID do termo (definição) relacionado')
})

// Schema completo com ID e timestamps
export const RegraNegocioSchema = RegraNegocioBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da regra de negócio')
}).merge(TimestampsSchema.partial())

// Schema para criação (apenas campos necessários)
export const CreateRegraNegocioSchema = RegraNegocioBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateRegraNegocioSchema = RegraNegocioBaseSchema.partial()

// Schema com relacionamentos completos
export const RegraNegocioWithRelationsSchema = RegraNegocioSchema.extend({
  politica: PoliticaSimplifiedSchema.describe('Política interna relacionada'),
  sistema: SistemaSimplifiedSchema.nullable().optional().describe('Sistema relacionado (opcional)'),
  responsavel: PapelSimplifiedSchema.describe('Papel responsável pela regra'),
  termo: DefinicaoSimplifiedSchema.describe('Termo (definição) relacionado')
})

// Schema para resposta única
export const RegraNegocioResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: RegraNegocioWithRelationsSchema
})

// Schema para lista
export const RegrasNegocioListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(RegraNegocioWithRelationsSchema).describe('Lista de regras de negócio')
})

// Schema para parâmetros de rota
export const RegraNegocioParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da regra de negócio')
})

// Schema para query params
export const RegraNegocioQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional().describe('Número de registros para pular'),
  take: z.coerce.number().int().min(1).max(100).default(10).optional().describe('Número de registros para retornar'),
  orderBy: z.string().optional().describe('Campo para ordenação'),
  politicaId: z.uuid({ message: 'politicaId deve ser um UUID válido' }).optional().describe('Filtrar por política'),
  sistemaId: z.uuid({ message: 'sistemaId deve ser um UUID válido' }).optional().describe('Filtrar por sistema'),
  responsavelId: z.uuid({ message: 'responsavelId deve ser um UUID válido' }).optional().describe('Filtrar por responsável'),
  termoId: z.uuid({ message: 'termoId deve ser um UUID válido' }).optional().describe('Filtrar por termo')
})

// Tipos derivados
export type RegraNegocio = z.infer<typeof RegraNegocioSchema>
export type CreateRegraNegocio = z.infer<typeof CreateRegraNegocioSchema>
export type UpdateRegraNegocio = z.infer<typeof UpdateRegraNegocioSchema>
export type RegraNegocioWithRelations = z.infer<typeof RegraNegocioWithRelationsSchema>
export type RegraNegocioParams = z.infer<typeof RegraNegocioParamsSchema>
export type RegraNegocioQueryParams = z.infer<typeof RegraNegocioQueryParamsSchema>
