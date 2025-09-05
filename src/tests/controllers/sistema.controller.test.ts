import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SistemaController } from '../../controllers/sistema.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('SistemaController', () => {
  let controller: SistemaController
  let mockReply: any

  beforeEach(() => {
    controller = new SistemaController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de sistemas', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockSistemas = [
        {
          id: '1',
          nome: 'Sistema ERP',
          descricao: 'Sistema de gestão empresarial',
          tabelas: []
        },
        {
          id: '2',
          nome: 'Sistema CRM',
          descricao: 'Sistema de relacionamento com cliente',
          tabelas: []
        }
      ]

      mockPrisma.sistema.findMany.mockResolvedValue(mockSistemas)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.sistema.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          tabelas: true,
          _count: {
            select: {
              tabelas: true
            }
          }
        }
      })
      expect(result).toEqual({ data: mockSistemas })
    })
  })

  describe('findById', () => {
    it('deve retornar sistema por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '123e4567-e89b-12d3-a456-426614174000' })

      const mockSistema = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Sistema Test',
        descricao: 'Sistema de teste',
        tabelas: [
          { id: '1', nome: 'usuarios' },
          { id: '2', nome: 'pedidos' }
        ]
      }

      mockPrisma.sistema.findUnique.mockResolvedValue(mockSistema)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.sistema.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        include: {
          tabelas: {
            include: {
              banco: true,
              colunas: true
            }
          }
        }
      })
      expect(result).toEqual({ data: mockSistema })
    })
  })

  describe('create', () => {
    it('deve criar novo sistema', async () => {
      const mockRequest = createMockRequest({
        nome: 'Novo Sistema',
        descricao: 'Descrição do novo sistema'
      })

      const mockSistema = {
        id: '123',
        nome: 'Novo Sistema',
        descricao: 'Descrição do novo sistema',
        tabelas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.sistema.create.mockResolvedValue(mockSistema)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.sistema.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo Sistema',
          descricao: 'Descrição do novo sistema'
        }
      })
      expect(result).toEqual({ data: mockSistema })
    })
  })

  describe('update', () => {
    it('deve atualizar sistema existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Sistema Atualizado',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockSistema = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Sistema Atualizado',
        descricao: 'Descrição atualizada',
        tabelas: []
      }

      mockPrisma.sistema.update.mockResolvedValue(mockSistema)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.sistema.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Sistema Atualizado',
          descricao: 'Descrição atualizada'
        }
      })
      expect(result).toEqual({ data: mockSistema })
    })
  })

  describe('delete', () => {
    it('deve deletar sistema existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockSistema = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Sistema Deletado'
      }

      mockPrisma.sistema.delete.mockResolvedValue(mockSistema)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.sistema.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockSistema })
    })
  })
})
