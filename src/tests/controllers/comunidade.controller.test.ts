import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ComunidadeController } from '../../controllers/comunidade.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ComunidadeController', () => {
  let controller: ComunidadeController
  let mockReply: any

  beforeEach(() => {
    controller = new ComunidadeController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de comunidades', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockComunidades = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Comunidade 1',
          descricao: 'Descrição 1',
          membros: []
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Comunidade 2',
          descricao: 'Descrição 2',
          membros: []
        }
      ]

      mockPrisma.comunidade.findMany.mockResolvedValue(mockComunidades)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.comunidade.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          parent: true,
          children: true,
          _count: {
            select: {
              papeis: true,
              kpis: true
            }
          }
        }
      })
      expect(result).toEqual({ data: mockComunidades })
    })
  })

  describe('findById', () => {
    it('deve retornar comunidade por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockComunidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Comunidade Test',
        descricao: 'Descrição da comunidade',
        membros: []
      }

      mockPrisma.comunidade.findUnique.mockResolvedValue(mockComunidade)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.comunidade.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          parent: true,
          children: true,
          papeis: true,
          kpis: true
        }
      })
      expect(result).toEqual({ data: mockComunidade })
    })

    it('deve retornar erro se comunidade não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.comunidade.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Comunidade não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova comunidade', async () => {
      const mockRequest = createMockRequest({
        nome: 'Nova Comunidade',
        descricao: 'Descrição da nova comunidade'
      })

      const mockComunidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Nova Comunidade',
        descricao: 'Descrição da nova comunidade',
        membros: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.comunidade.create.mockResolvedValue(mockComunidade)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.comunidade.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Comunidade',
          descricao: 'Descrição da nova comunidade'
        },
        include: {
          parent: true,
          children: true
        }
      })
      expect(result).toEqual({ data: mockComunidade })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.comunidade.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar comunidade existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Comunidade Atualizada',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockComunidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Comunidade Atualizada',
        descricao: 'Descrição atualizada',
        membros: [],
        updatedAt: new Date()
      }

      mockPrisma.comunidade.update.mockResolvedValue(mockComunidade)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.comunidade.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Comunidade Atualizada',
          descricao: 'Descrição atualizada'
        },
        include: {
          parent: true,
          children: true
        }
      })
      expect(result).toEqual({ data: mockComunidade })
    })

    it('deve retornar erro se comunidade não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Comunidade Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.comunidade.update.mockRejectedValue(new Error('Community not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar comunidade existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockComunidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Comunidade Deletada'
      }

      mockPrisma.comunidade.delete.mockResolvedValue(mockComunidade)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.comunidade.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockComunidade })
    })

    it('deve retornar erro se comunidade não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.comunidade.delete.mockRejectedValue(new Error('Community not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })

    it('deve retornar erro se comunidade tem dependências', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const constraintError = new Error('Foreign key constraint') as any
      constraintError.code = 'P2003'

      mockPrisma.comunidade.delete.mockRejectedValue(constraintError)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
