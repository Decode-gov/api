import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListaReferenciaController } from '../../controllers/lista-referencia.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('ListaReferenciaController', () => {
  let controller: ListaReferenciaController
  let mockReply: any

  beforeEach(() => {
    controller = new ListaReferenciaController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve listar todas as listas de referência', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 20 })

      const mockData = [
        {
          id: '1',
          nome: 'Tipos de Documento',
          descricao: 'Lista de tipos de documento válidos',
          valores: '["CPF", "RG", "CNH"]',
          tabelaId: null,
          colunaId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      mockPrisma.listaReferencia.findMany.mockResolvedValue(mockData)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.listaReferencia.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        orderBy: { id: 'asc' },
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })

      expect(result).toEqual(mockReply)
    })
  })

  describe('findById', () => {
    it('deve retornar uma lista de referência por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Tipos de Status',
        descricao: 'Lista de status válidos',
        valores: '["Ativo", "Inativo", "Pendente"]'
      }

      mockPrisma.listaReferencia.findUnique.mockResolvedValue(mockData)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.listaReferencia.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          tabela: true,
          coluna: true
        }
      })

      expect(result).toEqual(mockReply)
    })

    it('deve retornar erro 404 se não encontrar a lista', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.listaReferencia.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(404)
    })
  })

  describe('create', () => {
    it('deve criar uma nova lista de referência', async () => {
      const bodyData = {
        nome: 'Nova Lista',
        descricao: 'Nova lista de referência',
        valores: '["Valor1", "Valor2"]'
      }

      const mockRequest = createMockRequest(bodyData)

      const mockData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...bodyData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.listaReferencia.create.mockResolvedValue(mockData)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.listaReferencia.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Lista',
          descricao: 'Nova lista de referência',
          valores: '["Valor1","Valor2"]',
          tabelaId: undefined,
          colunaId: undefined
        },
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })

      expect(result).toEqual(mockReply)
    })

    it('deve lidar com erro de validação JSON', async () => {
      const bodyData = {
        nome: 'Lista Inválida',
        descricao: 'Lista com JSON inválido',
        valores: '["valor1", "valor2", invalid-json}'
      }

      const mockRequest = createMockRequest(bodyData)

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'BadRequest',
        message: 'Formato JSON inválido para valores'
      })
    })

    it('deve remover valores duplicados automaticamente', async () => {
      const bodyData = {
        nome: 'Lista com Duplicatas',
        descricao: 'Lista que terá duplicatas removidas',
        valores: '["Valor1", "Valor2", "Valor1", "Valor3", "Valor2"]'
      }

      const mockRequest = createMockRequest(bodyData)

      const mockData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...bodyData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.listaReferencia.create.mockResolvedValue(mockData)

      await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.listaReferencia.create).toHaveBeenCalledWith({
        data: {
          nome: 'Lista com Duplicatas',
          descricao: 'Lista que terá duplicatas removidas',
          valores: '["Valor1","Valor2","Valor3"]', // Duplicatas removidas
          tabelaId: undefined,
          colunaId: undefined
        },
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })
    })

    it('deve rejeitar valores vazios', async () => {
      const bodyData = {
        nome: 'Lista com Vazios',
        descricao: 'Lista com valores vazios',
        valores: '["Valor1", "", "Valor3", "   "]'
      }

      const mockRequest = createMockRequest(bodyData)

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'BadRequest',
        message: 'Valores não podem estar vazios'
      })
    })
  })

  describe('update', () => {
    it('deve atualizar uma lista de referência existente', async () => {
      const bodyData = {
        nome: 'Lista Atualizada',
        descricao: 'Descrição atualizada',
        valores: '["NovoValor1", "NovoValor2"]'
      }

      const mockRequest = createMockRequest(bodyData, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...bodyData,
        updatedAt: new Date()
      }

      mockPrisma.listaReferencia.update.mockResolvedValue(mockData)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.listaReferencia.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'Lista Atualizada',
          descricao: 'Descrição atualizada',
          valores: '["NovoValor1","NovoValor2"]'
        },
        include: {
          tabela: {
            select: { id: true, nome: true }
          },
          coluna: {
            select: { id: true, nome: true }
          }
        }
      })

      expect(result).toEqual(mockReply)
    })
  })

  describe('delete', () => {
    it('deve deletar uma lista de referência', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Lista Deletada'
      }

      mockPrisma.listaReferencia.delete.mockResolvedValue(mockData)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.listaReferencia.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })

      expect(result).toEqual(mockReply)
    })
  })
})
