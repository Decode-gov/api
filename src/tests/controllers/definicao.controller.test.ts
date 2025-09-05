import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DefinicaoController } from '../../controllers/definicao.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('DefinicaoController', () => {
  let controller: DefinicaoController
  let mockReply: any

  beforeEach(() => {
    controller = new DefinicaoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de definições', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockDefinicoes = [
        {
          id: '1',
          termo: 'API',
          definicao: 'Application Programming Interface',
          tabelas: []
        },
        {
          id: '2',
          termo: 'Database',
          definicao: 'Sistema de gerenciamento de dados',
          tabelas: []
        }
      ]

      mockPrisma.definicao.findMany.mockResolvedValue(mockDefinicoes)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          tabelas: true
        }
      })
      expect(result).toEqual({ data: mockDefinicoes })
    })

    it('deve aplicar paginação corretamente', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 20, take: 5 })

      mockPrisma.definicao.findMany.mockResolvedValue([])

      await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.findMany).toHaveBeenCalledWith({
        skip: 20,
        take: 5,
        orderBy: { id: 'asc' },
        include: {
          tabelas: true
        }
      })
    })
  })

  describe('findById', () => {
    it('deve retornar definição por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockDefinicao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        termo: 'REST',
        definicao: 'Representational State Transfer',
        tabelas: [
          { id: '1', nome: 'usuarios' },
          { id: '2', nome: 'processos' }
        ]
      }

      mockPrisma.definicao.findUniqueOrThrow.mockResolvedValue(mockDefinicao)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          tabelas: true
        }
      })
      expect(result).toEqual({ data: mockDefinicao })
    })

    it('deve retornar erro se definição não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.definicao.findUniqueOrThrow.mockRejectedValue(new Error('Definition not found'))

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('create', () => {
    it('deve criar nova definição', async () => {
      const mockRequest = createMockRequest({
        termo: 'GraphQL',
        definicao: 'A query language for APIs'
      })

      const mockDefinicao = {
        id: '123',
        termo: 'GraphQL',
        definicao: 'A query language for APIs',
        tabelas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.definicao.create.mockResolvedValue(mockDefinicao)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.create).toHaveBeenCalledWith({
        data: {
          termo: 'GraphQL',
          definicao: 'A query language for APIs'
        },
        include: {
          tabelas: true
        }
      })
      expect(result).toEqual({ data: mockDefinicao })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        termo: '', // termo vazio deve falhar
        definicao: 'Definição'
      })

      mockPrisma.definicao.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })

    it('deve lidar com erro de constraint única', async () => {
      const mockRequest = createMockRequest({
        termo: 'API',
        definicao: 'Definição duplicada'
      })

      const constraintError = new Error('Unique constraint') as any
      constraintError.code = 'P2002'

      mockPrisma.definicao.create.mockRejectedValue(constraintError)

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.conflict).toHaveBeenCalledWith('Violação de constraint única')
    })
  })

  describe('update', () => {
    it('deve atualizar definição existente', async () => {
      const mockRequest = createMockRequest(
        {
          termo: 'API Atualizada',
          definicao: 'Application Programming Interface - versão atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockDefinicao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        termo: 'API Atualizada',
        definicao: 'Application Programming Interface - versão atualizada',
        tabelas: [],
        updatedAt: new Date()
      }

      mockPrisma.definicao.update.mockResolvedValue(mockDefinicao)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          termo: 'API Atualizada',
          definicao: 'Application Programming Interface - versão atualizada'
        },
        include: {
          tabelas: true
        }
      })
      expect(result).toEqual({ data: mockDefinicao })
    })

    it('deve retornar erro se definição não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { termo: 'Termo Atualizado' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.definicao.update.mockRejectedValue(new Error('Definition not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar definição existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockDefinicao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        termo: 'Termo Deletado'
      }

      mockPrisma.definicao.delete.mockResolvedValue(mockDefinicao)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockDefinicao })
    })

    it('deve retornar erro se definição não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.definicao.delete.mockRejectedValue(new Error('Definition not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })

    it('deve retornar erro se definição tem dependências', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const constraintError = new Error('Foreign key constraint') as any
      constraintError.code = 'P2003'

      mockPrisma.definicao.delete.mockRejectedValue(constraintError)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
