import { z } from 'zod'

// Schema base da política interna
export const PoliticaInternaSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1),
  conteudo: z.string(),
  versao: z.string().nullable(),
  ativa: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para criação de política interna
export const CreatePoliticaInternaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  conteudo: z.string().min(1, 'Conteúdo é obrigatório'),
  versao: z.string().nullable().optional(),
  ativa: z.boolean().default(true).optional()
})

// Schema para atualização de política interna
export const UpdatePoliticaInternaSchema = z.object({
  titulo: z.string().min(1).optional(),
  conteudo: z.string().min(1).optional(),
  versao: z.string().nullable().optional(),
  ativa: z.boolean().optional()
})

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
  id: z.string()
})
