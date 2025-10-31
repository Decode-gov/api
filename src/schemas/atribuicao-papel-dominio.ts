import { z } from 'zod'

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

// Schema base do comitê aprovador
const ComiteAprovadorSchema = z.object({
  id: z.uuid(),
  nome: z.string()
})

// Schema base da atribuição
export const AtribuicaoPapelDominioSchema = z.object({
  id: z.uuid(),
  papelId: z.uuid(),
  dominioId: z.uuid(),
  documentoAtribuicao: z.string(),
  comiteAprovadorId: z.uuid(),
  onboarding: z.boolean(),
  responsavel: z.string(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema com relacionamentos
export const AtribuicaoPapelDominioWithRelationsSchema = AtribuicaoPapelDominioSchema.extend({
  papel: PapelSchema,
  dominio: DominioSchema,
  comiteAprovador: ComiteAprovadorSchema
})

// Schema para criação
export const CreateAtribuicaoPapelDominioSchema = z.object({
  papelId: z.uuid({ message: 'ID do papel deve ser um UUID válido' }),
  dominioId: z.uuid({ message: 'ID do domínio deve ser um UUID válido' }),
  documentoAtribuicao: z.string({ message: 'Documento de atribuição é obrigatório' }),
  comiteAprovadorId: z.uuid({ message: 'ID do comitê aprovador deve ser um UUID válido' }),
  onboarding: z.boolean().default(false),
  responsavel: z.string({ message: 'Responsável é obrigatório' })
})

// Schema para atualização
export const UpdateAtribuicaoPapelDominioSchema = z.object({
  papelId: z.uuid().optional(),
  dominioId: z.uuid().optional(),
  documentoAtribuicao: z.string().optional(),
  comiteAprovadorId: z.uuid().optional(),
  onboarding: z.boolean().optional(),
  responsavel: z.string().optional()
})

// Schema para query params
export const AtribuicaoQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  papelId: z.uuid().optional(),
  dominioId: z.uuid().optional(),
  comiteAprovadorId: z.uuid().optional(),
  onboarding: z.coerce.boolean().optional()
})

// Schema para parâmetros de rota
export const AtribuicaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para resposta individual
export const AtribuicaoResponseSchema = z.object({
  message: z.string(),
  data: AtribuicaoPapelDominioWithRelationsSchema
})

// Schema para lista
export const AtribuicoesListResponseSchema = z.object({
  message: z.string(),
  data: z.array(AtribuicaoPapelDominioWithRelationsSchema)
})

// Schema para resposta de delete
export const AtribuicaoDeleteResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.uuid(),
    papelId: z.uuid(),
    dominioId: z.uuid()
  })
})
