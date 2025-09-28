import { z } from 'zod'

// Schema base da criticidade regulatória usando Zod v4
export const CriticidadeRegulatoriaSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da criticidade regulatória'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da criticidade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição detalhada da criticidade'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  nivel: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA', 'CRITICA'], {
    message: 'Nível deve ser MUITO_BAIXA, BAIXA, MEDIA, ALTA, MUITO_ALTA ou CRITICA'
  }).describe('Nível da criticidade regulatória'),
  peso: z.number().min(0, { message: 'Peso deve ser >= 0' }).max(10, { message: 'Peso deve ser <= 10' }).describe('Peso numérico da criticidade'),
  orgaoRegulador: z.string().min(1, { message: 'Órgão regulador é obrigatório' }).describe('Órgão regulador responsável'),
  normativo: z.string().min(1, { message: 'Normativo é obrigatório' }).describe('Normativo ou lei aplicável'),
  artigo: z.string().optional().describe('Artigo específico do normativo'),
  inciso: z.string().optional().describe('Inciso específico do normativo'),
  paragrafo: z.string().optional().describe('Parágrafo específico do normativo'),
  multa: z.number().min(0, { message: 'Multa deve ser >= 0' }).optional().describe('Valor da multa em caso de descumprimento'),
  sancao: z.string().optional().describe('Descrição da sanção aplicável'),
  prazoCorrecao: z.number().min(0, { message: 'Prazo deve ser >= 0' }).optional().describe('Prazo para correção em dias'),
  impacto: z.enum(['BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO'], {
    message: 'Impacto deve ser BAIXO, MEDIO, ALTO ou MUITO_ALTO'
  }).describe('Impacto do descumprimento'),
  probabilidade: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA'], {
    message: 'Probabilidade deve ser MUITO_BAIXA, BAIXA, MEDIA, ALTA ou MUITO_ALTA'
  }).describe('Probabilidade de ocorrência'),
  dataVigencia: z.iso.datetime({ message: 'Data de vigência deve ser uma data válida' }).optional().describe('Data de vigência do normativo'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de criticidade regulatória
export const CreateCriticidadeRegulatoriaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da criticidade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).describe('Descrição da criticidade'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).describe('Código identificador'),
  nivel: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA', 'CRITICA']).describe('Nível da criticidade'),
  peso: z.number().min(0).max(10).describe('Peso numérico da criticidade'),
  orgaoRegulador: z.string().min(1, { message: 'Órgão regulador é obrigatório' }).describe('Órgão regulador responsável'),
  normativo: z.string().min(1, { message: 'Normativo é obrigatório' }).describe('Normativo ou lei aplicável'),
  artigo: z.string().optional().describe('Artigo específico do normativo'),
  inciso: z.string().optional().describe('Inciso específico do normativo'),
  paragrafo: z.string().optional().describe('Parágrafo específico do normativo'),
  multa: z.number().min(0).optional().describe('Valor da multa em caso de descumprimento'),
  sancao: z.string().optional().describe('Descrição da sanção aplicável'),
  prazoCorrecao: z.number().min(0).optional().describe('Prazo para correção em dias'),
  impacto: z.enum(['BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO']).describe('Impacto do descumprimento'),
  probabilidade: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA']).describe('Probabilidade de ocorrência'),
  dataVigencia: z.iso.datetime({ message: 'Data de vigência deve ser uma data válida' }).optional().describe('Data de vigência'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de criticidade regulatória
export const UpdateCriticidadeRegulatoriaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da criticidade'),
  descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).optional().describe('Descrição da criticidade'),
  codigo: z.string().min(1, { message: 'Código é obrigatório' }).max(50, { message: 'Código muito longo' }).optional().describe('Código identificador'),
  nivel: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA', 'CRITICA']).optional().describe('Nível da criticidade'),
  peso: z.number().min(0).max(10).optional().describe('Peso numérico da criticidade'),
  orgaoRegulador: z.string().min(1, { message: 'Órgão regulador é obrigatório' }).optional().describe('Órgão regulador responsável'),
  normativo: z.string().min(1, { message: 'Normativo é obrigatório' }).optional().describe('Normativo ou lei aplicável'),
  artigo: z.string().optional().describe('Artigo específico do normativo'),
  inciso: z.string().optional().describe('Inciso específico do normativo'),
  paragrafo: z.string().optional().describe('Parágrafo específico do normativo'),
  multa: z.number().min(0).optional().describe('Valor da multa em caso de descumprimento'),
  sancao: z.string().optional().describe('Descrição da sanção aplicável'),
  prazoCorrecao: z.number().min(0).optional().describe('Prazo para correção em dias'),
  impacto: z.enum(['BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO']).optional().describe('Impacto do descumprimento'),
  probabilidade: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA']).optional().describe('Probabilidade de ocorrência'),
  dataVigencia: z.iso.datetime({ message: 'Data de vigência deve ser uma data válida' }).optional().describe('Data de vigência'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para criticidade com relacionamentos
export const CriticidadeRegulatoriaWithRelationsSchema = CriticidadeRegulatoriaSchema.extend({
  processos: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do processo'),
    nome: z.string().describe('Nome do processo'),
    codigo: z.string().optional().describe('Código do processo')
  })).optional().describe('Processos relacionados'),
  sistemas: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do sistema'),
    nome: z.string().describe('Nome do sistema'),
    versao: z.string().optional().describe('Versão do sistema')
  })).optional().describe('Sistemas relacionados'),
  avaliacoes: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da avaliação'),
    resultado: z.string().describe('Resultado da avaliação'),
    data: z.iso.datetime().describe('Data da avaliação')
  })).optional().describe('Avaliações de conformidade')
})

// Schema para resposta com criticidade
export const CriticidadeRegulatoriaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: CriticidadeRegulatoriaWithRelationsSchema
})

// Schema para lista de criticidades
export const CriticidadesRegulatoriaListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(CriticidadeRegulatoriaWithRelationsSchema).describe('Lista de criticidades regulatórias')
})

// Schema para parâmetros de rota
export const CriticidadeRegulatoriaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da criticidade regulatória')
})

// Tipos derivados
export type CriticidadeRegulatoria = z.infer<typeof CriticidadeRegulatoriaSchema>
export type CreateCriticidadeRegulatoria = z.infer<typeof CreateCriticidadeRegulatoriaSchema>
export type UpdateCriticidadeRegulatoria = z.infer<typeof UpdateCriticidadeRegulatoriaSchema>
export type CriticidadeRegulatoriaWithRelations = z.infer<typeof CriticidadeRegulatoriaWithRelationsSchema>
export type CriticidadeRegulatoriaParams = z.infer<typeof CriticidadeRegulatoriaParamsSchema>