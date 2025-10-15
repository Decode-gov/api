import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NecessidadeInformacaoController } from '../../controllers/necessidade-informacao.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('NecessidadeInformacaoController', () => {
  let controller: NecessidadeInformacaoController
  let mockReply: any

  beforeEach(() => {
    controller = new NecessidadeInformacaoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de necessidades de informação', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockNecessidades = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Necessidade 1',
          descricao: 'Descrição 1'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Necessidade 2',
          descricao: 'Descrição 2'
        }
      ]

      mockPrisma.necessidadeInformacao.findMany.mockResolvedValue(mockNecessidades)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.necessidadeInformacao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true,
          tabelasQuestaoGerencial: true,
          colunasQuestaoGerencial: true
        }
      })
      expect(result).toEqual({ data: mockNecessidades })
    })
  })

  describe('findById', () => {
    it('deve retornar necessidade de informação por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockNecessidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Necessidade Test',
        descricao: 'Descrição da necessidade'
      }

      mockPrisma.necessidadeInformacao.findUnique.mockResolvedValue(mockNecessidade)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.necessidadeInformacao.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true,
          tabelasQuestaoGerencial: true,
          colunasQuestaoGerencial: true
        }
      })
      expect(result).toEqual({ data: mockNecessidade })
    })

    it('deve retornar erro se necessidade não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.necessidadeInformacao.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Necessidade de Informação não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova necessidade de informação', async () => {
      const mockRequest = createMockRequest({
        nome: 'Nova Necessidade',
        descricao: 'Descrição da nova necessidade'
      })

      const mockNecessidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Nova Necessidade',
        descricao: 'Descrição da nova necessidade',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.necessidadeInformacao.create.mockResolvedValue(mockNecessidade)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.necessidadeInformacao.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Necessidade',
          descricao: 'Descrição da nova necessidade'
        },
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true
        }
      })
      expect(result).toEqual({ data: mockNecessidade })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.necessidadeInformacao.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar necessidade existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Necessidade Atualizada',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockNecessidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Necessidade Atualizada',
        descricao: 'Descrição atualizada',
        updatedAt: new Date()
      }

      mockPrisma.necessidadeInformacao.update.mockResolvedValue(mockNecessidade)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.necessidadeInformacao.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Necessidade Atualizada',
          descricao: 'Descrição atualizada'
        },
        include: {
          comunidade: true,
          tabelas: true,
          colunas: true
        }
      })
      expect(result).toEqual({ data: mockNecessidade })
    })

    it('deve retornar erro se necessidade não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Necessidade Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.necessidadeInformacao.update.mockRejectedValue(new Error('Information need not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar necessidade existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockNecessidade = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Necessidade Deletada'
      }

      mockPrisma.necessidadeInformacao.delete.mockResolvedValue(mockNecessidade)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.necessidadeInformacao.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockNecessidade })
    })

    it('deve retornar erro se necessidade não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.necessidadeInformacao.delete.mockRejectedValue(new Error('Information need not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
