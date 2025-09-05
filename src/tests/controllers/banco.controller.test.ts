import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BancoController } from '../../controllers/banco.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('BancoController', () => {
  let controller: BancoController
  let mockReply: any

  beforeEach(() => {
    controller = new BancoController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de bancos', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockBancos = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Banco 1',
          descricao: 'Descrição do banco 1',
          tabelas: [{ nome: 'tabela1' }],
          _count: { tabelas: 1 }
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Banco 2',
          descricao: 'Descrição do banco 2',
          tabelas: [],
          _count: { tabelas: 0 }
        }
      ]

      mockPrisma.banco.findMany.mockResolvedValue(mockBancos)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.banco.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockReply)
    })
  })

  describe('findById', () => {
    it('deve retornar banco por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockBanco = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Banco Test',
        descricao: 'Descrição do banco',
        tabelas: []
      }

      mockPrisma.banco.findUnique.mockResolvedValue(mockBanco)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.banco.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          tabelas: true
        }
      })
      expect(result).toEqual(mockReply)
    })

    it('deve retornar erro se banco não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.banco.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(404)
    })
  })

  describe('create', () => {
    it('deve criar novo banco', async () => {
      const mockRequest = createMockRequest({
        nome: 'Novo Banco',
        descricao: 'Descrição do novo banco'
      })

      const mockBanco = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Novo Banco',
        descricao: 'Descrição do novo banco',
        tabelas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.banco.create.mockResolvedValue(mockBanco)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.banco.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo Banco',
          descricao: 'Descrição do novo banco'
        }
      })
      expect(result).toEqual(mockReply)
    })
  })

  describe('update', () => {
    it('deve atualizar banco existente', async () => {
      const mockRequest = createMockRequest({
        nome: 'Banco Atualizado',
        descricao: 'Descrição atualizada'
      }, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockBanco = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Banco Atualizado',
        descricao: 'Descrição atualizada',
        tabelas: [],
        updatedAt: new Date()
      }

      mockPrisma.banco.update.mockResolvedValue(mockBanco)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.banco.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Banco Atualizado',
          descricao: 'Descrição atualizada'
        }
      })
      expect(result).toEqual(mockReply)
    })
  })

  describe('delete', () => {
    it('deve deletar banco existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockBanco = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Banco Deletado'
      }

      // Mock da verificação de integridade
      mockPrisma.tabela.count = vi.fn().mockResolvedValue(0)
      mockPrisma.banco.delete.mockResolvedValue(mockBanco)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.count).toHaveBeenCalledWith({
        where: { bancoId: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(mockPrisma.banco.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual(mockReply)
    })

    it('deve retornar erro quando há tabelas vinculadas', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      // Mock da verificação de integridade com dependências
      mockPrisma.tabela.count = vi.fn().mockResolvedValue(2)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.count).toHaveBeenCalledWith({
        where: { bancoId: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(mockPrisma.banco.delete).not.toHaveBeenCalled()
      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'BadRequest',
        message: 'Não é possível deletar o banco de dados. Ele está sendo usado por 2 tabela(s).'
      })
    })
  })
})
