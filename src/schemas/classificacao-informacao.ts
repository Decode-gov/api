import { z } from 'zod'

// Schema base da classificação de informação usando Zod v4
export const ClassificacaoInformacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da classificação'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da classificação'),
  descricao: z.string().optional().describe('Descrição da classificação'),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).describe('ID da política relacionada'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).optional().describe('ID do termo relacionado'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de classificação
export const CreateClassificacaoInformacaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da classificação'),
  descricao: z.string().optional().describe('Descrição da classificação'),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).describe('ID da política'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).optional().describe('ID do termo'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de classificação
export const UpdateClassificacaoInformacaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da classificação'),
  descricao: z.string().optional().describe('Descrição da classificação'),
  politicaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).optional().describe('ID da política'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).optional().describe('ID do termo'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para atribuir termo
export const AtribuirTermoSchema = z.object({
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).describe('ID do termo para atribuir')
})

// Schema para classificação com relacionamentos
export const ClassificacaoInformacaoWithRelationsSchema = ClassificacaoInformacaoSchema.extend({
  politica: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da política'),
    nome: z.string().describe('Nome da política'),
    versao: z.string().optional().describe('Versão da política')
  }).describe('Política relacionada'),
  termo: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do termo'),
    nome: z.string().describe('Nome do termo'),
    definicao: z.string().optional().describe('Definição do termo')
  }).optional().describe('Termo relacionado'),
  produtos: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do produto'),
    nome: z.string().describe('Nome do produto')
  })).optional().describe('Produtos relacionados')
})

// Schema para resposta com classificação
export const ClassificacaoInformacaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ClassificacaoInformacaoWithRelationsSchema
})

// Schema para lista de classificações
export const ClassificacoesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ClassificacaoInformacaoWithRelationsSchema).describe('Lista de classificações')
})

// Schema para parâmetros de rota
export const ClassificacaoInformacaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da classificação de informação')
})

// Tipos derivados
export type ClassificacaoInformacao = z.infer<typeof ClassificacaoInformacaoSchema>
export type CreateClassificacaoInformacao = z.infer<typeof CreateClassificacaoInformacaoSchema>
export type UpdateClassificacaoInformacao = z.infer<typeof UpdateClassificacaoInformacaoSchema>
export type ClassificacaoInformacaoWithRelations = z.infer<typeof ClassificacaoInformacaoWithRelationsSchema>
export type ClassificacaoInformacaoParams = z.infer<typeof ClassificacaoInformacaoParamsSchema>