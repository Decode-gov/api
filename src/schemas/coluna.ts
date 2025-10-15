import { z } from 'zod'

// Schema base da coluna alinhado com Prisma
export const ColunaSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da coluna'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da coluna'),
  descricao: z.string().nullable().optional().describe('Descrição da coluna'),
  obrigatorio: z.boolean().default(false).describe('Define se a coluna é obrigatória'),
  unicidade: z.boolean().default(false).describe('Define se a coluna tem restrição de unicidade'),
  ativo: z.boolean().default(true).describe('Status de ativação da coluna'),
  tabelaId: z.uuid({ message: 'ID da tabela deve ser um UUID válido' }).describe('ID da tabela pai'),
  tipoDadosId: z.uuid({ message: 'ID do tipo de dados deve ser um UUID válido' }).nullable().optional().describe('ID do tipo de dados'),
  politicaInternaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).nullable().optional().describe('ID da política interna'),
  necessidadeInfoId: z.uuid({ message: 'ID da necessidade de informação deve ser um UUID válido' }).nullable().optional().describe('ID da necessidade de informação'),
  questaoGerencialId: z.uuid({ message: 'ID da questão gerencial deve ser um UUID válido' }).describe('ID da questão gerencial (necessidade de informação)'),
  createdAt: z.string().datetime().nullable().optional().describe('Data de criação'),
  updatedAt: z.string().datetime().nullable().optional().describe('Data de última atualização')
})

// Schema para criação de coluna
export const CreateColunaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da coluna'),
  descricao: z.string().optional().describe('Descrição opcional da coluna'),
  obrigatorio: z.boolean().default(false).describe('Coluna obrigatória'),
  unicidade: z.boolean().default(false).describe('Restrição de unicidade'),
  ativo: z.boolean().default(true).describe('Status de ativação'),
  tabelaId: z.uuid({ message: 'ID da tabela deve ser um UUID válido' }).describe('ID da tabela pai'),
  tipoDadosId: z.uuid({ message: 'ID do tipo de dados deve ser um UUID válido' }).optional().describe('ID do tipo de dados'),
  politicaInternaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).optional().describe('ID da política interna'),
  necessidadeInfoId: z.uuid({ message: 'ID da necessidade de informação deve ser um UUID válido' }).optional().describe('ID da necessidade de informação'),
  questaoGerencialId: z.uuid({ message: 'ID da questão gerencial deve ser um UUID válido' }).describe('ID da questão gerencial')
})

// Schema para atualização de coluna
export const UpdateColunaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da coluna'),
  descricao: z.string().optional().describe('Descrição da coluna'),
  obrigatorio: z.boolean().optional().describe('Coluna obrigatória'),
  unicidade: z.boolean().optional().describe('Restrição de unicidade'),
  ativo: z.boolean().optional().describe('Status de ativação'),
  tabelaId: z.uuid({ message: 'ID da tabela deve ser um UUID válido' }).optional().describe('ID da tabela pai'),
  tipoDadosId: z.uuid({ message: 'ID do tipo de dados deve ser um UUID válido' }).optional().describe('ID do tipo de dados'),
  politicaInternaId: z.uuid({ message: 'ID da política deve ser um UUID válido' }).optional().describe('ID da política interna'),
  necessidadeInfoId: z.uuid({ message: 'ID da necessidade de informação deve ser um UUID válido' }).optional().describe('ID da necessidade de informação'),
  questaoGerencialId: z.uuid({ message: 'ID da questão gerencial deve ser um UUID válido' }).optional().describe('ID da questão gerencial')
})

// Schema para coluna com relacionamentos
export const ColunaWithRelationsSchema = ColunaSchema.extend({
  tabela: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da tabela'),
    nome: z.string().describe('Nome da tabela')
  }).describe('Dados da tabela pai'),
  tipoDados: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID do tipo de dados'),
    nome: z.string().describe('Nome do tipo de dados')
  }).nullable().describe('Tipo de dados da coluna'),
  politicaInterna: z.object({
    id: z.uuid({ message: 'ID inválido' }).describe('ID da política'),
    nome: z.string().describe('Nome da política')
  }).nullable().describe('Política interna aplicada')
})

// Schema para resposta com coluna
export const ColunaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ColunaSchema
})

// Schema para lista de colunas
export const ColunasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ColunaWithRelationsSchema).describe('Lista de colunas com relacionamentos')
})

// Schema para resposta de coluna com relacionamentos
export const ColunaWithRelationsResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ColunaWithRelationsSchema
})

// Schema para parâmetros de rota da coluna
export const ColunaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da coluna')
})
