import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TabelaController } from '../../controllers/tabela.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('TabelaController', () => {
  let controller: TabelaController
  let mockReply: any

  beforeEach(() => {
    controller = new TabelaController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de tabelas', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockTabelas = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'Tabela 1',
          banco: { nome: 'Banco 1' },
          sistema: { nome: 'Sistema 1' },
          colunas: [{ nome: 'coluna1' }],
          _count: { colunas: 1 }
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Tabela 2',
          banco: { nome: 'Banco 2' },
          sistema: { nome: 'Sistema 2' },
          colunas: [{ nome: 'coluna1' }, { nome: 'coluna2' }],
          _count: { colunas: 2 }
        }
      ]

      mockPrisma.tabela.findMany.mockResolvedValue(mockTabelas)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          banco: true,
          sistema: true,
          colunas: true,
          necessidadeInfo: true,
          termo: true,
          _count: {
            select: {
              colunas: true,
              codificacoes: true
            }
          }
        }
      })

      expect(mockPrisma.tabela.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true,
          colunas: true,
          _count: {
            select: {
              colunas: true,
              codificacoes: true
            }
          }
        }
      })
      expect(result).toEqual({ data: mockTabelas })
    })
  })

  describe('findById', () => {
    it('deve retornar tabela por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockTabela = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Tabela Test',
        banco: { nome: 'Banco Test' },
        sistema: { nome: 'Sistema Test' },
        colunas: [{ nome: 'coluna1' }],
        _count: { colunas: 1 }
      }

      mockPrisma.tabela.findUnique.mockResolvedValue(mockTabela)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true,
          colunas: {
            include: {
              necessidadeInfo: true
            }
          },
          codificacoes: true
        }
      })
      expect(result).toEqual({ data: mockTabela })
    })

    it('deve retornar erro se tabela não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.tabela.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Tabela não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova tabela', async () => {
      const mockRequest = createMockRequest({
        nome: 'Nova Tabela',
        bancoId: '550e8400-e29b-41d4-a716-446655440000',
        sistemaId: '550e8400-e29b-41d4-a716-446655440001'
      })

      const mockTabela = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Nova Tabela',
        bancoId: '550e8400-e29b-41d4-a716-446655440000',
        sistemaId: '550e8400-e29b-41d4-a716-446655440001',
        banco: { nome: 'Banco Test' },
        sistema: { nome: 'Sistema Test' },
        colunas: [],
        _count: { colunas: 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.tabela.create.mockResolvedValue(mockTabela)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Tabela',
          bancoId: '550e8400-e29b-41d4-a716-446655440000',
          sistemaId: '550e8400-e29b-41d4-a716-446655440001'
        },
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true
        }
      })
      expect(result).toEqual({ data: mockTabela })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        nome: '', // nome vazio deve falhar na validação
        bancoId: '550e8400-e29b-41d4-a716-446655440000'
      })

      mockPrisma.tabela.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar tabela existente', async () => {
      const mockRequest = createMockRequest(
        {
          nome: 'Tabela Atualizada'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockTabela = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Tabela Atualizada',
        banco: { nome: 'Banco Test' },
        sistema: { nome: 'Sistema Test' },
        colunas: [],
        _count: { colunas: 0 },
        updatedAt: new Date()
      }

      mockPrisma.tabela.update.mockResolvedValue(mockTabela)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Tabela Atualizada'
        },
        include: {
          banco: true,
          sistema: true,
          termo: true,
          necessidadeInfo: true
        }
      })
      expect(result).toEqual({ data: mockTabela })
    })

    it('deve retornar erro se tabela não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Tabela Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.tabela.update.mockRejectedValue(new Error('Table not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar tabela existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockTabela = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Tabela Deletada'
      }

      mockPrisma.tabela.delete.mockResolvedValue(mockTabela)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.tabela.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockTabela })
    })

    it('deve retornar erro se tabela tem dependências', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      mockPrisma.tabela.delete.mockRejectedValue(new Error('Foreign key constraint fails'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
