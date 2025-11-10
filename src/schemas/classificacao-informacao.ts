import { z } from 'zod'
import { DefinicaoSchema } from './definicao'
import { ListaReferenciaSchema } from './lista-referencia'
import { ListaClassificacaoSchema } from '../routes/lista-classificacao-zod.routes'

// Schema base da classificação de informação usando Zod v4
export const ClassificacaoInformacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da classificação'),
  classificacaoId: z.uuid({ message: 'ID da classificação deve ser um UUID válido' }).describe('ID da lista de classificação relacionada'),
  classificacao: ListaReferenciaSchema.describe('Lista de referência da classificação'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).describe('ID do termo relacionado'),
  termo: DefinicaoSchema.describe('Termo relacionado'),
  createdAt: z.coerce.date().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

// Schema para criação de classificação
export const CreateClassificacaoInformacaoSchema = z.object({
  classificacaoId: z.uuid({ message: 'ID da classificação deve ser um UUID válido' }).describe('ID da lista de classificação relacionada'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).describe('ID do termo'),
})

// Schema para atualização de classificação
export const UpdateClassificacaoInformacaoSchema = z.object({
  classificacaoId: z.uuid({ message: 'ID da classificação deve ser um UUID válido' }).optional().describe('ID da lista de classificação relacionada'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).optional().describe('ID do termo'),
})

// Schema para classificação com relacionamentos
export const ClassificacaoInformacaoWithRelationsSchema = ClassificacaoInformacaoSchema.extend({
  classificacao: ListaClassificacaoSchema.describe('Lista de referência da classificação'),
  termo: DefinicaoSchema.describe('Termo relacionado'),
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