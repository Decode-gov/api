import { z } from 'zod'

// Enums
export const TipoRepositorioEnum = z.enum(['LOCAL', 'NUVEM', 'HIBRIDO'])

// Tipos exportados
export type TipoRepositorio = z.infer<typeof TipoRepositorioEnum>

// Schemas para parâmetros de rota
export const repositorioDocumentoParamsSchema = z.object({
  id: z.string()
})

// Schemas para query strings
export const listRepositoriosQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional().default(0),
  take: z.coerce.number().int().min(1).max(100).optional().default(10),
  tipo: TipoRepositorioEnum.optional(),
  nome: z.string().optional()
})

// Schemas para request bodies
export const createRepositorioDocumentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  tipo: TipoRepositorioEnum,
  caminho: z.string().min(1, 'Caminho é obrigatório'),
  configuracao: z.string().optional()
})

export const updateRepositorioDocumentoSchema = createRepositorioDocumentoSchema.partial()

export const uploadDocumentoSchema = z.object({
  nomeArquivo: z.string().min(1, 'Nome do arquivo é obrigatório'),
  conteudo: z.string().min(1, 'Conteúdo é obrigatório'),
  metadados: z.string().optional()
})

// Schemas para responses
export const repositorioDocumentoResponseSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string().nullable(),
  tipo: TipoRepositorioEnum,
  caminho: z.string(),
  configuracao: z.string().nullable(),
  ativo: z.boolean(),
  criadoEm: z.string(),
  atualizadoEm: z.string()
})

export const listRepositoriosResponseSchema = z.object({
  repositorios: z.array(repositorioDocumentoResponseSchema),
  total: z.number(),
  skip: z.number(),
  take: z.number()
})

export const uploadDocumentoResponseSchema = z.object({
  id: z.string(),
  nomeArquivo: z.string(),
  tamanho: z.number(),
  tipo: z.string(),
  caminho: z.string(),
  uploadEm: z.string(),
  repositorioId: z.string()
})

// Tipos TypeScript exportados para uso em controllers
export type RepositorioDocumentoParams = z.infer<typeof repositorioDocumentoParamsSchema>
export type ListRepositoriosQuery = z.infer<typeof listRepositoriosQuerySchema>
export type CreateRepositorioDocumentoBody = z.infer<typeof createRepositorioDocumentoSchema>
export type UpdateRepositorioDocumentoBody = z.infer<typeof updateRepositorioDocumentoSchema>
export type UploadDocumentoBody = z.infer<typeof uploadDocumentoSchema>
export type RepositorioDocumentoResponse = z.infer<typeof repositorioDocumentoResponseSchema>
export type ListRepositoriosResponse = z.infer<typeof listRepositoriosResponseSchema>
export type UploadDocumentoResponse = z.infer<typeof uploadDocumentoResponseSchema>
