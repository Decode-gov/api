import { z } from 'zod'

// Schema para períodos de tempo
export const PeriodoSchema = z.enum(['semana', 'mes', 'trimestre', 'ano'])

// Schema para query parameters do dashboard
export const DashboardQuerySchema = z.object({
  periodo: PeriodoSchema.optional()
})

// Schema para métricas gerais - compatível com o retorno do controller
export const MetricasGeraisSchema = z.object({
  totalUsuarios: z.number().int().min(0).describe('Total de usuários'),
  totalSistemas: z.number().int().min(0).describe('Total de sistemas'),
  totalProcessos: z.number().int().min(0).describe('Total de processos'),
  totalTabelas: z.number().int().min(0).describe('Total de tabelas'),
  totalColunas: z.number().int().min(0).describe('Total de colunas'),
  totalTermos: z.number().int().min(0).describe('Total de termos'),
  totalPoliticas: z.number().int().min(0).describe('Total de políticas'),
  totalComunidades: z.number().int().min(0).describe('Total de comunidades')
})

// Schema para parâmetros do usuário
export const UsuarioParamsSchema = z.object({
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário')
})

// Schema para dashboard do usuário - compatível com o retorno do controller
export const DashboardUsuarioSchema = z.object({
  metricas: z.object({
    totalSistemas: z.number().int().min(0).describe('Total de sistemas'),
    totalProcessos: z.number().int().min(0).describe('Total de processos'),
    totalComunidades: z.number().int().min(0).describe('Total de comunidades')
  }).describe('Métricas do dashboard'),
  usuario: z.object({
    id: z.string().describe('ID do usuário')
  }).describe('Dados do usuário')
})

// Schema para dashboard de qualidade
export const DashboardQualidadeSchema = z.object({
  periodo: z.string(),
  dataInicio: z.string(),
  resumo: z.object({
    totalDimensoes: z.number(),
    totalRegras: z.number(),
    regrasAtivas: z.number(),
    regrasInativas: z.number(),
    percentualAtivo: z.number()
  })
})

// Schemas de resposta
export const MetricasGeraisResponseSchema = z.object({
  message: z.string(),
  data: MetricasGeraisSchema
})

export const DashboardUsuarioResponseSchema = z.object({
  message: z.string(),
  data: DashboardUsuarioSchema
})

export const DashboardQualidadeResponseSchema = z.object({
  message: z.string(),
  data: DashboardQualidadeSchema
})
