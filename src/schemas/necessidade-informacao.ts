import { z } from 'zod'

// Schema base da necessidade de informação alinhado com o Prisma
export const NecessidadeInformacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da necessidade de informação'),
  questaoGerencial: z.string().min(1, { message: 'Questão gerencial é obrigatória' }).describe('Questão gerencial'),
  elementoEstrategico: z.string().nullable().describe('Elemento estratégico'),
  elementoTatico: z.string().nullable().describe('Elemento tático'),
  origemQuestao: z.string().min(1, { message: 'Origem da questão é obrigatória' }).describe('Origem da questão'),
  createdAt: z.coerce.date().nullable().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

// Schema para criação de necessidade de informação
export const CreateNecessidadeInformacaoSchema = z.object({
  questaoGerencial: z.string().min(1, { message: 'Questão gerencial é obrigatória' }).describe('Questão gerencial'),
  elementoEstrategico: z.string().nullable().optional().describe('Elemento estratégico'),
  elementoTatico: z.string().nullable().optional().describe('Elemento tático'),
  origemQuestao: z.string().min(1, { message: 'Origem da questão é obrigatória' }).describe('Origem da questão')
})

// Schema para atualização de necessidade de informação
export const UpdateNecessidadeInformacaoSchema = z.object({
  questaoGerencial: z.string().min(1, { message: 'Questão gerencial é obrigatória' }).optional().describe('Questão gerencial'),
  elementoEstrategico: z.string().nullable().optional().describe('Elemento estratégico'),
  elementoTatico: z.string().nullable().optional().describe('Elemento tático'),
  origemQuestao: z.string().min(1, { message: 'Origem da questão é obrigatória' }).optional().describe('Origem da questão')
})


// Schema para resposta com necessidade
export const NecessidadeInformacaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: NecessidadeInformacaoSchema
})

// Schema para lista de necessidades
export const NecessidadesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(NecessidadeInformacaoSchema).describe('Lista de necessidades de informação')
})

// Schema para parâmetros de rota
export const NecessidadeInformacaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da necessidade de informação')
})

// Schema para query string de listagem
export const NecessidadeInformacaoQuerySchema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'Skip deve ser >= 0' }).default(0).describe('Registros para pular'),
  take: z.coerce.number().int().min(1, { message: 'Take deve ser >= 1' }).max(100, { message: 'Máximo 100 registros' }).default(10).describe('Registros para retornar'),
  orderBy: z.string().optional().describe('Campo para ordenação'),
  search: z.string().optional().describe('Busca em questão gerencial')
})

// Tipos derivados
export type NecessidadeInformacao = z.infer<typeof NecessidadeInformacaoSchema>
export type CreateNecessidadeInformacao = z.infer<typeof CreateNecessidadeInformacaoSchema>
export type UpdateNecessidadeInformacao = z.infer<typeof UpdateNecessidadeInformacaoSchema>
export type NecessidadeInformacaoParams = z.infer<typeof NecessidadeInformacaoParamsSchema>
export type NecessidadeInformacaoQuery = z.infer<typeof NecessidadeInformacaoQuerySchema>