import { z } from 'zod'

// Schema para períodos de tempo
export const PeriodoSchema = z.enum(['semana', 'mes', 'trimestre', 'ano'])

// Schema para query parameters do dashboard
export const DashboardQuerySchema = z.object({
  periodo: PeriodoSchema.optional()
})

// Schema para métricas gerais usando Zod v4
export const MetricasGeraisSchema = z.object({
  periodo: z.string().describe('Período analisado'),
  dataInicio: z.string().datetime({ message: 'Data de início inválida' }).describe('Data de início do período'),
  metricas: z.object({
    totalUsuarios: z.number().int().min(0).describe('Total de usuários'),
    totalSistemas: z.number().int().min(0).describe('Total de sistemas'),
    totalProcessos: z.number().int().min(0).describe('Total de processos'),
    totalTabelas: z.number().int().min(0).describe('Total de tabelas'),
    totalColunas: z.number().int().min(0).describe('Total de colunas'),
    totalTermos: z.number().int().min(0).describe('Total de termos'),
    totalPoliticas: z.number().int().min(0).describe('Total de políticas'),
    totalComunidades: z.number().int().min(0).describe('Total de comunidades')
  }).describe('Métricas totalizadoras'),
  crescimento: z.object({
    usuarios: z.number().describe('Crescimento de usuários (%)'),
    sistemas: z.number().describe('Crescimento de sistemas (%)'),
    processos: z.number().describe('Crescimento de processos (%)'),
    tabelas: z.number().describe('Crescimento de tabelas (%)'),
    colunas: z.number().describe('Crescimento de colunas (%)')
  }).describe('Indicadores de crescimento'),
  atividadesRecentes: z.array(
    z.object({
      data: z.string().datetime({ message: 'Data inválida' }).describe('Data da atividade'),
      tipo: z.string().describe('Tipo de atividade'),
      descricao: z.string().describe('Descrição da atividade'),
      usuario: z.string().describe('Usuário responsável'),
      entidade: z.string().describe('Entidade afetada'),
      entidadeId: z.uuid({ message: 'ID da entidade inválido' }).describe('ID da entidade')
    })
  ).describe('Lista de atividades recentes')
})

// Schema para parâmetros do usuário
export const UsuarioParamsSchema = z.object({
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário')
})

// Schema para dashboard do usuário
export const DashboardUsuarioSchema = z.object({
  usuario: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do usuário'),
    nome: z.string().describe('Nome do usuário'),
    email: z.email({ message: 'Email inválido' }).describe('Email do usuário'),
    createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de cadastro')
  }).describe('Dados do usuário'),
  periodo: z.string().describe('Período analisado'),
  dataInicio: z.string().datetime({ message: 'Data de início inválida' }).describe('Data de início'),
  estatisticasAtividade: z.object({
    totalOperacoes: z.number().int().min(0).describe('Total de operações'),
    operacoesPorTipo: z.object({
      CREATE: z.number().int().min(0).describe('Operações de criação'),
      UPDATE: z.number().int().min(0).describe('Operações de atualização'),
      DELETE: z.number().int().min(0).describe('Operações de exclusão')
    }).describe('Detalhamento por tipo de operação'),
    entidadesAfetadas: z.number().int().min(0).describe('Número de entidades afetadas')
  }).describe('Estatísticas de atividade do usuário')
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
