import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PoliticaInternaController } from '../../controllers/politica-interna.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('PoliticaInternaController', () => {
  let controller: PoliticaInternaController
  let mockReply: any

  beforeEach(() => {
    controller = new PoliticaInternaController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de políticas internas', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockPoliticas = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          titulo: 'Política 1',
          descricao: 'Descrição 1',
          versao: '1.0'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          titulo: 'Política 2',
          descricao: 'Descrição 2',
          versao: '1.0'
        }
      ]

      mockPrisma.politicaInterna.findMany.mockResolvedValue(mockPoliticas)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.politicaInterna.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          dominioDados: true,
          papeis: true,
          listaClassificacoes: true,
          listaDimensoes: true
        }
      })
      expect(result).toEqual({ data: mockPoliticas })
    })
  })

  describe('findById', () => {
    it('deve retornar política interna por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockPolitica = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        titulo: 'Política Test',
        descricao: 'Descrição da política',
        versao: '1.0'
      }

      mockPrisma.politicaInterna.findUnique.mockResolvedValue(mockPolitica)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.politicaInterna.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          dominioDados: true,
          papeis: true,
          listaClassificacoes: true,
          listaDimensoes: true
        }
      })
      expect(result).toEqual({ data: mockPolitica })
    })

    it('deve retornar erro se política não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.politicaInterna.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('Política interna não encontrada')
    })
  })

  describe('create', () => {
    it('deve criar nova política interna', async () => {
      const mockRequest = createMockRequest({
        titulo: 'Nova Política',
        descricao: 'Descrição da nova política',
        versao: '1.0'
      })

      const mockPolitica = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        titulo: 'Nova Política',
        descricao: 'Descrição da nova política',
        versao: '1.0',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.politicaInterna.create.mockResolvedValue(mockPolitica)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.politicaInterna.create).toHaveBeenCalledWith({
        data: {
          titulo: 'Nova Política',
          descricao: 'Descrição da nova política',
          versao: '1.0'
        },
        include: {
          dominioDados: true
        }
      })
      expect(result).toEqual({ data: mockPolitica })
    })

    it('deve lidar com erro de validação', async () => {
      const mockRequest = createMockRequest({
        titulo: '', // título vazio deve falhar na validação
        descricao: 'Descrição'
      })

      mockPrisma.politicaInterna.create.mockRejectedValue(new Error('Validation error'))

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('deve atualizar política existente', async () => {
      const mockRequest = createMockRequest(
        {
          titulo: 'Política Atualizada',
          descricao: 'Descrição atualizada',
          versao: '1.1'
        },
        { id: '550e8400-e29b-41d4-a716-446655440000' }
      )

      const mockPolitica = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        titulo: 'Política Atualizada',
        descricao: 'Descrição atualizada',
        versao: '1.1',
        updatedAt: new Date()
      }

      mockPrisma.politicaInterna.update.mockResolvedValue(mockPolitica)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.politicaInterna.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          titulo: 'Política Atualizada',
          descricao: 'Descrição atualizada',
          versao: '1.1'
        },
        include: {
          dominioDados: true
        }
      })
      expect(result).toEqual({ data: mockPolitica })
    })

    it('deve retornar erro se política não existe para atualizar', async () => {
      const mockRequest = createMockRequest(
        { titulo: 'Política Atualizada' },
        { id: '550e8400-e29b-41d4-a716-446655440999' }
      )

      mockPrisma.politicaInterna.update.mockRejectedValue(new Error('Internal policy not found'))

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('deve deletar política existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockPolitica = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        titulo: 'Política Deletada'
      }

      mockPrisma.politicaInterna.delete.mockResolvedValue(mockPolitica)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.politicaInterna.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockPolitica })
    })

    it('deve retornar erro se política não existe para deletar', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.politicaInterna.delete.mockRejectedValue(new Error('Internal policy not found'))

      await controller.delete(mockRequest as any, mockReply)

      expect(mockReply.log.error).toHaveBeenCalled()
    })
  })
})
