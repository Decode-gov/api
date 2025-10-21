import { z } from 'zod'

// Schema para parâmetros de rota
export const DocumentoRepositorioParamsSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
})

// Schema para query params
export const DocumentoRepositorioQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.string().optional().default('createdAt'),
  termoId: z.string().uuid().optional(),
  repositorioId: z.string().uuid().optional()
})

// Schema base do documento repositório
const DocumentoRepositorioBaseSchema = z.object({
  termoId: z.string().uuid('ID do termo deve ser um UUID válido'),
  repositorioId: z.string().uuid('ID do repositório deve ser um UUID válido')
})

// Schema para criação
export const CreateDocumentoRepositorioSchema = DocumentoRepositorioBaseSchema

// Schema para atualização
export const UpdateDocumentoRepositorioSchema = DocumentoRepositorioBaseSchema.partial()

// Schema com relacionamentos
export const DocumentoRepositorioWithRelationsSchema = DocumentoRepositorioBaseSchema.extend({
  id: z.string().uuid(),
  termo: z.object({
    id: z.string().uuid(),
    termo: z.string(),
    definicao: z.string(),
    sigla: z.string().nullable()
  }),
  repositorio: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    tipo: z.string(),
    localizacao: z.string()
  }),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
})

// Schema para resposta única
export const DocumentoRepositorioResponseSchema = z.object({
  message: z.string(),
  data: DocumentoRepositorioWithRelationsSchema
})

// Schema para lista de respostas
export const DocumentosRepositorioListResponseSchema = z.object({
  message: z.string(),
  data: z.array(DocumentoRepositorioWithRelationsSchema),
  pagination: z.object({
    total: z.number(),
    skip: z.number(),
    take: z.number(),
    pages: z.number()
  })
})

// Tipos TypeScript inferidos
export type DocumentoRepositorioParams = z.infer<typeof DocumentoRepositorioParamsSchema>
export type DocumentoRepositorioQueryParams = z.infer<typeof DocumentoRepositorioQueryParamsSchema>
export type CreateDocumentoRepositorioInput = z.infer<typeof CreateDocumentoRepositorioSchema>
export type UpdateDocumentoRepositorioInput = z.infer<typeof UpdateDocumentoRepositorioSchema>
export type DocumentoRepositorioWithRelations = z.infer<typeof DocumentoRepositorioWithRelationsSchema>
