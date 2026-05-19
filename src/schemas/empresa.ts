import { z } from 'zod';

const EmpresaBaseSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da empresa'),
})

export const EmpresaSchema = EmpresaBaseSchema.extend({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da empresa'),
  deletedAt: z.coerce.date().nullable().optional().describe('Data de exclusão (soft delete)'),
})

export const CreateEmpresaSchema = EmpresaBaseSchema

export const UpdateEmpresaSchema = EmpresaBaseSchema.partial()

export const EmpresaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: EmpresaSchema
})

export const EmpresasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(EmpresaSchema).describe('Lista de empresas')
})

export const EmpresaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da empresa')
})

export type Empresa = z.infer<typeof EmpresaSchema>
export type CreateEmpresa = z.infer<typeof CreateEmpresaSchema>
export type UpdateEmpresa = z.infer<typeof UpdateEmpresaSchema>
