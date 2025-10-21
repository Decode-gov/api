import { z } from 'zod'

// Schema base da operação usando Zod v4
export const OperacaoSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da operação'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da operação'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da operação'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  atividadeId: z.uuid({ message: 'ID da atividade deve ser um UUID válido' }).describe('ID da atividade relacionada'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema relacionado'),
  tipo: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'PROCESS', 'VALIDATE', 'TRANSFORM'], {
    message: 'Tipo deve ser CREATE, READ, UPDATE, DELETE, PROCESS, VALIDATE ou TRANSFORM'
  }).describe('Tipo da operação'),
  frequencia: z.enum(['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL', 'EVENTUAL'], {
    message: 'Frequência deve ser UNICA, DIARIA, SEMANAL, MENSAL, TRIMESTRAL, ANUAL ou EVENTUAL'
  }).describe('Frequência de execução'),
  duracao: z.number().min(0, { message: 'Duração deve ser >= 0' }).optional().describe('Duração estimada em minutos'),
  complexidade: z.enum(['BAIXA', 'MEDIA', 'ALTA'], {
    message: 'Complexidade deve ser BAIXA, MEDIA ou ALTA'
  }).default('MEDIA').describe('Complexidade da operação'),
  automatizada: z.boolean().default(false).describe('Indica se a operação é automatizada'),
  critica: z.boolean().default(false).describe('Indica se a operação é crítica'),
  documentada: z.boolean().default(false).describe('Indica se a operação está documentada'),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }).describe('Responsável pela operação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de operação
export const CreateOperacaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da operação'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da operação'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  atividadeId: z.uuid({ message: 'ID da atividade deve ser um UUID válido' }).describe('ID da atividade'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  tipo: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'PROCESS', 'VALIDATE', 'TRANSFORM']).describe('Tipo da operação'),
  frequencia: z.enum(['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL', 'EVENTUAL']).describe('Frequência de execução'),
  duracao: z.number().min(0).optional().describe('Duração estimada em minutos'),
  complexidade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).default('MEDIA').describe('Complexidade da operação'),
  automatizada: z.boolean().default(false).describe('Operação automatizada'),
  critica: z.boolean().default(false).describe('Operação crítica'),
  documentada: z.boolean().default(false).describe('Operação documentada'),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }).describe('Responsável pela operação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de operação
export const UpdateOperacaoSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da operação'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição da operação'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).optional().describe('Código identificador'),
  atividadeId: z.uuid({ message: 'ID da atividade deve ser um UUID válido' }).optional().describe('ID da atividade'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).optional().describe('ID do sistema'),
  tipo: z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'PROCESS', 'VALIDATE', 'TRANSFORM']).optional().describe('Tipo da operação'),
  frequencia: z.enum(['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'TRIMESTRAL', 'ANUAL', 'EVENTUAL']).optional().describe('Frequência de execução'),
  duracao: z.number().min(0).optional().describe('Duração estimada em minutos'),
  complexidade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional().describe('Complexidade da operação'),
  automatizada: z.boolean().optional().describe('Operação automatizada'),
  critica: z.boolean().optional().describe('Operação crítica'),
  documentada: z.boolean().optional().describe('Operação documentada'),
  responsavel: z.string().min(1, { message: 'Responsável é obrigatório' }).optional().describe('Responsável pela operação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para operação com relacionamentos
export const OperacaoWithRelationsSchema = OperacaoSchema.extend({
  atividade: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da atividade'),
    nome: z.string().describe('Nome da atividade'),
    processoId: z.uuid({ message: 'ID inválido' }).describe('ID do processo')
  }).describe('Atividade relacionada'),
  sistema: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do sistema'),
    nome: z.string().describe('Nome do sistema'),
    versao: z.string().optional().describe('Versão do sistema')
  }).optional().describe('Sistema relacionado'),
  transacoes: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da transação'),
    nome: z.string().describe('Nome da transação'),
    tipo: z.string().optional().describe('Tipo da transação')
  })).optional().describe('Transações relacionadas')
})

// Schema para resposta com operação
export const OperacaoResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: OperacaoWithRelationsSchema
})

// Schema para lista de operações
export const OperacoesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(OperacaoWithRelationsSchema).describe('Lista de operações')
})

// Schema para parâmetros de rota
export const OperacaoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da operação')
})

// Tipos derivados
export type Operacao = z.infer<typeof OperacaoSchema>
export type CreateOperacao = z.infer<typeof CreateOperacaoSchema>
export type UpdateOperacao = z.infer<typeof UpdateOperacaoSchema>
export type OperacaoWithRelations = z.infer<typeof OperacaoWithRelationsSchema>
export type OperacaoParams = z.infer<typeof OperacaoParamsSchema>