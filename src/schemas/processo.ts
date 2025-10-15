import { z } from 'zod'

// Schema base do processo - conforme especificação do prompt
export const ProcessoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do processo'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição do processo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de processo - conforme especificação do prompt
export const CreateProcessoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição opcional do processo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).describe('ID da comunidade')
})

// Schema para atualização de processo - conforme especificação do prompt
export const UpdateProcessoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do processo'),
  descricao: z.string().optional().describe('Descrição do processo'),
  comunidadeId: z.uuid({ message: 'ID da comunidade deve ser um UUID válido' }).optional().describe('ID da comunidade')
})

// Schema para processo com relacionamentos
export const ProcessoWithRelationsSchema = ProcessoSchema.extend({
  sistema: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do sistema'),
    nome: z.string().describe('Nome do sistema')
  }).describe('Sistema relacionado'),
  usuario: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do usuário'),
    nome: z.string().describe('Nome do usuário')
  }).describe('Usuário responsável'),
  atividades: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da atividade'),
    nome: z.string().describe('Nome da atividade')
  })).optional().describe('Atividades do processo'),
  kpis: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do KPI'),
    nome: z.string().describe('Nome do KPI')
  })).optional().describe('KPIs do processo')
})

// Schema para resposta com processo
export const ProcessoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ProcessoSchema
})

// Schema para lista de processos
export const ProcessosListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ProcessoWithRelationsSchema).describe('Lista de processos')
})

// Schema para resposta de processo com relacionamentos
export const ProcessoWithRelationsResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ProcessoWithRelationsSchema
})

// Schema para parâmetros de rota do processo
export const ProcessoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do processo')
})
