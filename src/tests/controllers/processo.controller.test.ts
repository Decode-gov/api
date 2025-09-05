import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProcessoController } from '../../controllers/processo.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ProcessoController', () => {
  let controller: ProcessoController
  let mockReply: any

  beforeEach(() => {
    controller = new ProcessoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de processos', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockProcessos = [
        {
          id: '1',
          nome: 'Processo 1',
          descricao: 'Descrição 1',
          regrasNegocio: [],
          kpis: []
        },
        {
          id: '2',
          nome: 'Processo 2',
          descricao: 'Descrição 2',
          regrasNegocio: [],
          kpis: []
        }
      ]

      mockPrisma.processo.findMany.mockResolvedValue(mockProcessos)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.processo.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          regrasNegocio: true,
          kpis: true
        }
      })
      expect(result).toEqual({ data: mockProcessos })
    })
  })

  describe('findById', () => {
    it('deve retornar processo por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockProcesso = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Processo Test',
        descricao: 'Descrição do processo',
        regrasNegocio: [
          { id: '1', descricao: 'Regra 1' }
        ],
        kpis: [
          { id: '1', nome: 'KPI 1' }
        ]
      }

      mockPrisma.processo.findUniqueOrThrow.mockResolvedValue(mockProcesso)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.processo.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          regrasNegocio: true,
          kpis: true
        }
      })
      expect(result).toEqual({ data: mockProcesso })
    })

    it('deve retornar erro se processo não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.processo.findUniqueOrThrow.mockRejectedValue(new Error('Process not found'))

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('deve criar novo processo', async () => {
      const mockRequest = createMockRequest({
        nome: 'Novo Processo',
        descricao: 'Descrição do novo processo'
      })

      const mockProcesso = {
        id: '123',
        nome: 'Novo Processo',
        descricao: 'Descrição do novo processo',
        regrasNegocio: [],
        kpis: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.processo.create.mockResolvedValue(mockProcesso)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.processo.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo Processo',
          descricao: 'Descrição do novo processo'
        },
        include: {
          regrasNegocio: true,
          kpis: true
        }
      })
      expect(result).toEqual({ data: mockProcesso })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.processo.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar processo existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Processo Atualizado',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockProcesso = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Processo Atualizado',
        descricao: 'Descrição atualizada',
        regrasNegocio: [],
        kpis: [],
        updatedAt: new Date()
      }

      mockPrisma.processo.update.mockResolvedValue(mockProcesso)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.processo.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Processo Atualizado',
          descricao: 'Descrição atualizada'
        },
        include: {
          regrasNegocio: true,
          kpis: true
        }
      })
      expect(result).toEqual({ data: mockProcesso })
    })

    it('deve retornar erro se processo não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Processo Atualizado' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.processo.update.mockRejectedValue(new Error('Process not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar processo existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockProcesso = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Processo Deletado'
      }

      mockPrisma.processo.delete.mockResolvedValue(mockProcesso)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.processo.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockProcesso })
    })

    it('deve retornar erro se processo não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.processo.delete.mockRejectedValue(new Error('Process not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })

    it('deve retornar erro se processo tem dependências', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const constraintError = new Error('Foreign key constraint') as any
      constraintError.code = 'P2003'

      mockPrisma.processo.delete.mockRejectedValue(constraintError)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
