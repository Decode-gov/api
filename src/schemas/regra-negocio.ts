import { z } from 'zod'

// Schema base da regra de negócio usando Zod v4
export const RegraNegocioSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da regra de negócio'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da regra de negócio'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador da regra'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da regra'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  tipoRegra: z.enum(['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO'], {
    message: 'Tipo deve ser VALIDACAO, TRANSFORMACAO, CALCULO, CONTROLE ou NEGOCIO'
  }).describe('Tipo da regra de negócio'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], {
    message: 'Prioridade deve ser BAIXA, MEDIA, ALTA ou CRITICA'
  }).default('MEDIA').describe('Prioridade da regra'),
  complexidade: z.enum(['BAIXA', 'MEDIA', 'ALTA'], {
    message: 'Complexidade deve ser BAIXA, MEDIA ou ALTA'
  }).default('MEDIA').describe('Complexidade da implementação'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).describe('ID do processo relacionado'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema relacionado'),
  versao: z.string().default('1.0').describe('Versão da regra'),
  status: z.enum(['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA'], {
    message: 'Status deve ser ATIVA, INATIVA, EM_DESENVOLVIMENTO ou DESCONTINUADA'
  }).default('ATIVA').describe('Status da regra'),
  dataInicioVigencia: z.iso.datetime({ message: 'Data de início deve ser uma data válida' }).optional().describe('Data de início da vigência'),
  dataFimVigencia: z.iso.datetime({ message: 'Data de fim deve ser uma data válida' }).optional().describe('Data de fim da vigência'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de regra de negócio
export const CreateRegraNegocioSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da regra de negócio'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  tipoRegra: z.enum(['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO']).describe('Tipo da regra'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA').describe('Prioridade da regra'),
  complexidade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).default('MEDIA').describe('Complexidade da implementação'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).describe('ID do processo'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  versao: z.string().default('1.0').describe('Versão da regra'),
  status: z.enum(['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA']).default('ATIVA').describe('Status da regra'),
  dataInicioVigencia: z.iso.datetime({ message: 'Data de início deve ser uma data válida' }).optional().describe('Data de início da vigência'),
  dataFimVigencia: z.iso.datetime({ message: 'Data de fim deve ser uma data válida' }).optional().describe('Data de fim da vigência'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de regra de negócio
export const UpdateRegraNegocioSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da regra de negócio'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).optional().describe('Código identificador'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição detalhada'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  tipoRegra: z.enum(['VALIDACAO', 'TRANSFORMACAO', 'CALCULO', 'CONTROLE', 'NEGOCIO']).optional().describe('Tipo da regra'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).optional().describe('Prioridade da regra'),
  complexidade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional().describe('Complexidade da implementação'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).optional().describe('ID do processo'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  versao: z.string().optional().describe('Versão da regra'),
  status: z.enum(['ATIVA', 'INATIVA', 'EM_DESENVOLVIMENTO', 'DESCONTINUADA']).optional().describe('Status da regra'),
  dataInicioVigencia: z.iso.datetime({ message: 'Data de início deve ser uma data válida' }).optional().describe('Data de início da vigência'),
  dataFimVigencia: z.iso.datetime({ message: 'Data de fim deve ser uma data válida' }).optional().describe('Data de fim da vigência'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para regra com relacionamentos
export const RegraNegocioWithRelationsSchema = RegraNegocioSchema.extend({
  processo: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do processo'),
    nome: z.string().describe('Nome do processo'),
    codigo: z.string().optional().describe('Código do processo')
  }).describe('Processo relacionado'),
  sistema: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do sistema'),
    nome: z.string().describe('Nome do sistema'),
    versao: z.string().optional().describe('Versão do sistema')
  }).optional().describe('Sistema relacionado'),
  regrasQualidade: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da regra de qualidade'),
    nome: z.string().describe('Nome da regra de qualidade'),
    tipo: z.string().optional().describe('Tipo da regra de qualidade')
  })).optional().describe('Regras de qualidade relacionadas'),
  documentos: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do documento'),
    nome: z.string().describe('Nome do documento'),
    tipo: z.string().optional().describe('Tipo do documento')
  })).optional().describe('Documentos relacionados')
})

// Schema para resposta com regra
export const RegraNegocioResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: RegraNegocioWithRelationsSchema
})

// Schema para lista de regras
export const RegrasNegocioListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(RegraNegocioWithRelationsSchema).describe('Lista de regras de negócio')
})

// Schema para parâmetros de rota
export const RegraNegocioParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da regra de negócio')
})

// Tipos derivados
export type RegraNegocio = z.infer<typeof RegraNegocioSchema>
export type CreateRegraNegocio = z.infer<typeof CreateRegraNegocioSchema>
export type UpdateRegraNegocio = z.infer<typeof UpdateRegraNegocioSchema>
export type RegraNegocioWithRelations = z.infer<typeof RegraNegocioWithRelationsSchema>
export type RegraNegocioParams = z.infer<typeof RegraNegocioParamsSchema>