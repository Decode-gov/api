import { z } from 'zod'

// Enum para tipos de MFA
export const TipoMfaEnum = z.enum(['SMS', 'EMAIL', 'TOTP'])

// Schema base do MFA
export const MfaConfigSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  tipo: TipoMfaEnum,
  ativo: z.boolean(),
  telefone: z.string().nullable(),
  email: z.string().nullable(),
  secretKey: z.string().nullable(),
  ativadoEm: z.string().nullable(),
  ultimaVerificacao: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Schema para configurar MFA
export const SetupMfaSchema = z.object({
  usuarioId: z.string(),
  tipo: TipoMfaEnum,
  telefone: z.string().optional(),
  email: z.string().optional(),
  secretKey: z.string().optional()
})

// Schema para ativar MFA
export const EnableMfaSchema = z.object({
  usuarioId: z.string(),
  codigo: z.string().min(1, 'Código é obrigatório')
})

// Schema para verificar MFA
export const VerifyMfaSchema = z.object({
  usuarioId: z.string(),
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: TipoMfaEnum
})

// Schema para desativar MFA
export const DisableMfaSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório')
})

// Schema de query para listagem
export const MfaQuerySchema = z.object({
  skip: z.number().int().min(0).optional(),
  take: z.number().int().min(1).max(100).optional(),
  usuarioId: z.string().optional(),
  tipo: TipoMfaEnum.optional(),
  ativo: z.boolean().optional()
})

// Schemas de resposta
export const SetupMfaResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    configuracaoId: z.string(),
    tipo: z.string(),
    codigo: z.string().optional(),
    qrCodeData: z.string().optional(),
    secretKey: z.string().optional(),
    mensagem: z.string()
  })
})

export const EnableMfaResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    configuracao: z.object({
      id: z.string(),
      tipo: z.string(),
      ativo: z.boolean(),
      ativadoEm: z.string()
    }),
    codigosBackup: z.array(z.string())
  })
})

export const VerifyMfaResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    verificado: z.boolean(),
    tipo: z.string(),
    timestamp: z.string()
  })
})

export const DisableMfaResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    ativo: z.boolean(),
    desativadoEm: z.string()
  })
})

export const MfaListResponseSchema = z.object({
  message: z.string(),
  data: z.array(MfaConfigSchema)
})

export const MfaResponseSchema = z.object({
  message: z.string(),
  data: MfaConfigSchema
})

// Schema para parâmetros de rota
export const MfaParamsSchema = z.object({
  id: z.string()
})
