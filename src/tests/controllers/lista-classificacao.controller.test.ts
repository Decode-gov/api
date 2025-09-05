import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListaClassificacaoController } from '../../controllers/lista-classificacao.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ListaClassificacaoController', () => {
  let controller: ListaClassificacaoController
  let mockReply: any

  beforeEach(() => {
    controller = new ListaClassificacaoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de classificações', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockClassificacoes = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Classificação 1',
          descricao: 'Descrição 1'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Classificação 2',
          descricao: 'Descrição 2'
        }
      ]

      mockPrisma.listaClassificacao.findMany.mockResolvedValue(mockClassificacoes)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.listaClassificacao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockClassificacoes })
    })
  })

  describe('findById', () => {
    it('deve retornar classificação por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockClassificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Classificação Test',
        descricao: 'Descrição da classificação'
      }

      mockPrisma.listaClassificacao.findUnique.mockResolvedValue(mockClassificacao)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.listaClassificacao.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockClassificacao })
    })

    it('deve retornar erro se classificação não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.listaClassificacao.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Lista de Classificação não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova classificação', async () => {
      const mockRequest = createMockRequest({
        nome: 'Nova Classificação',
        descricao: 'Descrição da nova classificação'
      })

      const mockClassificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Nova Classificação',
        descricao: 'Descrição da nova classificação',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.listaClassificacao.create.mockResolvedValue(mockClassificacao)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.listaClassificacao.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Classificação',
          descricao: 'Descrição da nova classificação'
        },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockClassificacao })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.listaClassificacao.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar classificação existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Classificação Atualizada',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockClassificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Classificação Atualizada',
        descricao: 'Descrição atualizada',
        updatedAt: new Date()
      }

      mockPrisma.listaClassificacao.update.mockResolvedValue(mockClassificacao)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.listaClassificacao.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Classificação Atualizada',
          descricao: 'Descrição atualizada'
        },
        include: {
          politica: true
        }
      })
      expect(result).toEqual({ data: mockClassificacao })
    })

    it('deve retornar erro se classificação não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Classificação Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.listaClassificacao.update.mockRejectedValue(new Error('Classification not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar classificação existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockClassificacao = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Classificação Deletada'
      }

      mockPrisma.listaClassificacao.delete.mockResolvedValue(mockClassificacao)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.listaClassificacao.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockClassificacao })
    })

    it('deve retornar erro se classificação não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.listaClassificacao.delete.mockRejectedValue(new Error('Classification not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
