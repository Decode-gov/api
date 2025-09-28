import { z } from 'zod'

// Schema base da lista de referência
export const ListaReferenciaSchema = z.object({
  id: z.string(),
  nome: z.string().min(1),
  descricao: z.string().nullable(),
  valores: z.string(), // JSON string com valores únicos da lista
  tabelaId: z.string().nullable(),
  colunaId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para criação de lista de referência
export const CreateListaReferenciaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().nullable().optional(),
  valores: z.string().min(1, 'Valores são obrigatórios'),
  tabelaId: z.string().nullable().optional(),
  colunaId: z.string().nullable().optional()
})

// Schema para atualização de lista de referência
export const UpdateListaReferenciaSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().nullable().optional(),
  valores: z.string().min(1).optional(),
  tabelaId: z.string().nullable().optional(),
  colunaId: z.string().nullable().optional()
})

// Schema com relacionamentos
export const ListaReferenciaComRelacionamentosSchema = ListaReferenciaSchema.extend({
  tabela: z.object({
    id: z.string(),
    nome: z.string()
  }).nullable(),
  coluna: z.object({
    id: z.string(),
    nome: z.string()
  }).nullable()
})

// Schema para resposta com lista de referência
export const ListaReferenciaResponseSchema = z.object({
  message: z.string(),
  data: ListaReferenciaComRelacionamentosSchema
})

// Schema para lista de listas de referência
export const ListasReferenciaListResponseSchema = z.object({
  message: z.string(),
  data: z.array(ListaReferenciaComRelacionamentosSchema)
})

// Schema para parâmetros de rota
export const ListaReferenciaParamsSchema = z.object({
  id: z.string()
})
