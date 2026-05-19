import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DocumentoPolimorficoController } from '../controllers/documento-polimorfico.controller.js'
import { EmpresaFilterSchema, ErrorSchema, SuccessMessageSchema } from '../schemas/common.js'
import { authMiddleware } from '../middleware/auth.js'

const TipoEntidadeDocumentoEnum = z.enum([
  'Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI',
  'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'
])

const DocumentoSchema = z.object({
  id: z.uuid(),
  entidadeId: z.uuid(),
  tipoEntidade: z.string(),
  nomeArquivo: z.string(),
  tamanhoBytes: z.string(),
  tipoArquivo: z.string(),
  caminhoArquivo: z.string(),
  descricao: z.string().nullable().optional(),
  metadados: z.string().nullable().optional(),
  checksum: z.string().nullable().optional(),
  versao: z.number().int(),
  ativo: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

const DocumentoListResponseSchema = z.object({
  data: z.array(DocumentoSchema)
})

const DocumentoResponseSchema = z.object({
  data: DocumentoSchema
})

const EntidadeParamsSchema = z.object({
  tipoEntidade: TipoEntidadeDocumentoEnum,
  entidadeId: z.uuid({ message: 'entidadeId deve ser um UUID válido' })
})

const IdParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' })
})

const CreateDocumentoBodySchema = z.object({
  entidadeId: z.uuid({ message: 'ID da entidade deve ser um UUID válido' }),
  tipoEntidade: TipoEntidadeDocumentoEnum,
  nomeArquivo: z.string().min(1, 'Nome do arquivo é obrigatório'),
  tamanhoBytes: z.string(),
  tipoArquivo: z.string().min(1, 'Tipo do arquivo é obrigatório'),
  caminhoArquivo: z.string().min(1, 'Caminho do arquivo é obrigatório'),
  descricao: z.string().optional(),
  metadados: z.string().optional(),
  checksum: z.string().optional(),
  versao: z.number().int().min(1).default(1)
})

const UpdateDocumentoBodySchema = z.object({
  nomeArquivo: z.string().min(1).optional(),
  tamanhoBytes: z.string().optional(),
  tipoArquivo: z.string().min(1).optional(),
  caminhoArquivo: z.string().min(1).optional(),
  descricao: z.string().optional(),
  metadados: z.string().optional(),
  checksum: z.string().optional(),
  versao: z.number().int().min(1).optional(),
  ativo: z.boolean().optional()
})

const DeleteResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.uuid(),
    ativo: z.boolean()
  })
})

export async function documentoPolimorficoRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()
  const controller = new DocumentoPolimorficoController(app.prisma)

  // GET /documentos - Listar documentos
  app.get('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar todos os documentos polimórficos',
      tags: ['Documentos Polimórficos'],
      summary: 'Listar documentos',
      querystring: EmpresaFilterSchema,
      response: {
        200: DocumentoListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.findMany(request as any, reply)
  })

  // GET /documentos/entidade/:tipoEntidade/:entidadeId
  app.get('/entidade/:tipoEntidade/:entidadeId', {
    preHandler: authMiddleware,
    schema: {
      description: 'Listar documentos de uma entidade específica',
      tags: ['Documentos Polimórficos'],
      summary: 'Listar documentos por entidade',
      params: EntidadeParamsSchema,
      response: {
        200: DocumentoListResponseSchema
      }
    }
  }, async (request, reply) => {
    return controller.listarDocumentosPorEntidade(request as any, reply)
  })

  // GET /documentos/:id
  app.get('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Buscar documento por ID',
      tags: ['Documentos Polimórficos'],
      summary: 'Buscar documento por ID',
      params: IdParamsSchema,
      response: {
        200: DocumentoResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    return controller.findById(request as any, reply)
  })

  // POST /documentos
  app.post('/', {
    preHandler: authMiddleware,
    schema: {
      description: 'Anexar um novo documento a uma entidade',
      tags: ['Documentos Polimórficos'],
      summary: 'Anexar documento',
      body: CreateDocumentoBodySchema,
      response: {
        201: DocumentoResponseSchema,
        400: ErrorSchema
      }
    }
  }, async (request, reply) => {
    return controller.anexarDocumento(request as any, reply)
  })

  // PUT /documentos/:id
  app.put('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Atualizar metadados de um documento',
      tags: ['Documentos Polimórficos'],
      summary: 'Atualizar documento',
      params: IdParamsSchema,
      body: UpdateDocumentoBodySchema,
      response: {
        200: DocumentoResponseSchema,
        404: ErrorSchema
      }
    }
  }, async (request, reply) => {
    return controller.update(request as any, reply)
  })

  // DELETE /documentos/:id
  app.delete('/:id', {
    preHandler: authMiddleware,
    schema: {
      description: 'Remover um documento (marca como inativo)',
      tags: ['Documentos Polimórficos'],
      summary: 'Remover documento',
      params: IdParamsSchema,
      response: {
        200: DeleteResponseSchema,
        404: ErrorSchema
      }
    }
  }, controller.deletarDocumento.bind(controller))
}
