import { z } from 'zod'

// Schema base da parte envolvida usando Zod v4
export const ParteEnvolvidaSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da parte envolvida'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da parte envolvida'),
  tipo: z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'ENTIDADE', 'SISTEMA', 'DEPARTAMENTO'], {
    message: 'Tipo deve ser PESSOA_FISICA, PESSOA_JURIDICA, ORGAO_PUBLICO, ENTIDADE, SISTEMA ou DEPARTAMENTO'
  }).describe('Tipo da parte envolvida'),
  documento: z.string().min(1, { message: 'Documento é obrigatório' }).describe('Documento de identificação (CPF/CNPJ/Outro)'),
  email: z.email({ message: 'Email deve ser válido' }).optional().describe('Email de contato'),
  telefone: z.string().optional().describe('Telefone de contato'),
  endereco: z.string().optional().describe('Endereço completo'),
  descricao: z.string().optional().describe('Descrição adicional'),
  categoria: z.enum(['CLIENTE', 'FORNECEDOR', 'PARCEIRO', 'REGULADOR', 'INTERNO', 'EXTERNO'], {
    message: 'Categoria deve ser CLIENTE, FORNECEDOR, PARCEIRO, REGULADOR, INTERNO ou EXTERNO'
  }).describe('Categoria da parte envolvida'),
  criticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'], {
    message: 'Criticidade deve ser BAIXA, MEDIA, ALTA ou CRITICA'
  }).default('MEDIA').describe('Criticidade da parte envolvida'),
  dataCadastro: z.string().datetime({ message: 'Data de cadastro deve ser uma data válida' }).optional().describe('Data de cadastro'),
  dataUltimaInteracao: z.string().datetime({ message: 'Data de última interação deve ser uma data válida' }).optional().describe('Data da última interação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  createdAt: z.string().datetime({ message: 'Data de criação inválida' }).describe('Data de criação'),
  updatedAt: z.string().datetime({ message: 'Data de atualização inválida' }).describe('Data de última atualização')
})

// Schema para criação de parte envolvida
export const CreateParteEnvolvidaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da parte envolvida'),
  tipo: z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'ENTIDADE', 'SISTEMA', 'DEPARTAMENTO']).describe('Tipo da parte envolvida'),
  documento: z.string().min(1, { message: 'Documento é obrigatório' }).describe('Documento de identificação'),
  email: z.email({ message: 'Email deve ser válido' }).optional().describe('Email de contato'),
  telefone: z.string().optional().describe('Telefone de contato'),
  endereco: z.string().optional().describe('Endereço completo'),
  descricao: z.string().optional().describe('Descrição adicional'),
  categoria: z.enum(['CLIENTE', 'FORNECEDOR', 'PARCEIRO', 'REGULADOR', 'INTERNO', 'EXTERNO']).describe('Categoria da parte envolvida'),
  criticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA').describe('Criticidade da parte envolvida'),
  dataCadastro: z.string().datetime({ message: 'Data de cadastro deve ser uma data válida' }).optional().describe('Data de cadastro'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().default(true).describe('Status de ativação')
})

// Schema para atualização de parte envolvida
export const UpdateParteEnvolvidaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da parte envolvida'),
  tipo: z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA', 'ORGAO_PUBLICO', 'ENTIDADE', 'SISTEMA', 'DEPARTAMENTO']).optional().describe('Tipo da parte envolvida'),
  documento: z.string().min(1, { message: 'Documento é obrigatório' }).optional().describe('Documento de identificação'),
  email: z.email({ message: 'Email deve ser válido' }).optional().describe('Email de contato'),
  telefone: z.string().optional().describe('Telefone de contato'),
  endereco: z.string().optional().describe('Endereço completo'),
  descricao: z.string().optional().describe('Descrição adicional'),
  categoria: z.enum(['CLIENTE', 'FORNECEDOR', 'PARCEIRO', 'REGULADOR', 'INTERNO', 'EXTERNO']).optional().describe('Categoria da parte envolvida'),
  criticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).optional().describe('Criticidade da parte envolvida'),
  dataCadastro: z.string().datetime({ message: 'Data de cadastro deve ser uma data válida' }).optional().describe('Data de cadastro'),
  dataUltimaInteracao: z.string().datetime({ message: 'Data de última interação deve ser uma data válida' }).optional().describe('Data da última interação'),
  observacoes: z.string().optional().describe('Observações adicionais'),
  ativo: z.boolean().optional().describe('Status de ativação')
})

// Schema para parte envolvida com relacionamentos
export const ParteEnvolvidaWithRelationsSchema = ParteEnvolvidaSchema.extend({
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
  contratos: z.array(z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do contrato'),
    numero: z.string().describe('Número do contrato'),
    dataVigencia: z.string().datetime().optional().describe('Data de vigência')
  })).optional().describe('Contratos relacionados')
})

// Schema para resposta com parte envolvida
export const ParteEnvolvidaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ParteEnvolvidaWithRelationsSchema
})

// Schema para lista de partes envolvidas
export const PartesEnvolvidasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ParteEnvolvidaWithRelationsSchema).describe('Lista de partes envolvidas')
})

// Schema para parâmetros de rota
export const ParteEnvolvidaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da parte envolvida')
})

// Tipos derivados
export type ParteEnvolvida = z.infer<typeof ParteEnvolvidaSchema>
export type CreateParteEnvolvida = z.infer<typeof CreateParteEnvolvidaSchema>
export type UpdateParteEnvolvida = z.infer<typeof UpdateParteEnvolvidaSchema>
export type ParteEnvolvidaWithRelations = z.infer<typeof ParteEnvolvidaWithRelationsSchema>
export type ParteEnvolvidaParams = z.infer<typeof ParteEnvolvidaParamsSchema>