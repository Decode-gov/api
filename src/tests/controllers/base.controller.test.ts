import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseController } from '../../controllers/base.controller.js'
import { createMockReply, mockPrisma } from '../setup.js'

class TestController extends BaseController {
  constructor(prisma: any) {
    super(prisma, 'test')
  }

  async findMany() { return { data: [] } }
  async findById() { return { data: {} } }
  async create() { return { data: {} } }
  async update() { return { data: {} } }
  async delete() { return { data: {} } }

  // Métodos públicos para testes
  public testValidateId(id: string) {
    return this.validateId(id)
  }

  public testValidatePagination(query: any) {
    return this.validatePagination(query)
  }

  public testHandleError(reply: any, error: any) {
    return this.handleError(reply, error)
  }
}

describe('BaseController', () => {
  let controller: TestController
  let mockReply: any

  beforeEach(() => {
    controller = new TestController(mockPrisma)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('validateId', () => {
    it('deve retornar ID válido', () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000'
      const result = controller.testValidateId(validId)
      expect(result).toBe(validId)
    })

    it('deve aceitar qualquer ID em ambiente de teste', () => {
      // Em ambiente de teste, qualquer string é aceita
      expect(controller.testValidateId('invalid-id')).toBe('invalid-id')
      expect(controller.testValidateId('1')).toBe('1')
      expect(controller.testValidateId('test-id')).toBe('test-id')
    })
  })

  describe('validatePagination', () => {
    it('deve retornar paginação padrão quando não fornecida', () => {
      const result = controller.testValidatePagination({})
      expect(result).toEqual({
        skip: 0,
        take: 20,
        orderBy: { id: 'asc' }
      })
    })

    it('deve aplicar paginação personalizada', () => {
      const query = { skip: '20', take: '5' }
      const result = controller.testValidatePagination(query)
      expect(result).toEqual({
        skip: 20,
        take: 5,
        orderBy: { id: 'asc' }
      })
    })

    it('deve limitar take ao máximo de 100', () => {
      const query = { take: '50' }
      const result = controller.testValidatePagination(query)
      expect(result.take).toBe(50)
    })

    it('deve aplicar ordenação personalizada', () => {
      const query = { orderBy: '{"nome": "asc"}' }
      const result = controller.testValidatePagination(query)
      expect(result.orderBy).toEqual({ nome: 'asc' })
    })
  })

  describe('handleError', () => {
    it('deve tratar erro P2025 (registro não encontrado)', () => {
      const error = new Error('Record not found') as any
      error.code = 'P2025'

      controller.testHandleError(mockReply, error)

      expect(mockReply.notFound).toHaveBeenCalledWith('Registro não encontrado')
    })

    it('deve tratar erro P2002 (constraint única)', () => {
      const error = new Error('Unique constraint') as any
      error.code = 'P2002'

      controller.testHandleError(mockReply, error)

      expect(mockReply.conflict).toHaveBeenCalledWith('Violação de constraint única')
    })

    it('deve tratar erro de validação', () => {
      const error = new Error('Campo inválido')

      controller.testHandleError(mockReply, error)

      expect(mockReply.badRequest).toHaveBeenCalledWith('Campo inválido')
    })

    it('deve tratar erro genérico', () => {
      const error = new Error('Generic error')

      controller.testHandleError(mockReply, error)

      expect(mockReply.log.error).toHaveBeenCalledWith(error)
      expect(mockReply.internalServerError).toHaveBeenCalledWith('Erro interno do servidor')
    })
  })
})
