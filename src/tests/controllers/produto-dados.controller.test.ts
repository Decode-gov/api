import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProdutoDadosController } from '../../controllers/produto-dados.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ProdutoDadosController', () => {
  let controller: ProdutoDadosController
  let mockReply: any

  beforeEach(() => {
    controller = new ProdutoDadosController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de produtos de dados', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockProdutos = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Produto 1',
          descricao: 'Descrição do produto 1'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Produto 2',
          descricao: 'Descrição do produto 2'
        }
      ]

      mockPrisma.produtoDados.findMany.mockResolvedValue(mockProdutos)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.produtoDados.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' }
      })
      expect(result).toEqual({ data: mockProdutos })
    })
  })

  describe('findById', () => {
    it('deve retornar produto de dados por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockProduto = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Produto Test',
        descricao: 'Descrição do produto de teste'
      }

      mockPrisma.produtoDados.findUnique.mockResolvedValue(mockProduto)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.produtoDados.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockProduto })
    })

    it('deve retornar erro se produto não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.produtoDados.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Produto de dados não encontrado')
    })
  })

  describe('create', () => {
    it('deve criar novo produto de dados', async () => {
      const mockRequest = createMockRequest({
        nome: 'Novo Produto',
        descricao: 'Descrição do novo produto'
      })

      const mockProduto = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Novo Produto',
        descricao: 'Descrição do novo produto',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.produtoDados.create.mockResolvedValue(mockProduto)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.produtoDados.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo Produto',
          descricao: 'Descrição do novo produto'
        }
      })
      expect(result).toEqual({ data: mockProduto })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.produtoDados.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar produto existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Produto Atualizado',
          descricao: 'Descrição atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockProduto = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Produto Atualizado',
        descricao: 'Descrição atualizada',
        updatedAt: new Date()
      }

      mockPrisma.produtoDados.update.mockResolvedValue(mockProduto)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.produtoDados.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Produto Atualizado',
          descricao: 'Descrição atualizada'
        }
      })
      expect(result).toEqual({ data: mockProduto })
    })

    it('deve retornar erro se produto não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Produto Atualizado' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.produtoDados.update.mockRejectedValue(new Error('Product not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar produto existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockProduto = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Produto Deletado'
      }

      mockPrisma.produtoDados.delete.mockResolvedValue(mockProduto)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.produtoDados.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockProduto })
    })

    it('deve retornar erro se produto não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.produtoDados.delete.mockRejectedValue(new Error('Product not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})