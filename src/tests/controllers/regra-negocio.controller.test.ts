import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RegraNegocioController } from '../../controllers/regra-negocio.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('RegraNegocioController', () => {
  let controller: RegraNegocioController
  let mockReply: any

  beforeEach(() => {
    controller = new RegraNegocioController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de regras de negócio', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockRegras = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          descricao: 'Regra 1',
          processo: { nome: 'Processo 1' }
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          descricao: 'Regra 2',
          processo: { nome: 'Processo 2' }
        }
      ]

      mockPrisma.regraNegocio.findMany.mockResolvedValue(mockRegras)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.regraNegocio.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          processo: true
        }
      })
      expect(result).toEqual({ data: mockRegras })
    })
  })

  describe('findById', () => {
    it('deve retornar regra de negócio por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockRegra = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        descricao: 'Regra Test',
        processo: { nome: 'Processo Test' }
      }

      mockPrisma.regraNegocio.findUnique.mockResolvedValue(mockRegra)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.regraNegocio.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          processo: true
        }
      })
      expect(result).toEqual({ data: mockRegra })
    })

    it('deve retornar erro se regra não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.regraNegocio.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Regra de Negócio não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova regra de negócio', async () => {
      const mockRequest = createMockRequest({
        descricao: 'Nova Regra de Negócio',
        processoId: '550e8400-e29b-41d4-a716-446655440000'
      })

      const mockRegra = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        descricao: 'Nova Regra de Negócio',
        processoId: '550e8400-e29b-41d4-a716-446655440000',
        processo: { nome: 'Processo Test' },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.regraNegocio.create.mockResolvedValue(mockRegra)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.regraNegocio.create).toHaveBeenCalledWith({
        data: {
          descricao: 'Nova Regra de Negócio',
          processoId: '550e8400-e29b-41d4-a716-446655440000'
        },
        include: {
          processo: true
        }
      })
      expect(result).toEqual({ data: mockRegra })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        descricao: '', // descrição vazia deve falhar na validação
        processoId: '550e8400-e29b-41d4-a716-446655440000'
      })

      mockPrisma.regraNegocio.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar regra existente', async () => {
      const mockRequest = createMockRequest(
        {
          descricao: 'Regra Atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockRegra = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        descricao: 'Regra Atualizada',
        processo: { nome: 'Processo Test' },
        updatedAt: new Date()
      }

      mockPrisma.regraNegocio.update.mockResolvedValue(mockRegra)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.regraNegocio.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          descricao: 'Regra Atualizada'
        },
        include: {
          processo: true
        }
      })
      expect(result).toEqual({ data: mockRegra })
    })

    it('deve retornar erro se regra não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { descricao: 'Regra Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.regraNegocio.update.mockRejectedValue(new Error('Business rule not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar regra existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockRegra = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        descricao: 'Regra Deletada'
      }

      mockPrisma.regraNegocio.delete.mockResolvedValue(mockRegra)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.regraNegocio.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockRegra })
    })

    it('deve retornar erro se regra não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.regraNegocio.delete.mockRejectedValue(new Error('Business rule not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
