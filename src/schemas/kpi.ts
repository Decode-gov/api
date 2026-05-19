import { z } from 'zod';

// Schema base do KPI usando Zod v4 - conforme especificação do prompt
export const KpiSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do KPI'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do KPI'),
  descricao: z.string().optional().describe('Descrição do KPI'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de KPI - conforme especificação do prompt
export const CreateKpiSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do KPI'),
  descricao: z.string().optional().describe('Descrição do KPI'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade'),
  empresaId: z.uuid({ message: 'empresaId deve ser um UUID válido' }).optional().describe('ID da empresa (obrigatório para ADMIN)')
})

// Schema para atualização de KPI - conforme especificação do prompt
export const UpdateKpiSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do KPI'),
  descricao: z.string().optional().describe('Descrição do KPI'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade')
})

// Schema para KPI com relacionamentos
export const KpiWithRelationsSchema = KpiSchema.extend({
  comunidade: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da comunidade'),
    nome: z.string().describe('Nome da comunidade')
  }).nullable().describe('Comunidade relacionada')
})

// Schema para resposta com KPI
export const KpiResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: KpiSchema
})

// Schema para lista de KPIs
export const KpisListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(KpiWithRelationsSchema).describe('Lista de KPIs')
})

// Schema para resposta de KPI com relacionamentos
export const KpiWithRelationsResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: KpiWithRelationsSchema
})

// Schema para parâmetros de rota do KPI
export const KpiParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do KPI')
})
