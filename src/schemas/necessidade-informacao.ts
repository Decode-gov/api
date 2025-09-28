import { z } from 'zod'

// Schema base da necessidade de informação usando Zod v4
export const NecessidadeInformacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da necessidade de informação'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da necessidade de informação'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da necessidade'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).describe('ID do processo relacionado'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).describe('ID do sistema relacionado'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA'], { message: 'Prioridade deve ser BAIXA, MEDIA ou ALTA' }).describe('Prioridade da necessidade'),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'ATENDIDA', 'CANCELADA'], {
    message: 'Status deve ser PENDENTE, EM_ANDAMENTO, ATENDIDA ou CANCELADA'
  }).default('PENDENTE').describe('Status da necessidade'),
  periodicidade: z.enum(['DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL'], {
    message: 'Periodicidade deve ser DIARIA, SEMANAL, MENSAL, TRIMESTRAL ou ANUAL'
  }).describe('Periodicidade da necessidade'),
  prazoAtendimento: z.iso.datetime({ message: 'Prazo de atendimento deve ser uma data válida' }).optional().describe('Prazo para atendimento'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de necessidade de informação
export const CreateNecessidadeInformacaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da necessidade de informação'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da necessidade'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).describe('ID do processo'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).describe('ID do sistema'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA'], { message: 'Prioridade deve ser BAIXA, MEDIA ou ALTA' }).describe('Prioridade da necessidade'),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'ATENDIDA', 'CANCELADA']).default('PENDENTE').optional().describe('Status da necessidade'),
  periodicidade: z.enum(['DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL']).describe('Periodicidade da necessidade'),
  prazoAtendimento: z.iso.datetime({ message: 'Prazo de atendimento deve ser uma data válida' }).optional().describe('Prazo para atendimento'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de necessidade de informação
export const UpdateNecessidadeInformacaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da necessidade de informação'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição da necessidade'),
  processoId: z.uuid({ message: 'ID do processo deve ser um UUID válido' }).optional().describe('ID do processo'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional().describe('Prioridade da necessidade'),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'ATENDIDA', 'CANCELADA']).optional().describe('Status da necessidade'),
  periodicidade: z.enum(['DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL']).optional().describe('Periodicidade da necessidade'),
  prazoAtendimento: z.iso.datetime({ message: 'Prazo de atendimento deve ser uma data válida' }).optional().describe('Prazo para atendimento'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para necessidade com relacionamentos
export const NecessidadeInformacaoWithRelationsSchema = NecessidadeInformacaoSchema.extend({
  processo: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do processo'),
    nome: z.string().describe('Nome do processo'),
    codigo: z.string().optional().describe('Código do processo')
  }).describe('Processo relacionado'),
  sistema: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do sistema'),
    nome: z.string().describe('Nome do sistema'),
    versao: z.string().optional().describe('Versão do sistema')
  }).describe('Sistema relacionado'),
  produtosDados: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do produto de dados'),
    nome: z.string().describe('Nome do produto de dados'),
    descricao: z.string().optional().describe('Descrição do produto')
  })).optional().describe('Produtos de dados relacionados')
})

// Schema para resposta com necessidade
export const NecessidadeInformacaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: NecessidadeInformacaoWithRelationsSchema
})

// Schema para lista de necessidades
export const NecessidadesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(NecessidadeInformacaoWithRelationsSchema).describe('Lista de necessidades de informação')
})

// Schema para parâmetros de rota
export const NecessidadeInformacaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da necessidade de informação')
})

// Tipos derivados
export type NecessidadeInformacao = z.infer<typeof NecessidadeInformacaoSchema>
export type CreateNecessidadeInformacao = z.infer<typeof CreateNecessidadeInformacaoSchema>
export type UpdateNecessidadeInformacao = z.infer<typeof UpdateNecessidadeInformacaoSchema>
export type NecessidadeInformacaoWithRelations = z.infer<typeof NecessidadeInformacaoWithRelationsSchema>
export type NecessidadeInformacaoParams = z.infer<typeof NecessidadeInformacaoParamsSchema>