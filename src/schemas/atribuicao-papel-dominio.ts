import { z } from 'zod';

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
  empresaId: z.uuid().nullable(),
  documentoAtribuicao: z.string(),
  comiteAprovador: z.string(),
  onboarding: z.boolean(),
  responsavel: z.string(),
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
  documentoAtribuicao: z.string({ message: 'Documento de atribuição é obrigatório' }),
  comiteAprovador: z.string({ message: 'Comitê aprovador é obrigatório' })
    .min(1, { message: 'Comitê aprovador é obrigatório' }),
  onboarding: z.boolean().default(false),
  responsavel: z.string({ message: 'Responsável é obrigatório' }),
  empresaId: z.uuid().optional()
})

// Schema para atualização
export const UpdateAtribuicaoPapelDominioSchema = z.object({
  papelId: z.uuid().optional(),
  dominioId: z.uuid().optional(),
  documentoAtribuicao: z.string().optional(),
  comiteAprovador: z.string().min(1, { message: 'Comitê aprovador não pode ser vazio' }).optional(),
  onboarding: z.boolean().optional(),
  responsavel: z.string().optional()
})

// Schema para query params
export const AtribuicaoQueryParamsSchema = z.object({
  empresaId: z.uuid({ message: 'empresaId deve ser um UUID válido' }).optional()
    .describe('Filtrar por empresa (somente ADMIN; USUARIO usa o empresaId do token automaticamente)'),
  papelId: z.uuid().optional().describe('Filtrar por papel'),
  dominioId: z.uuid().optional().describe('Filtrar por domínio'),
  comiteAprovador: z.string().optional()
    .describe('Filtrar por comitê aprovador (busca parcial, sem diferenciar maiúsculas/minúsculas)'),
  onboarding: z.enum(['true', 'false']).transform((value) => value === 'true').optional()
    .describe('Filtrar por onboarding')
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
