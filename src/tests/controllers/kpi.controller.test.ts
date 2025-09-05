import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KpiController } from '../../controllers/kpi.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'

describe('KpiController', () => {
  let controller: KpiController
  let mockReply: any

  beforeEach(() => {
    controller = new KpiController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('findMany', () => {
    it('deve retornar lista de KPIs', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockKpis = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nome: 'KPI 1',
          descricao: 'Descrição KPI 1',
          processo: { nome: 'Processo 1' }
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'KPI 2',
          descricao: 'Descrição KPI 2',
          processo: { nome: 'Processo 2' }
        }
      ]

      mockPrisma.kPI.findMany.mockResolvedValue(mockKpis)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.kPI.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        include: {
          comunidade: true,
          processo: true
        }
      })
      expect(result).toEqual({ data: mockKpis })
    })
  })

  describe('findById', () => {
    it('deve retornar KPI por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockKpi = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'KPI Test',
        descricao: 'Descrição do KPI',
        processo: { nome: 'Processo Test' }
      }

      mockPrisma.kPI.findUnique.mockResolvedValue(mockKpi)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.kPI.findUnique).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        include: {
          comunidade: true,
          processo: true
        }
      })
      expect(result).toEqual({ data: mockKpi })
    })

    it('deve retornar erro se KPI não existe', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440999' })

      mockPrisma.kPI.findUnique.mockResolvedValue(null)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.notFound).toHaveBeenCalledWith('KPI não encontrado')
    })
  })

  describe('create', () => {
    it('deve criar novo KPI', async () => {
      const mockRequest = createMockRequest({
        nome: 'Novo KPI',
        descricao: 'Descrição do novo KPI',
        processoId: '550e8400-e29b-41d4-a716-446655440000'
      })

      const mockProcesso = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Processo Test'
      }

      const mockKpi = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'Novo KPI',
        descricao: 'Descrição do novo KPI',
        processoId: '550e8400-e29b-41d4-a716-446655440000',
        processo: { nome: 'Processo Test' },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.processo.findUnique.mockResolvedValue(mockProcesso)
      mockPrisma.kPI.create.mockResolvedValue(mockKpi)

      const result = await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.kPI.create).toHaveBeenCalledWith({
        data: {
          nome: 'Novo KPI',
          descricao: 'Descrição do novo KPI',
          processoId: '550e8400-e29b-41d4-a716-446655440000'
        },
        include: {
          comunidade: true,
          processo: true
        }
      })
      expect(mockReply.code).toHaveBeenCalledWith(201)
      expect(result).toEqual({ data: mockKpi })
    })
  })

  describe('update', () => {
    it('deve atualizar KPI existente', async () => {
      const mockRequest = createMockRequest({
        nome: 'KPI Atualizado',
        descricao: 'Descrição atualizada'
      }, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockKpi = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'KPI Atualizado',
        descricao: 'Descrição atualizada',
        updatedAt: new Date()
      }

      mockPrisma.kPI.update.mockResolvedValue(mockKpi)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.kPI.update).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        data: {
          nome: 'KPI Atualizado',
          descricao: 'Descrição atualizada'
        },
        include: {
          comunidade: true,
          processo: true
        }
      })
      expect(result).toEqual({ data: mockKpi })
    })
  })

  describe('delete', () => {
    it('deve deletar KPI existente', async () => {
      const mockRequest = createMockRequest({}, { id: '550e8400-e29b-41d4-a716-446655440000' })

      const mockKpi = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nome: 'KPI Deletado'
      }

      mockPrisma.kPI.delete.mockResolvedValue(mockKpi)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.kPI.delete).toHaveBeenCalledWith({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' }
      })
      expect(result).toEqual({ data: mockKpi })
    })
  })
})
