import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListaDimensaoController } from '../../controllers/lista-dimensao.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ListaDimensaoController', () => {
  let controller: ListaDimensaoController
  let mockReply: any

  beforeEach(() => {
    controller = new ListaDimensaoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de dimensões', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockDimensoes = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Dimensão 1',
          descricao: 'Descrição 1'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Dimensão 2',
          descricao: 'Descrição 2'
        }
      ]

      mockPrisma.listaDimensao.findMany.mockResolvedValue(mockDimensoes)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.listaDimensao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockDimensoes })
    })
  })

  describe('findById', () => {
    it('deve retornar dimensão por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockDimensao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Dimensão Test',
        descricao: 'Descrição da dimensão'
      }

      mockPrisma.listaDimensao.findUnique.mockResolvedValue(mockDimensao)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.listaDimensao.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockDimensao })
    })

    it('deve retornar erro se dimensão não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.listaDimensao.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Lista de Dimensão não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova dimensão', async () => {
      const mockRequest = createMockRequest({
        nome: 'Nova Dimensão',
        descricao: 'Descrição da nova dimensão'
      })

      const mockDimensao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Nova Dimensão',
        descricao: 'Descrição da nova dimensão',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.listaDimensao.create.mockResolvedValue(mockDimensao)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.listaDimensao.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Dimensão',
          descricao: 'Descrição da nova dimensão'
        },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockDimensao })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.listaDimensao.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar dimensão existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Dimensão Atualizada',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockDimensao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Dimensão Atualizada',
        descricao: 'Descrição atualizada',
        updatedAt: new Date()
      }

      mockPrisma.listaDimensao.update.mockResolvedValue(mockDimensao)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.listaDimensao.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Dimensão Atualizada',
          descricao: 'Descrição atualizada'
        },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockDimensao })
    })

    it('deve retornar erro se dimensão não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Dimensão Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.listaDimensao.update.mockRejectedValue(new Error('Dimension not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar dimensão existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockDimensao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Dimensão Deletada'
      }

      mockPrisma.listaDimensao.delete.mockResolvedValue(mockDimensao)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.listaDimensao.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockDimensao })
    })

    it('deve retornar erro se dimensão não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.listaDimensao.delete.mockRejectedValue(new Error('Dimension not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
