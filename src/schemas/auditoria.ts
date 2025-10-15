import { z } from 'zod'

// Enum para operações de auditoria
export const OperacaoAuditoriaEnum = z.enum(['CREATE', 'UPDATE', 'DELETE'])

// Schema base do log de auditoria usando Zod v4
export const LogAuditoriaSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do log'),
  entidade: z.string().min(1, { message: 'Entidade é obrigatória' }).describe('Nome da entidade auditada'),
  entidadeId: z.uuid({ message: 'ID da entidade deve ser um UUID válido' }).describe('ID da entidade auditada'),
  operacao: OperacaoAuditoriaEnum.describe('Tipo de operação realizada'),
  timestamp: z.string().datetime({ message: 'Timestamp inválido' }).describe('Data e hora da operação'),
  dadosAntes: z.string().nullable().describe('Dados antes da alteração (JSON)'),
  dadosDepois: z.string().nullable().describe('Dados após a alteração (JSON)'),
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário que executou a operação'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação do log'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização do log')
})

// Schema com relacionamento do usuário
export const LogAuditoriaComUsuarioSchema = LogAuditoriaSchema.extend({
  usuario: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do usuário'),
    nome: z.string().describe('Nome do usuário'),
    email: z.email({ message: 'Email inválido' }).describe('Email do usuário')
  }).describe('Dados do usuário que executou a operação')
})

// Schema para query de listagem com coerção do Zod v4
export const AuditoriaQuerySchema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'Skip deve ser >= 0' }).optional().describe('Registros para pular'),
  take: z.coerce.number().int().min(1, { message: 'Take deve ser >= 1' }).max(100, { message: 'Máximo 100 registros' }).optional().describe('Registros para retornar'),
  orderBy: z.string().optional().describe('Campo para ordenação'),
  entidade: z.string().optional().describe('Filtrar por entidade'),
  entidadeId: z.uuid({ message: 'ID da entidade deve ser um UUID válido' }).optional().describe('Filtrar por ID da entidade'),
  operacao: OperacaoAuditoriaEnum.optional().describe('Filtrar por tipo de operação'),
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).optional().describe('Filtrar por usuário'),
  dataInicio: z.string().datetime({ message: 'Data de início inválida' }).optional().describe('Data de início do filtro'),
  dataFim: z.string().datetime({ message: 'Data de fim inválida' }).optional().describe('Data de fim do filtro')
})

// Schema para criar log de auditoria
export const CreateLogAuditoriaSchema = z.object({
  entidade: z.string().min(1, { message: 'Entidade é obrigatória' }).describe('Nome da entidade'),
  entidadeId: z.uuid({ message: 'ID da entidade deve ser um UUID válido' }).describe('ID da entidade'),
  operacao: OperacaoAuditoriaEnum.describe('Tipo de operação'),
  dadosAntes: z.string().nullable().optional().describe('Dados antes da alteração'),
  dadosDepois: z.string().nullable().optional().describe('Dados após a alteração'),
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário')
})

// Schema para parâmetros de relatório
export const RelatorioEntidadeParamsSchema = z.object({
  entidade: z.string().min(1, { message: 'Entidade é obrigatória' }).describe('Nome da entidade'),
  entidadeId: z.uuid({ message: 'ID da entidade deve ser um UUID válido' }).describe('ID da entidade')
})

// Schema para atividades do usuário
export const AtividadesUsuarioParamsSchema = z.object({
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário')
})

export const AtividadesUsuarioQuerySchema = z.object({
  dias: z.coerce.number().int().min(1, { message: 'Mínimo 1 dia' }).max(365, { message: 'Máximo 365 dias' }).optional().describe('Número de dias para análise'),
  skip: z.coerce.number().int().min(0, { message: 'Skip deve ser >= 0' }).optional().describe('Registros para pular'),
  take: z.coerce.number().int().min(1, { message: 'Take deve ser >= 1' }).max(100, { message: 'Máximo 100 registros' }).optional().describe('Registros para retornar')
})

// Schemas de resposta
export const PaginationInfoSchema = z.object({
  total: z.number(),
  skip: z.number(),
  take: z.number(),
  pages: z.number()
})

export const LogsAuditoriaListResponseSchema = z.object({
  message: z.string(),
  data: z.array(LogAuditoriaComUsuarioSchema),
  pagination: PaginationInfoSchema.optional()
})

export const LogAuditoriaResponseSchema = z.object({
  message: z.string(),
  data: LogAuditoriaComUsuarioSchema
})

export const EstatisticasOperacoesSchema = z.object({
  CREATE: z.number(),
  UPDATE: z.number(),
  DELETE: z.number()
})

export const RelatorioEntidadeResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    entidade: z.string(),
    entidadeId: z.string(),
    estatisticas: z.object({
      totalOperacoes: z.number(),
      operacoesPorTipo: EstatisticasOperacoesSchema,
      primeiraOperacao: z.string().nullable(),
      ultimaOperacao: z.string().nullable(),
      usuariosEnvolvidos: z.number()
    }),
    logs: z.array(
      z.object({
        id: z.string(),
        operacao: z.string(),
        timestamp: z.string(),
        dadosAntes: z.record(z.string(), z.unknown()).nullable(),
        dadosDepois: z.record(z.string(), z.unknown()).nullable(),
        usuario: z.object({
          nome: z.string(),
          email: z.string()
        })
      })
    )
  })
})

export const AtividadesUsuarioResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    usuarioId: z.string(),
    estatisticas: z.object({
      totalOperacoes: z.number(),
      operacoesPorTipo: EstatisticasOperacoesSchema,
      entidadesAfetadas: z.array(z.string()),
      diasAnalisados: z.number()
    }),
    logs: z.array(
      z.object({
        id: z.string(),
        entidade: z.string(),
        entidadeId: z.string(),
        operacao: z.string(),
        timestamp: z.string()
      })
    )
  })
})

// Schema para parâmetros de rota
export const AuditoriaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do log de auditoria')
})
