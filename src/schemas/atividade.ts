import { z } from 'zod'

// Schema base da atividade usando Zod v4
export const AtividadeSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da atividade'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da atividade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da atividade'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).describe('ID do processo relacionado'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema relacionado'),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }).describe('Responsável pela atividade'),
  status: z.enum(['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA'], {
    message: 'Status deve ser PLANEJADA, EM_ANDAMENTO, CONCLUIDA, CANCELADA ou PAUSADA'
  }).default('PLANEJADA').describe('Status atual da atividade'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], {
    message: 'Prioridade deve ser BAIXA, MEDIA, ALTA ou CRITICA'
  }).default('MEDIA').describe('Prioridade da atividade'),
  dataInicioEsperada: z.iso.datetime({ message: 'Data de início esperada deve ser uma data válida' }).optional().describe('Data prevista para início'),
  dataFimEsperada: z.iso.datetime({ message: 'Data de fim esperada deve ser uma data válida' }).optional().describe('Data prevista para conclusão'),
  dataInicioReal: z.iso.datetime({ message: 'Data de início real deve ser uma data válida' }).optional().describe('Data real de início'),
  dataFimReal: z.iso.datetime({ message: 'Data de fim real deve ser uma data válida' }).optional().describe('Data real de conclusão'),
  percentualConclusao: z.number().min(0, { message: 'Percentual deve ser >= 0' }).max(100, { message: 'Percentual deve ser <= 100' }).default(0).describe('Percentual de conclusão'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de atividade
export const CreateAtividadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da atividade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da atividade'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).describe('ID do processo'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }).describe('Responsável pela atividade'),
  status: z.enum(['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA']).default('PLANEJADA').describe('Status da atividade'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA').describe('Prioridade da atividade'),
  dataInicioEsperada: z.iso.datetime({ message: 'Data de início esperada deve ser uma data válida' }).optional().describe('Data prevista para início'),
  dataFimEsperada: z.iso.datetime({ message: 'Data de fim esperada deve ser uma data válida' }).optional().describe('Data prevista para conclusão'),
  percentualConclusao: z.number().min(0).max(100).default(0).describe('Percentual de conclusão'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de atividade
export const UpdateAtividadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da atividade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição da atividade'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).optional().describe('ID do processo'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }).optional().describe('Responsável pela atividade'),
  status: z.enum(['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'PAUSADA']).optional().describe('Status da atividade'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).optional().describe('Prioridade da atividade'),
  dataInicioEsperada: z.iso.datetime({ message: 'Data de início esperada deve ser uma data válida' }).optional().describe('Data prevista para início'),
  dataFimEsperada: z.iso.datetime({ message: 'Data de fim esperada deve ser uma data válida' }).optional().describe('Data prevista para conclusão'),
  dataInicioReal: z.iso.datetime({ message: 'Data de início real deve ser uma data válida' }).optional().describe('Data real de início'),
  dataFimReal: z.iso.datetime({ message: 'Data de fim real deve ser uma data válida' }).optional().describe('Data real de conclusão'),
  percentualConclusao: z.number().min(0).max(100).optional().describe('Percentual de conclusão'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para atividade com relacionamentos
export const AtividadeWithRelationsSchema = AtividadeSchema.extend({
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
  operacoes: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da operação'),
    nome: z.string().describe('Nome da operação'),
    descricao: z.string().optional().describe('Descrição da operação')
  })).optional().describe('Operações relacionadas')
})

// Schema para resposta com atividade
export const AtividadeResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: AtividadeWithRelationsSchema
})

// Schema para lista de atividades
export const AtividadesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(AtividadeWithRelationsSchema).describe('Lista de atividades')
})

// Schema para parâmetros de rota
export const AtividadeParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da atividade')
})

// Tipos derivados
export type Atividade = z.infer<typeof AtividadeSchema>
export type CreateAtividade = z.infer<typeof CreateAtividadeSchema>
export type UpdateAtividade = z.infer<typeof UpdateAtividadeSchema>
export type AtividadeWithRelations = z.infer<typeof AtividadeWithRelationsSchema>
export type AtividadeParams = z.infer<typeof AtividadeParamsSchema>