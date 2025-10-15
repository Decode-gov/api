import { z } from 'zod'

// Schema base do papel usando Zod v4
export const PapelSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do papel'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do papel'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição do papel'),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).describe('ID da política relacionada'),
  ativo: z.boolean().default(true).describe('Status de ativação do papel'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de papel
export const CreatePapelSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do papel'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição do papel'),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).describe('ID da política'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de papel
export const UpdatePapelSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do papel'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição do papel'),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).optional().describe('ID da política'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para papel com relacionamentos
export const PapelWithRelationsSchema = PapelSchema.extend({
  politica: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da política'),
    nome: z.string().describe('Nome da política'),
    versao: z.string().optional().describe('Versão da política')
  }).describe('Política relacionada'),
  usuarios: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do usuário'),
    nome: z.string().describe('Nome do usuário'),
    email: z.email({ message: 'Email inválido' }).describe('Email do usuário')
  })).optional().describe('Usuários com este papel')
})

// Schema para resposta com papel
export const PapelResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: PapelWithRelationsSchema
})

// Schema para lista de papéis
export const PapeisListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(PapelWithRelationsSchema).describe('Lista de papéis')
})

// Schema para parâmetros de rota do papel
export const PapelParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do papel')
})

// Tipos derivados
export type Papel = z.infer<typeof PapelSchema>
export type CreatePapel = z.infer<typeof CreatePapelSchema>
export type UpdatePapel = z.infer<typeof UpdatePapelSchema>
export type PapelWithRelations = z.infer<typeof PapelWithRelationsSchema>
export type PapelParams = z.infer<typeof PapelParamsSchema>