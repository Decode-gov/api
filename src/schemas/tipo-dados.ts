import { z } from 'zod'

// Schema base do tipo de dados usando Zod v4
export const TipoDadosSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único do tipo de dados'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do tipo de dados'),
  descricao: z.string().optional().describe('Descrição do tipo de dados'),
  categoria: z.enum(['PRIMITIVO', 'COMPLEXO', 'ESTRUTURADO', 'SEMI_ESTRUTURADO', 'NAO_ESTRUTURADO'], {
    message: 'Categoria deve ser PRIMITIVO, COMPLEXO, ESTRUTURADO, SEMI_ESTRUTURADO ou NAO_ESTRUTURADO'
  }).default('PRIMITIVO').describe('Categoria do tipo de dados'),
  formato: z.string().optional().describe('Formato específico do tipo (ex: JSON, XML, CSV)'),
  tamanhoMaximo: z.number().min(0, { message: 'Tamanho máximo deve ser >= 0' }).optional().describe('Tamanho máximo em bytes'),
  precisao: z.number().min(0, { message: 'Precisão deve ser >= 0' }).optional().describe('Precisão numérica'),
  escala: z.number().min(0, { message: 'Escala deve ser >= 0' }).optional().describe('Escala decimal'),
  permiteNulo: z.boolean().default(true).describe('Permite valores nulos'),
  valorPadrao: z.string().optional().describe('Valor padrão'),
  mascara: z.string().optional().describe('Máscara de formatação'),
  validacao: z.string().optional().describe('Regras de validação específicas'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.iso.datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.iso.datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de tipo de dados
export const CreateTipoDadosSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome do tipo de dados'),
  descricao: z.string().optional().describe('Descrição do tipo de dados'),
  categoria: z.enum(['PRIMITIVO', 'COMPLEXO', 'ESTRUTURADO', 'SEMI_ESTRUTURADO', 'NAO_ESTRUTURADO']).default('PRIMITIVO').describe('Categoria do tipo'),
  formato: z.string().optional().describe('Formato específico do tipo'),
  tamanhoMaximo: z.number().min(0).optional().describe('Tamanho máximo em bytes'),
  precisao: z.number().min(0).optional().describe('Precisão numérica'),
  escala: z.number().min(0).optional().describe('Escala decimal'),
  permiteNulo: z.boolean().default(true).describe('Permite valores nulos'),
  valorPadrao: z.string().optional().describe('Valor padrão'),
  mascara: z.string().optional().describe('Máscara de formatação'),
  validacao: z.string().optional().describe('Regras de validação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de tipo de dados
export const UpdateTipoDadosSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome do tipo de dados'),
  descricao: z.string().optional().describe('Descrição do tipo de dados'),
  categoria: z.enum(['PRIMITIVO', 'COMPLEXO', 'ESTRUTURADO', 'SEMI_ESTRUTURADO', 'NAO_ESTRUTURADO']).optional().describe('Categoria do tipo'),
  formato: z.string().optional().describe('Formato específico do tipo'),
  tamanhoMaximo: z.number().min(0).optional().describe('Tamanho máximo em bytes'),
  precisao: z.number().min(0).optional().describe('Precisão numérica'),
  escala: z.number().min(0).optional().describe('Escala decimal'),
  permiteNulo: z.boolean().optional().describe('Permite valores nulos'),
  valorPadrao: z.string().optional().describe('Valor padrão'),
  mascara: z.string().optional().describe('Máscara de formatação'),
  validacao: z.string().optional().describe('Regras de validação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para tipo de dados com relacionamentos
export const TipoDadosWithRelationsSchema = TipoDadosSchema.extend({
  colunas: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da coluna'),
    nome: z.string().describe('Nome da coluna'),
    tabelaId: z.uuid({ message: 'ID inválido' }).describe('ID da tabela')
  })).optional().describe('Colunas que utilizam este tipo'),
  produtos: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do produto'),
    nome: z.string().describe('Nome do produto'),
    tipo: z.string().optional().describe('Tipo do produto')
  })).optional().describe('Produtos relacionados')
})

// Schema para resposta com tipo de dados
export const TipoDadosResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: TipoDadosWithRelationsSchema
})

// Schema para lista de tipos de dados
export const TiposDadosListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(TipoDadosWithRelationsSchema).describe('Lista de tipos de dados')
})

// Schema para parâmetros de rota
export const TipoDadosParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do tipo de dados')
})

// Tipos derivados
export type TipoDados = z.infer<typeof TipoDadosSchema>
export type CreateTipoDados = z.infer<typeof CreateTipoDadosSchema>
export type UpdateTipoDados = z.infer<typeof UpdateTipoDadosSchema>
export type TipoDadosWithRelations = z.infer<typeof TipoDadosWithRelationsSchema>
export type TipoDadosParams = z.infer<typeof TipoDadosParamsSchema>