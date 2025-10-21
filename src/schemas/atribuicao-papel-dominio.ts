import { z } from 'zod'

// Enum para tipo de entidade
export const TipoEntidadeEnum = z.enum([
  'Politica',
  'Papel',
  'Atribuicao',
  'Processo',
  'Termo',
  'KPI',
  'RegraNegocio',
  'RegraQualidade',
  'Dominio',
  'Sistema',
  'Tabela',
  'Coluna'
])

// Schema base do papel
const PapelSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  descricao: z.string().nullable()
})

// Schema base do domínio (comunidade)
const DominioSchema = z.object({
  id: z.uuid(),
  nome: z.string()
})

// Schema base da atribuição
export const AtribuicaoPapelDominioSchema = z.object({
  id: z.uuid(),
  papelId: z.uuid(),
  dominioId: z.uuid(),
  tipoEntidade: TipoEntidadeEnum,
  documentoAtribuicao: z.string().nullable(),
  comiteAprovadorId: z.uuid().nullable(),
  onboarding: z.boolean(),
  dataInicioVigencia: z.coerce.date(),
  dataTermino: z.coerce.date().nullable(),
  observacoes: z.string().nullable(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema com relacionamentos
export const AtribuicaoPapelDominioWithRelationsSchema = AtribuicaoPapelDominioSchema.extend({
  papel: PapelSchema,
  dominio: DominioSchema
})

// Schema para criação
export const CreateAtribuicaoPapelDominioSchema = z.object({
  papelId: z.uuid({ message: 'ID do papel deve ser um UUID válido' }),
  dominioId: z.uuid({ message: 'ID do domínio deve ser um UUID válido' }),
  tipoEntidade: TipoEntidadeEnum,
  documentoAtribuicao: z.string().optional(),
  comiteAprovadorId: z.uuid().optional(),
  onboarding: z.boolean().default(false),
  dataInicioVigencia: z.coerce.date().default(() => new Date()),
  dataTermino: z.coerce.date().optional(),
  observacoes: z.string().optional()
})

// Schema para atualização
export const UpdateAtribuicaoPapelDominioSchema = z.object({
  papelId: z.uuid().optional(),
  dominioId: z.uuid().optional(),
  tipoEntidade: TipoEntidadeEnum.optional(),
  documentoAtribuicao: z.string().nullable().optional(),
  comiteAprovadorId: z.uuid().nullable().optional(),
  onboarding: z.boolean().optional(),
  dataInicioVigencia: z.coerce.date().optional(),
  dataTermino: z.coerce.date().nullable().optional(),
  observacoes: z.string().nullable().optional()
})

// Schema para query params
export const AtribuicaoQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  papelId: z.uuid().optional(),
  dominioId: z.uuid().optional(),
  tipoEntidade: TipoEntidadeEnum.optional()
})

// Schema para parâmetros de rota
export const AtribuicaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para resposta individual
export const AtribuicaoResponseSchema = z.object({
  data: AtribuicaoPapelDominioWithRelationsSchema
})

// Schema para lista
export const AtribuicoesListResponseSchema = z.object({
  data: z.array(AtribuicaoPapelDominioWithRelationsSchema)
})

// Schema para resposta de delete
export const AtribuicaoDeleteResponseSchema = z.object({
  data: AtribuicaoPapelDominioSchema
})

// Schema para erro
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string()
})
