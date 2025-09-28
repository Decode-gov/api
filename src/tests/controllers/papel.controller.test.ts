import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PapelController } from '../../controllers/papel.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('PapelController', () => {
  let controller: PapelController
  let mockReply: any

  beforeEach(() => {
    controller = new PapelController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de papéis', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockPapeis = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Papel 1',
          descricao: 'Descrição 1',
          usuarios: []
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Papel 2',
          descricao: 'Descrição 2',
          usuarios: []
        }
      ]

      mockPrisma.papel.findMany.mockResolvedValue(mockPapeis)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.papel.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockPapeis })
    })
  })

  describe('findById', () => {
    it('deve retornar papel por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockPapel = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Papel Test',
        descricao: 'Descrição do papel',
        usuarios: []
      }

      mockPrisma.papel.findUnique.mockResolvedValue(mockPapel)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.papel.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockPapel })
    })

    it('deve retornar erro se papel não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.papel.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Papel não encontrado')
    })
  })

  describe('create', () => {
    it('deve criar novo papel', async () => {
      const mockRequest = createMockRequest({
        nome: 'Novo Papel',
        descricao: 'Descrição do novo papel'
      })

      const mockPapel = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Novo Papel',
        descricao: 'Descrição do novo papel',
        usuarios: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.papel.create.mockResolvedValue(mockPapel)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.papel.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo Papel',
          descricao: 'Descrição do novo papel'
        },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockPapel })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.papel.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar papel existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Papel Atualizado',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockPapel = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Papel Atualizado',
        descricao: 'Descrição atualizada',
        usuarios: [],
        updatedAt: new Date()
      }

      mockPrisma.papel.update.mockResolvedValue(mockPapel)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.papel.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Papel Atualizado',
          descricao: 'Descrição atualizada'
        },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockPapel })
    })

    it('deve retornar erro se papel não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Papel Atualizado' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.papel.update.mockRejectedValue(new Error('Role not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar papel existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockPapel = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Papel Deletado'
      }

      mockPrisma.papel.delete.mockResolvedValue(mockPapel)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.papel.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockPapel })
    })

    it('deve retornar erro se papel não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.papel.delete.mockRejectedValue(new Error('Role not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })

    it('deve retornar erro se papel tem dependências', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const constraintError = new Error('Foreign key constraint') as any
      constraintError.code = 'P2003'

      mockPrisma.papel.delete.mockRejectedValue(constraintError)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
