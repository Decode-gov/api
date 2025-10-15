import { z } from 'zod'

// Schema base da necessidade de informação alinhado com o Prisma
export const NecessidadeInformacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da necessidade de informação'),
  questaoGerencial: z.string().min(1, { message: 'Questão gerencial é obrigatória' }).describe('Questão gerencial'),
  elementoEstrategico: z.string().nullable().optional().describe('Elemento estratégico'),
  elementoTatico: z.string().nullable().optional().describe('Elemento tático'),
  origemQuestao: z.string().min(1, { message: 'Origem da questão é obrigatória' }).describe('Origem da questão'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade'),
  createdAt: z.string().datetime().nullable().optional().describe('Data de criação'),
  updatedAt: z.string().datetime().nullable().optional().describe('Data de última atualização')
})

// Schema para criação de necessidade de informação
export const CreateNecessidadeInformacaoSchema = z.object({
  questaoGerencial: z.string().min(1, { message: 'Questão gerencial é obrigatória' }).describe('Questão gerencial'),
  elementoEstrategico: z.string().optional().describe('Elemento estratégico'),
  elementoTatico: z.string().optional().describe('Elemento tático'),
  origemQuestao: z.string().min(1, { message: 'Origem da questão é obrigatória' }).describe('Origem da questão'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade')
})

// Schema para atualização de necessidade de informação
export const UpdateNecessidadeInformacaoSchema = z.object({
  questaoGerencial: z.string().min(1, { message: 'Questão gerencial é obrigatória' }).optional().describe('Questão gerencial'),
  elementoEstrategico: z.string().optional().describe('Elemento estratégico'),
  elementoTatico: z.string().optional().describe('Elemento tático'),
  origemQuestao: z.string().min(1, { message: 'Origem da questão é obrigatória' }).optional().describe('Origem da questão'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade')
})

// Schema para necessidade com relacionamentos
export const NecessidadeInformacaoWithRelationsSchema = NecessidadeInformacaoSchema.extend({
  comunidade: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da comunidade'),
    nome: z.string().describe('Nome da comunidade')
  }).describe('Comunidade relacionada'),
  tabelas: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da tabela'),
    nome: z.string().describe('Nome da tabela')
  })).optional().describe('Tabelas relacionadas'),
  colunas: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da coluna'),
    nome: z.string().describe('Nome da coluna')
  })).optional().describe('Colunas relacionadas')
})

// Schema para resposta com necessidade
export const NecessidadeInformacaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: NecessidadeInformacaoWithRelationsSchema
})

// Schema para lista de necessidades
export const NecessidadesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(NecessidadeInformacaoWithRelationsSchema).describe('Lista de necessidades de informação')
})

// Schema para parâmetros de rota
export const NecessidadeInformacaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da necessidade de informação')
})

// Tipos derivados
export type NecessidadeInformacao = z.infer<typeof NecessidadeInformacaoSchema>
export type CreateNecessidadeInformacao = z.infer<typeof CreateNecessidadeInformacaoSchema>
export type UpdateNecessidadeInformacao = z.infer<typeof UpdateNecessidadeInformacaoSchema>
export type NecessidadeInformacaoWithRelations = z.infer<typeof NecessidadeInformacaoWithRelationsSchema>
export type NecessidadeInformacaoParams = z.infer<typeof NecessidadeInformacaoParamsSchema>