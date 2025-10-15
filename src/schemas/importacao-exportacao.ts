import { z } from 'zod'

// Enums para importação/exportação
export const TipoOperacaoEnum = z.enum(['IMPORTACAO', 'EXPORTACAO'])
export const StatusOperacaoEnum = z.enum(['PROCESSANDO', 'CONCLUIDO', 'CONCLUIDO_COM_ERROS', 'ERRO'])
export const FormatoArquivoEnum = z.enum(['json', 'csv', 'excel'])

export const TipoEntidadeEnum = z.enum([
  'usuario', 'sistema', 'processo', 'comunidade',
  'politica', 'tabela', 'coluna', 'termo',
  'tipoDados', 'classificacaoInformacao',
  'repositorioDocumento', 'dimensaoQualidade', 'regraQualidade',
  'parteEnvolvida', 'regulacaoCompleta', 'criticidadeRegulatoria'
])

// Schema para query de exportação
export const ExportacaoQuerySchema = z.object({
  tipoEntidade: TipoEntidadeEnum,
  formato: FormatoArquivoEnum.default('json'),
  filtros: z.string().optional()
})

// Schema para importação usando Zod v4
export const ImportacaoSchema = z.object({
  arquivo: z.string().min(1, { message: 'Arquivo é obrigatório' }).describe('Caminho ou conteúdo do arquivo'),
  tipoEntidade: TipoEntidadeEnum.describe('Tipo de entidade para importação'),
  sobrescrever: z.boolean().default(false).describe('Se deve sobrescrever registros existentes'),
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário responsável')
})

// Schema para query de listagem com coerção do Zod v4
export const ImportacaoExportacaoQuerySchema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'Skip deve ser >= 0' }).optional().describe('Registros para pular'),
  take: z.coerce.number().int().min(1, { message: 'Take deve ser >= 1' }).max(100, { message: 'Máximo 100 registros' }).optional().describe('Registros para retornar'),
  tipo: TipoOperacaoEnum.optional().describe('Filtrar por tipo de operação'),
  status: StatusOperacaoEnum.optional().describe('Filtrar por status'),
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).optional().describe('Filtrar por usuário')
})

// Schema de erro na importação
export const ErroImportacaoSchema = z.object({
  linha: z.number().int(),
  erro: z.string()
})

// Schemas de resposta
export const ExportacaoResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    tipoEntidade: z.string(),
    formato: z.string(),
    totalRegistros: z.number(),
    arquivo: z.string(),
    logId: z.string().optional()
  })
})

export const ImportacaoResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    importacaoId: z.string(),
    status: z.enum(['CONCLUIDO', 'CONCLUIDO_COM_ERROS']),
    totalRegistros: z.number(),
    registrosProcessados: z.number(),
    registrosComErro: z.number(),
    erros: z.array(ErroImportacaoSchema)
  })
})

export const OperacaoImportacaoExportacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador da operação'),
  tipo: TipoOperacaoEnum.describe('Tipo de operação'),
  tipoEntidade: z.string().describe('Tipo de entidade processada'),
  status: StatusOperacaoEnum.describe('Status atual da operação'),
  formato: z.string().nullable().describe('Formato do arquivo'),
  totalRegistros: z.number().int().min(0).describe('Total de registros'),
  registrosProcessados: z.number().int().min(0).describe('Registros processados com sucesso'),
  registrosComErro: z.number().int().min(0).describe('Registros com erro'),
  usuarioId: z.uuid({ message: 'ID do usuário deve ser um UUID válido' }).describe('ID do usuário responsável'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização'),
  usuario: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do usuário'),
    nome: z.string().describe('Nome do usuário'),
    email: z.email({ message: 'Email inválido' }).describe('Email do usuário')
  }).optional().describe('Dados do usuário')
})

export const OperacoesListResponseSchema = z.object({
  message: z.string(),
  data: z.array(OperacaoImportacaoExportacaoSchema)
})

export const OperacaoResponseSchema = z.object({
  message: z.string(),
  data: OperacaoImportacaoExportacaoSchema
})

// Schema para parâmetros de rota
export const ImportacaoExportacaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da operação')
})
