import { z } from 'zod'

// Schema base da dimensão de qualidade usando Zod v4
export const DimensaoQualidadeSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da dimensão de qualidade'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da dimensão'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da dimensão'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  categoria: z.enum(['INTRINSECA', 'CONTEXTUAL', 'REPRESENTACIONAL', 'ACESSIBILIDADE'], {
    message: 'Categoria deve ser INTRINSECA, CONTEXTUAL, REPRESENTACIONAL ou ACESSIBILIDADE'
  }).describe('Categoria da dimensão de qualidade'),
  peso: z.number().min(0, { message: 'Peso deve ser >= 0' }).max(1, { message: 'Peso deve ser <= 1' }).default(1).describe('Peso da dimensão na avaliação'),
  criterio: z.string().min(1, { message: 'Critério é obrigatório' }).describe('Critério de avaliação'),
  metrica: z.string().optional().describe('Métrica de medição'),
  formula: z.string().optional().describe('Fórmula de cálculo'),
  valorMinimo: z.number().optional().describe('Valor mínimo aceitável'),
  valorMaximo: z.number().optional().describe('Valor máximo aceitável'),
  valorIdeal: z.number().optional().describe('Valor ideal esperado'),
  unidadeMedida: z.string().optional().describe('Unidade de medida'),
  frequenciaAvaliacao: z.enum(['DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL'], {
    message: 'Frequência deve ser DIARIA, SEMANAL, MENSAL, TRIMESTRAL ou ANUAL'
  }).describe('Frequência de avaliação'),
  criticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], {
    message: 'Criticidade deve ser BAIXA, MEDIA, ALTA ou CRITICA'
  }).default('MEDIA').describe('Criticidade da dimensão'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de dimensão de qualidade
export const CreateDimensaoQualidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da dimensão'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da dimensão'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  categoria: z.enum(['INTRINSECA', 'CONTEXTUAL', 'REPRESENTACIONAL', 'ACESSIBILIDADE']).describe('Categoria da dimensão'),
  peso: z.number().min(0).max(1).default(1).describe('Peso da dimensão'),
  criterio: z.string().min(1, { message: 'Critério é obrigatório' }).describe('Critério de avaliação'),
  metrica: z.string().optional().describe('Métrica de medição'),
  formula: z.string().optional().describe('Fórmula de cálculo'),
  valorMinimo: z.number().optional().describe('Valor mínimo aceitável'),
  valorMaximo: z.number().optional().describe('Valor máximo aceitável'),
  valorIdeal: z.number().optional().describe('Valor ideal esperado'),
  unidadeMedida: z.string().optional().describe('Unidade de medida'),
  frequenciaAvaliacao: z.enum(['DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL']).describe('Frequência de avaliação'),
  criticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA').describe('Criticidade da dimensão'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de dimensão de qualidade
export const UpdateDimensaoQualidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da dimensão'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição da dimensão'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).optional().describe('Código identificador'),
  categoria: z.enum(['INTRINSECA', 'CONTEXTUAL', 'REPRESENTACIONAL', 'ACESSIBILIDADE']).optional().describe('Categoria da dimensão'),
  peso: z.number().min(0).max(1).optional().describe('Peso da dimensão'),
  criterio: z.string().min(1, { message: 'Critério é obrigatório' }).optional().describe('Critério de avaliação'),
  metrica: z.string().optional().describe('Métrica de medição'),
  formula: z.string().optional().describe('Fórmula de cálculo'),
  valorMinimo: z.number().optional().describe('Valor mínimo aceitável'),
  valorMaximo: z.number().optional().describe('Valor máximo aceitável'),
  valorIdeal: z.number().optional().describe('Valor ideal esperado'),
  unidadeMedida: z.string().optional().describe('Unidade de medida'),
  frequenciaAvaliacao: z.enum(['DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL']).optional().describe('Frequência de avaliação'),
  criticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).optional().describe('Criticidade da dimensão'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para dimensão com relacionamentos
export const DimensaoQualidadeWithRelationsSchema = DimensaoQualidadeSchema.extend({
  regrasQualidade: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da regra de qualidade'),
    nome: z.string().describe('Nome da regra'),
    tipo: z.string().optional().describe('Tipo da regra')
  })).optional().describe('Regras de qualidade relacionadas'),
  avaliacoes: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da avaliação'),
    valor: z.number().describe('Valor da avaliação'),
    data: z.string().datetime().describe('Data da avaliação')
  })).optional().describe('Avaliações realizadas')
})

// Schema para resposta com dimensão
export const DimensaoQualidadeResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: DimensaoQualidadeWithRelationsSchema
})

// Schema para lista de dimensões
export const DimensoesQualidadeListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(DimensaoQualidadeWithRelationsSchema).describe('Lista de dimensões de qualidade')
})

// Schema para parâmetros de rota
export const DimensaoQualidadeParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da dimensão de qualidade')
})

// Tipos derivados
export type DimensaoQualidade = z.infer<typeof DimensaoQualidadeSchema>
export type CreateDimensaoQualidade = z.infer<typeof CreateDimensaoQualidadeSchema>
export type UpdateDimensaoQualidade = z.infer<typeof UpdateDimensaoQualidadeSchema>
export type DimensaoQualidadeWithRelations = z.infer<typeof DimensaoQualidadeWithRelationsSchema>
export type DimensaoQualidadeParams = z.infer<typeof DimensaoQualidadeParamsSchema>