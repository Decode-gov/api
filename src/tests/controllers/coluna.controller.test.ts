import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ColunaController } from '../../controllers/coluna.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ColunaController', () => {
  let controller: ColunaController
  let mockReply: any

  beforeEach(() => {
    controller = new ColunaController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de colunas', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockColunas = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'id',
          tipo: 'INTEGER',
          descricao: 'Chave primária',
          tabela: { nome: 'usuarios' },
          codificacoes: []
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'nome',
          tipo: 'VARCHAR',
          descricao: 'Nome do usuário',
          tabela: { nome: 'usuarios' },
          codificacoes: []
        }
      ]

      mockPrisma.coluna.findMany.mockResolvedValue(mockColunas)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.coluna.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          tabela: true,
          codificacoes: true
        }
      })
      expect(result).toEqual({ data: mockColunas })
    })
  })

  describe('findById', () => {
    it('deve retornar coluna por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockColuna = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'nome',
        tipo: 'VARCHAR',
        descricao: 'Nome do usuário',
        tabela: { nome: 'usuarios' },
        codificacoes: [
          { codigo: 'ATIVO', descricao: 'Usuário ativo' }
        ]
      }

      mockPrisma.coluna.findUnique.mockResolvedValue(mockColuna)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.coluna.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          tabela: true,
          codificacoes: true
        }
      })
      expect(result).toEqual({ data: mockColuna })
    })

    it('deve retornar erro se coluna não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.coluna.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Coluna não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova coluna', async () => {
      const mockRequest = createMockRequest({
        nome: 'status',
        tipo: 'VARCHAR',
        descricao: 'Status do registro',
        tabelaId: '550e8400-e29b-41d4-a716-446655440000'
      })

      const mockColuna = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'status',
        tipo: 'VARCHAR',
        descricao: 'Status do registro',
        tabelaId: '550e8400-e29b-41d4-a716-446655440000',
        tabela: { nome: 'usuarios' },
        codificacoes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.coluna.create.mockResolvedValue(mockColuna)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.coluna.create).toHaveBeenCalledWith({
        data: {
          nome: 'status',
          tipo: 'VARCHAR',
          descricao: 'Status do registro',
          tabelaId: '550e8400-e29b-41d4-a716-446655440000'
        },
        include: {
          tabela: true,
          codificacoes: true
        }
      })
      expect(result).toEqual({ data: mockColuna })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        tipo: 'VARCHAR'
      })

      mockPrisma.coluna.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar coluna existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'status_atualizado',
          tipo: 'ENUM',
          descricao: 'Status atualizado do registro'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockColuna = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'status_atualizado',
        tipo: 'ENUM',
        descricao: 'Status atualizado do registro',
        tabela: { nome: 'usuarios' },
        codificacoes: [],
        updatedAt: new Date()
      }

      mockPrisma.coluna.update.mockResolvedValue(mockColuna)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.coluna.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'status_atualizado',
          tipo: 'ENUM',
          descricao: 'Status atualizado do registro'
        },
        include: {
          tabela: true,
          codificacoes: true
        }
      })
      expect(result).toEqual({ data: mockColuna })
    })

    it('deve retornar erro se coluna não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'coluna_atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.coluna.update.mockRejectedValue(new Error('Column not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar coluna existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockColuna = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'coluna_deletada'
      }

      mockPrisma.coluna.delete.mockResolvedValue(mockColuna)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.coluna.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockColuna })
    })

    it('deve retornar erro se coluna não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.coluna.delete.mockRejectedValue(new Error('Column not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })

    it('deve retornar erro se coluna tem dependências', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const constraintError = new Error('Foreign key constraint') as any
      constraintError.code = 'P2003'

      mockPrisma.coluna.delete.mockRejectedValue(constraintError)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
