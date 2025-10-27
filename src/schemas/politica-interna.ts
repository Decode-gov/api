import { z } from 'zod'

// Enum para status da política
export const StatusPoliticaEnum = z.enum(['Em_elaboração', 'Vigente', 'Revogada'])

// Schema base da política interna
export const PoliticaInternaSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  descricao: z.string(),
  categoria: z.string(),
  objetivo: z.string(),
  escopo: z.string(),
  dominioDadosId: z.uuid().nullable(),
  responsavel: z.string(),
  dataCriacao: z.iso.datetime(),
  dataInicioVigencia: z.iso.datetime(),
  dataTermino: z.iso.datetime().nullable(),
  status: StatusPoliticaEnum,
  versao: z.string(),
  anexosUrl: z.string().nullable(),
  relacionamento: z.string().nullable(),
  observacoes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
})

// Schema para criação de política interna
export const CreatePoliticaInternaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  objetivo: z.string().min(1, 'Objetivo é obrigatório'),
  escopo: z.string().min(1, 'Escopo é obrigatório'),
  dominioDadosId: z.uuid().nullable().optional(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  dataCriacao: z.iso.datetime(),
  dataInicioVigencia: z.iso.datetime(),
  dataTermino: z.iso.datetime().nullable().optional(),
  status: StatusPoliticaEnum.default('Em_elaboração'),
  versao: z.string().min(1, 'Versão é obrigatória'),
  anexosUrl: z.string().url().nullable().optional(),
  relacionamento: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional()
})

// Schema para atualização de política interna
export const UpdatePoliticaInternaSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  objetivo: z.string().min(1).optional(),
  escopo: z.string().min(1).optional(),
  dominioDadosId: z.uuid().nullable().optional(),
  responsavel: z.string().min(1).optional(),
  dataCriacao: z.iso.datetime().optional(),
  dataInicioVigencia: z.iso.datetime().optional(),
  dataTermino: z.iso.datetime().nullable().optional(),
  status: StatusPoliticaEnum.optional(),
  versao: z.string().min(1).optional(),
  anexosUrl: z.string().url().nullable().optional(),
  relacionamento: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional()
})

// Schema para resposta com política interna
export const PoliticaInternaResponseSchema = z.object({
  data: PoliticaInternaSchema
})

// Schema para lista de políticas internas
export const PoliticasInternasListResponseSchema = z.object({
  data: z.array(PoliticaInternaSchema)
})

// Schema para parâmetros de rota
export const PoliticaInternaParamsSchema = z.object({
  id: z.uuid()
})
