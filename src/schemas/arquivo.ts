import { z } from 'zod'

export const ArquivoSchema = z.object({
  id: z.uuid().describe('Identificador único do arquivo'),
  nomeOriginal: z.string().describe('Nome original do arquivo enviado'),
  nomeArquivo: z.string().describe('Nome gerado em disco'),
  diretorioArquivo: z.string().describe('Caminho completo do arquivo em disco'),
  tipoMime: z.string().describe('MIME type do arquivo'),
  tamanhoBytes: z.number().describe('Tamanho do arquivo em bytes'),
  ativo: z.boolean().describe('Status de ativação'),
  usuarioId: z.uuid().describe('ID do usuário que fez o upload'),
  empresaId: z.uuid().describe('ID da empresa'),
  createdAt: z.iso.datetime().nullable().describe('Data de criação'),
  updatedAt: z.iso.datetime().nullable().describe('Data de atualização'),
})

export const ArquivoResponseSchema = z.object({
  data: ArquivoSchema,
})

export const ArquivosListResponseSchema = z.object({
  data: z.array(ArquivoSchema),
})

export const ArquivoParamsSchema = z.object({
  id: z.uuid({ message: 'ID deve ser um UUID válido' }).describe('ID do arquivo'),
})

export const UploadQuerySchema = z.object({
  empresaId: z.uuid().optional().describe('ID da empresa (obrigatório para ADMIN)'),
})

export type Arquivo = z.infer<typeof ArquivoSchema>
export type ArquivoParams = z.infer<typeof ArquivoParamsSchema>
export type UploadQuery = z.infer<typeof UploadQuerySchema>
