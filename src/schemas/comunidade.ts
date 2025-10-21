import { z } from 'zod'

// Schema base da comunidade usando Zod v4 (refletindo o modelo Prisma)
export const ComunidadeSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('Identificador único da comunidade'),
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da comunidade'),
  parentId: z.uuid({ message: 'Parent ID deve ser um UUID válido' }).nullable().describe('ID da comunidade pai'),
  createdAt: z.coerce.date().nullable().describe('Data de criação'),
  updatedAt: z.coerce.date().nullable().describe('Data de última atualização')
})

// Schema para criação de comunidade
export const CreateComunidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).describe('Nome da comunidade'),
  parentId: z.uuid({ message: 'Parent ID deve ser um UUID válido' }).optional().describe('ID da comunidade pai (opcional)')
})

// Schema para atualização de comunidade
export const UpdateComunidadeSchema = z.object({
  nome: z.string().min(1, { message: 'Nome é obrigatório' }).max(255, { message: 'Nome muito longo' }).optional().describe('Nome da comunidade'),
  parentId: z.uuid({ message: 'Parent ID deve ser um UUID válido' }).nullable().optional().describe('ID da comunidade pai')
})

// Schema com relacionamentos para listagem (parent, children, _count)
export const ComunidadeWithRelationsSchema = ComunidadeSchema.extend({
  parent: ComunidadeSchema.nullable().optional(),
  children: z.array(ComunidadeSchema).optional(),
  _count: z.object({
    papeis: z.number(),
    kpis: z.number()
  }).optional()
})

// Schema detalhado para findById (inclui papeis e kpis completos)
export const ComunidadeDetailSchema = ComunidadeSchema.extend({
  parent: ComunidadeSchema.nullable().optional(),
  children: z.array(ComunidadeSchema).optional(),
  papeis: z.array(z.object({
    id: z.uuid(),
    nome: z.string(),
    descricao: z.string(),
    comunidadeId: z.uuid().nullable(),
    createdAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().nullable()
  })).optional(),
  kpis: z.array(z.object({
    id: z.uuid(),
    nome: z.string(),
    comunidadeId: z.uuid().nullable(),
    processoId: z.uuid().nullable(),
    createdAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().nullable()
  })).optional()
})

// Schema para resposta com comunidade (usado em create/update)
export const ComunidadeResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ComunidadeWithRelationsSchema
})

// Schema para resposta detalhada (usado em findById)
export const ComunidadeDetailResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: ComunidadeDetailSchema
})

// Schema para lista de comunidades
export const ComunidadesListResponseSchema = z.object({
  message: z.string().describe('Mensagem de resposta'),
  data: z.array(ComunidadeWithRelationsSchema).describe('Lista de comunidades')
})

// Schema para resposta de delete
export const ComunidadeDeleteResponseSchema = z.object({
  message: z.string().describe('Mensagem de sucesso'),
  data: ComunidadeSchema
})

// Schema para parâmetros de rota
export const ComunidadeParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID da comunidade')
})
