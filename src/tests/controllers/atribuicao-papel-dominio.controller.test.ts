import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AtribuicaoPapelDominioController } from '../../controllers/atribuicao-papel-dominio.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

const TipoEntidadeDocumento = {
  Politica: 'Politica',
  Papel: 'Papel',
  Atribuicao: 'Atribuicao',
  Processo: 'Processo',
  Termo: 'Termo',
  KPI: 'KPI',
  RegraNegocio: 'RegraNegocio',
  RegraQualidade: 'RegraQualidade',
  Dominio: 'Dominio',
  Sistema: 'Sistema',
  Tabela: 'Tabela',
  Coluna: 'Coluna'
} as const

describe('AtribuicaoPapelDominioController', () => {
  let controller: AtribuicaoPapelDominioController
  let mockReply: any

  beforeEach(() => {
    controller = new AtribuicaoPapelDominioController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar atribuições com paginação', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockAtribuicoes = [
        {
          id: '1',
          papelId: '2',
          dominioId: '3',
          tipoEntidade: TipoEntidadeDocumento.Dominio,
          documentoAtribuicao: 'DOC-001',
          onboarding: true,
          dataInicioVigencia: new Date(),
          papel: { id: '2', nome: 'Administrador', descricao: 'Admin role' },
          dominio: { id: '3', nome: 'Financeiro' },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      mockPrisma.atribuicaoPapelDominio.findMany.mockResolvedValue(mockAtribuicoes)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        orderBy: { id: 'asc' },
        include: {
          papel: true,
          dominio: true
        }
      })
      expect(result).toEqual({ data: mockAtribuicoes })
    })

    it('deve aplicar filtros quando fornecidos', async () => {
      const mockRequest = createMockRequest({}, {}, {
        papelId: '2',
        dominioId: '3',
        tipoEntidade: 'Dominio'
      })

      const mockAtribuicoes = [
        {
          id: '1',
          papelId: '2',
          dominioId: '3',
          tipoEntidade: TipoEntidadeDocumento.Dominio,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      mockPrisma.atribuicaoPapelDominio.findMany.mockResolvedValue(mockAtribuicoes)

      await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {
          papelId: '2',
          dominioId: '3',
          tipoEntidade: 'Dominio'
        },
        orderBy: { id: 'asc' },
        include: {
          papel: true,
          dominio: true
        }
      })
    })
  })

  describe('findById', () => {
    it('deve retornar atribuição quando encontrada', async () => {
      const mockRequest = createMockRequest({}, { id: '1' })

      const mockAtribuicao = {
        id: '1',
        papelId: '2',
        dominioId: '3',
        tipoEntidade: TipoEntidadeDocumento.Sistema,
        documentoAtribuicao: 'DOC-002',
        onboarding: false,
        papel: { id: '2', nome: 'Analista', descricao: null },
        dominio: { id: '3', nome: 'TI' },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.atribuicaoPapelDominio.findUnique.mockResolvedValue(mockAtribuicao)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          papel: true,
          dominio: true
        }
      })
      expect(result).toEqual({ data: mockAtribuicao })
    })

    it('deve retornar erro quando atribuição não encontrada', async () => {
      const mockRequest = createMockRequest({}, { id: '1' })

      mockPrisma.atribuicaoPapelDominio.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          papel: true,
          dominio: true
        }
      })
      expect(mockReply.notFound).toHaveBeenCalledWith('Atribuição de papel-domínio não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova atribuição', async () => {
      const createData = {
        papelId: '2',
        dominioId: '3',
        tipoEntidade: TipoEntidadeDocumento.Processo,
        documentoAtribuicao: 'DOC-003',
        onboarding: true
      }

      const mockRequest = createMockRequest(createData)

      const mockCreatedAtribuicao = {
        id: '1',
        ...createData,
        dataInicioVigencia: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.atribuicaoPapelDominio.create.mockResolvedValue(mockCreatedAtribuicao)
      mockReply.code.mockReturnValue(mockReply)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(result).toEqual({ data: mockCreatedAtribuicao })
      expect(mockReply.code).toHaveBeenCalledWith(201)
      expect(mockPrisma.atribuicaoPapelDominio.create).toHaveBeenCalledWith({
        data: createData,
        include: {
          papel: true,
          dominio: true
        }
      })
    })

    it('deve retornar erro quando dados inválidos', async () => {
      const mockRequest = createMockRequest({ papelId: 'invalid' })

      mockPrisma.atribuicaoPapelDominio.create.mockRejectedValue(new Error('Validation error'))
      mockReply.internalServerError.mockReturnValue(mockReply)

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar atribuição existente', async () => {
      const updateData = {
        documentoAtribuicao: 'DOC-004-UPDATED',
        onboarding: false
      }

      const mockRequest = createMockRequest(updateData, { id: '1' })

      const mockUpdatedAtribuicao = {
        id: '1',
        papelId: '2',
        dominioId: '3',
        tipoEntidade: TipoEntidadeDocumento.KPI,
        dataInicioVigencia: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...updateData
      }

      mockPrisma.atribuicaoPapelDominio.update.mockResolvedValue(mockUpdatedAtribuicao)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        include: {
          papel: true,
          dominio: true
        }
      })
      expect(result).toEqual({ data: mockUpdatedAtribuicao })
    })

    it('deve retornar erro quando atribuição não encontrada para atualização', async () => {
      const mockRequest = createMockRequest(
        { documentoAtribuicao: 'DOC-NEW' },
        { id: '1' }
      )

      mockPrisma.atribuicaoPapelDominio.update.mockRejectedValue({ code: 'P2025' })

      await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { documentoAtribuicao: 'DOC-NEW' },
        include: {
          papel: true,
          dominio: true
        }
      })
      expect(mockReply.notFound).toHaveBeenCalledWith('Registro não encontrado')
    })
  })

  describe('delete', () => {
    it('deve deletar atribuição existente', async () => {
      const mockRequest = createMockRequest({}, { id: '1' })

      const mockDeletedAtribuicao = {
        id: '1',
        papelId: '2',
        dominioId: '3',
        tipoEntidade: TipoEntidadeDocumento.Tabela,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.atribuicaoPapelDominio.delete.mockResolvedValue(mockDeletedAtribuicao)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
      expect(result).toEqual({ data: mockDeletedAtribuicao })
    })

    it('deve retornar erro quando atribuição não encontrada para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '1' })

      mockPrisma.atribuicaoPapelDominio.delete.mockRejectedValue({ code: 'P2025' })

      await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.atribuicaoPapelDominio.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
      expect(mockReply.notFound).toHaveBeenCalledWith('Registro não encontrado')
    })
  })
})