import { z } from 'zod';
import { TimestampsSchema } from './common.js';

// Schema base para dados do repositório de documento (apenas campos de input)
const RepositorioDocumentoBaseSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do repositório de documentos'),
  ged: z.boolean().default(false).describe('Indica se é um repositório GED (Gerenciamento Eletrônico de Documentos)'),
  rede: z.boolean().default(false).describe('Indica se é um repositório em rede')
})

// Schema completo com ID e timestamps
export const RepositorioDocumentoSchema = z.object({
  ...RepositorioDocumentoBaseSchema.shape,
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do repositório'),
  ...TimestampsSchema.partial().shape
})

// Schema para criação (apenas campos necessários)
export const CreateRepositorioDocumentoSchema = RepositorioDocumentoBaseSchema

// Schema para atualização (todos os campos opcionais)
export const UpdateRepositorioDocumentoSchema = RepositorioDocumentoBaseSchema.partial()

// Schema para resposta com repositório
export const RepositorioDocumentoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: RepositorioDocumentoSchema
})

// Schema para lista de repositórios
export const RepositoriosDocumentoListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(RepositorioDocumentoSchema).describe('Lista de repositórios de documentos')
})

// Schema para parâmetros de rota
export const RepositorioDocumentoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do repositório')
})

// Schema para query params
export const RepositorioDocumentoQueryParamsSchema = z.object({
  empresaId: z.uuid({ message: 'empresaId deve ser um UUID válido' }).optional().describe('Filtrar por empresa'),
  nome: z.string().optional().describe('Filtrar por nome'),
  ged: z.coerce.boolean().optional().describe('Filtrar por repositórios GED'),
  rede: z.coerce.boolean().optional().describe('Filtrar por repositórios em rede')
})

// Tipos derivados
export type RepositorioDocumento = z.infer<typeof RepositorioDocumentoSchema>
export type CreateRepositorioDocumento = z.infer<typeof CreateRepositorioDocumentoSchema>
export type UpdateRepositorioDocumento = z.infer<typeof UpdateRepositorioDocumentoSchema>
export type RepositorioDocumentoParams = z.infer<typeof RepositorioDocumentoParamsSchema>
export type RepositorioDocumentoQueryParams = z.infer<typeof RepositorioDocumentoQueryParamsSchema>
