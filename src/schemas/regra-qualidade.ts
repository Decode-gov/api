import { z } from 'zod'

// Schema para parâmetros de rota
export const RegraQualidadeParamsSchema = z.object({
  id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
})

// Schema para query params
export const RegraQualidadeQueryParamsSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0).optional(),
  take: z.coerce.number().int().min(1).max(100).default(10).optional(),
  orderBy: z.string().optional(),
  dimensaoId: z.string().uuid({ message: 'dimensaoId deve ser um UUID válido' }).optional(),
  tabelaId: z.string().uuid({ message: 'tabelaId deve ser um UUID válido' }).optional(),
  colunaId: z.string().uuid({ message: 'colunaId deve ser um UUID válido' }).optional(),
  responsavelId: z.string().uuid({ message: 'responsavelId deve ser um UUID válido' }).optional()
})

// Schema para criação
export const CreateRegraQualidadeSchema = z.object({
  dimensaoId: z.string().uuid({ message: 'dimensaoId deve ser um UUID válido' }).describe('ID da dimensão de qualidade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da regra'),
  tabelaId: z.string().uuid({ message: 'tabelaId deve ser um UUID válido' }).optional().describe('ID da tabela (opcional)'),
  colunaId: z.string().uuid({ message: 'colunaId deve ser um UUID válido' }).optional().describe('ID da coluna (opcional)'),
  responsavelId: z.string().uuid({ message: 'responsavelId deve ser um UUID válido' }).describe('ID do usuário responsável')
})

// Schema para atualização
export const UpdateRegraQualidadeSchema = z.object({
  dimensaoId: z.string().uuid({ message: 'dimensaoId deve ser um UUID válido' }).optional().describe('ID da dimensão de qualidade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição detalhada da regra'),
  tabelaId: z.string().uuid({ message: 'tabelaId deve ser um UUID válido' }).nullable().optional().describe('ID da tabela (opcional)'),
  colunaId: z.string().uuid({ message: 'colunaId deve ser um UUID válido' }).nullable().optional().describe('ID da coluna (opcional)'),
  responsavelId: z.string().uuid({ message: 'responsavelId deve ser um UUID válido' }).optional().describe('ID do usuário responsável')
})

// Schema de regra com relacionamentos
export const RegraQualidadeWithRelationsSchema = z.object({
  id: z.string().uuid(),
  dimensaoId: z.string().uuid(),
  descricao: z.string(),
  tabelaId: z.string().uuid().nullable(),
  colunaId: z.string().uuid().nullable(),
  responsavelId: z.string().uuid(),
  dimensao: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    descricao: z.string().nullable(),
    politicaId: z.string().uuid()
  }),
  tabela: z.object({
    id: z.string().uuid(),
    nome: z.string()
  }).nullable(),
  coluna: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    descricao: z.string().nullable()
  }).nullable(),
  responsavel: z.object({
    id: z.string().uuid(),
    nome: z.string(),
    email: z.string()
  }),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable()
})

// Schema para resposta única
export const RegraQualidadeResponseSchema = z.object({
  data: RegraQualidadeWithRelationsSchema
})

// Schema para lista
export const RegrasQualidadeListResponseSchema = z.object({
  data: z.array(RegraQualidadeWithRelationsSchema)
})

// Tipos derivados
export type RegraQualidadeParams = z.infer<typeof RegraQualidadeParamsSchema>
export type RegraQualidadeQueryParams = z.infer<typeof RegraQualidadeQueryParamsSchema>
export type CreateRegraQualidade = z.infer<typeof CreateRegraQualidadeSchema>
export type UpdateRegraQualidade = z.infer<typeof UpdateRegraQualidadeSchema>
export type RegraQualidadeWithRelations = z.infer<typeof RegraQualidadeWithRelationsSchema>
