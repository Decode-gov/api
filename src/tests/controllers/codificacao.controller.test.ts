import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CodificacaoController } from '../../controllers/codificacao.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('CodificacaoController', () => {
  let controller: CodificacaoController
  let mockReply: any

  beforeEach(() => {
    controller = new CodificacaoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de codificações', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockCodificacoes = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          codigo: 'COD001',
          descricao: 'Codificação 1',
          tabela: { nome: 'usuarios' },
          coluna: { nome: 'status' }
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          codigo: 'COD002',
          descricao: 'Codificação 2',
          tabela: { nome: 'processos' },
          coluna: { nome: 'tipo' }
        }
      ]

      mockPrisma.codificacao.findMany.mockResolvedValue(mockCodificacoes)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.codificacao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          tabela: true,
          coluna: true
        }
      })
      expect(result).toEqual({ data: mockCodificacoes })
    })
  })

  describe('findById', () => {
    it('deve retornar codificação por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockCodificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        codigo: 'COD001',
        descricao: 'Codificação Test',
        tabela: { nome: 'usuarios' },
        coluna: { nome: 'status' }
      }

      mockPrisma.codificacao.findUnique.mockResolvedValue(mockCodificacao)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.codificacao.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          tabela: true,
          coluna: true
        }
      })
      expect(result).toEqual({ data: mockCodificacao })
    })

    it('deve retornar erro se codificação não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.codificacao.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Codificação não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova codificação', async () => {
      const mockRequest = createMockRequest({
        codigo: 'COD003',
        descricao: 'Nova Codificação',
        tabelaId: '550e8400-e29b-41d4-a716-446655440000',
        colunaId: '550e8400-e29b-41d4-a716-446655440001'
      })

      const mockCodificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        codigo: 'COD003',
        descricao: 'Nova Codificação',
        tabelaId: '550e8400-e29b-41d4-a716-446655440000',
        colunaId: '550e8400-e29b-41d4-a716-446655440001',
        tabela: { nome: 'usuarios' },
        coluna: { nome: 'status' },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.codificacao.create.mockResolvedValue(mockCodificacao)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.codificacao.create).toHaveBeenCalledWith({
        data: {
          codigo: 'COD003',
          descricao: 'Nova Codificação',
          tabelaId: '550e8400-e29b-41d4-a716-446655440000',
          colunaId: '550e8400-e29b-41d4-a716-446655440001'
        },
        include: {
          tabela: true,
          coluna: true
        }
      })
      expect(result).toEqual({ data: mockCodificacao })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        codigo: '', // código vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.codificacao.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar codificação existente', async () => {
      const mockRequest = createMockRequest(
        {
          codigo: 'COD003_UPD',
          descricao: 'Codificação Atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockCodificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        codigo: 'COD003_UPD',
        descricao: 'Codificação Atualizada',
        tabela: { nome: 'usuarios' },
        coluna: { nome: 'status' },
        updatedAt: new Date()
      }

      mockPrisma.codificacao.update.mockResolvedValue(mockCodificacao)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.codificacao.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          codigo: 'COD003_UPD',
          descricao: 'Codificação Atualizada'
        },
        include: {
          tabela: true,
          coluna: true
        }
      })
      expect(result).toEqual({ data: mockCodificacao })
    })

    it('deve retornar erro se codificação não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { codigo: 'COD_UPD' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.codificacao.update.mockRejectedValue(new Error('Codification not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar codificação existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockCodificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        codigo: 'COD_DEL'
      }

      mockPrisma.codificacao.delete.mockResolvedValue(mockCodificacao)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.codificacao.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockCodificacao })
    })

    it('deve retornar erro se codificação não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.codificacao.delete.mockRejectedValue(new Error('Codification not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
