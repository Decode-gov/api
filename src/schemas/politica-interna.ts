import { z } from 'zod'

// Enum para status da política
export const StatusPoliticaEnum = z.enum(['Em_elaboracao', 'Vigente', 'Revogada'])

// Schema base da política interna
export const PoliticaInternaSchema = z.object({
  id: z.uuid().optional(),
  nome: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  objetivo: z.string().min(1).optional(),
  escopo: z.string().min(1).optional(),
  dominioDadosId: z.uuid().nullable().optional(),
  responsavel: z.string().min(1).optional(),
  dataCriacao: z.coerce.date(),
  dataInicioVigencia: z.coerce.date(),
  dataTermino: z.coerce.date().nullable().optional(),
  status: StatusPoliticaEnum,
  versao: z.string().min(1),
  anexosUrl: z.coerce.string().nullable().optional(),
  relacionamento: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional()
})

// Schema para criação de política interna
export const CreatePoliticaInternaSchema = PoliticaInternaSchema

// Schema para atualização de política interna
export const UpdatePoliticaInternaSchema = PoliticaInternaSchema

// Schema para resposta com política interna
export const PoliticaInternaResponseSchema = z.object({
  message: z.string(),
  data: PoliticaInternaSchema
})

// Schema para lista de políticas internas
export const PoliticasInternasListResponseSchema = z.object({
  message: z.string(),
  data: z.array(PoliticaInternaSchema)
})

// Schema para parâmetros de rota
export const PoliticaInternaParamsSchema = z.object({
  id: z.uuid()
})
