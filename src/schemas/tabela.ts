import { z } from 'zod'

// Schema base da tabela alinhado com Prisma
export const TabelaSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da tabela'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da tabela'),
  bancoId: z.uuid({ message: 'ID do banco deve ser um UUID válido' }).nullable().optional().describe('ID do banco de dados'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).nullable().optional().describe('ID do sistema'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).nullable().optional().describe('ID do termo de negócio'),
  necessidadeInfoId: z.uuid({ message: 'ID da necessidade deve ser um UUID válido' }).nullable().optional().describe('ID da necessidade de informação'),
  questaoGerencialId: z.uuid({ message: 'ID da questão gerencial deve ser um UUID válido' }).describe('ID da questão gerencial (necessidade de informação)'),
  createdAt: z.iso.datetime().nullable().optional().describe('Data de criação'),
  updatedAt: z.iso.datetime().nullable().optional().describe('Data de última atualização')
})

// Schema para criação de tabela
export const CreateTabelaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da tabela'),
  bancoId: z.uuid({ message: 'ID do banco deve ser um UUID válido' }).nullable().optional().describe('ID do banco de dados'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).nullable().optional().describe('ID do sistema'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).nullable().optional().describe('ID do termo'),
  necessidadeInfoId: z.uuid({ message: 'ID da necessidade deve ser um UUID válido' }).nullable().optional().describe('ID da necessidade'),
  questaoGerencialId: z.uuid({ message: 'ID da questão gerencial deve ser um UUID válido' }).describe('ID da questão gerencial')
})

// Schema para atualização de tabela
export const UpdateTabelaSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da tabela'),
  bancoId: z.uuid({ message: 'ID do banco deve ser um UUID válido' }).nullable().optional().describe('ID do banco'),
  sistemaId: z.uuid({ message: 'ID do sistema deve ser um UUID válido' }).nullable().optional().describe('ID do sistema'),
  termoId: z.uuid({ message: 'ID do termo deve ser um UUID válido' }).nullable().optional().describe('ID do termo'),
  necessidadeInfoId: z.uuid({ message: 'ID da necessidade deve ser um UUID válido' }).nullable().optional().describe('ID da necessidade'),
  questaoGerencialId: z.uuid({ message: 'ID da questão gerencial deve ser um UUID válido' }).optional().describe('ID da questão gerencial')
})

// Schema para resposta com tabela
export const TabelaResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: TabelaSchema
})

// Schema para lista de tabelas
export const TabelasListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(TabelaSchema).describe('Lista de tabelas')
})

// Schema para parâmetros de rota
export const TabelaParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da tabela')
})
