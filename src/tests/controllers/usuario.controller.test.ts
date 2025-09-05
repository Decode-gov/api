import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UsuarioController } from '../../controllers/usuario.controller.js'
import { createMockRequest, createMockReply, mockPrisma } from '../setup.js'
import bcrypt from 'bcryptjs'

// Mock do bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn().mockResolvedValue(true),
  }
}))

// Mock do middleware de auth
vi.mock('../../middleware/auth.js', () => ({
  generateToken: vi.fn(() => 'mock-token')
}))

describe('UsuarioController', () => {
  let controller: UsuarioController
  let mockReply: any

  beforeEach(() => {
    controller = new UsuarioController(mockPrisma as any)
    mockReply = createMockReply()
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockRequest = createMockRequest({
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'password123'
      })

      const mockUser = {
        id: '123',
        nome: 'Test User',
        email: 'test@example.com',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      mockPrisma.usuario.findUnique.mockResolvedValue(null)
      mockPrisma.usuario.create.mockResolvedValue(mockUser)
        ; (bcrypt.hash as any).mockResolvedValue('hashed-password')

      await controller.register(mockRequest as any, mockReply)

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nome: 'Test User',
          email: 'test@example.com',
          senha: 'hashed-password',
          ativo: true
        },
        select: expect.any(Object)
      })
    })

    it('deve retornar erro se email já existe', async () => {
      const mockRequest = createMockRequest({
        nome: 'Test User',
        email: 'existing@example.com',
        senha: 'password123'
      })

      const existingUser = { id: '123', email: 'existing@example.com' }
      mockPrisma.usuario.findUnique.mockResolvedValue(existingUser)

      await controller.register(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(409)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Email já cadastrado'
      })
    })
  })

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockRequest = createMockRequest({
        email: 'test@example.com',
        senha: 'password123'
      })

      const mockUser = {
        id: '123',
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashed-password',
        ativo: true
      }

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser)
        ; (bcrypt.compare as any).mockResolvedValue(true)

      await controller.login(mockRequest as any, mockReply)

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password')
    })

    it('deve retornar erro com credenciais inválidas', async () => {
      const mockRequest = createMockRequest({
        email: 'test@example.com',
        senha: 'wrong-password'
      })

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        senha: 'hashed-password'
      }

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser)
        ; (bcrypt.compare as any).mockResolvedValue(false)

      await controller.login(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(401)
    })

    it('deve retornar erro se usuário não existe', async () => {
      const mockRequest = createMockRequest({
        email: 'nonexistent@example.com',
        senha: 'password123'
      })

      mockPrisma.usuario.findUnique.mockResolvedValue(null)

      await controller.login(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(401)
    })
  })

  describe('findMany', () => {
    it('deve retornar lista de usuários', async () => {
      const mockRequest = createMockRequest({}, {}, { skip: 0, take: 10 })

      const mockUsers = [
        { id: '1', nome: 'User 1', email: 'user1@example.com' },
        { id: '2', nome: 'User 2', email: 'user2@example.com' }
      ]

      mockPrisma.usuario.findMany.mockResolvedValue(mockUsers)

      const result = await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.usuario.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })
      expect(result).toEqual({ data: mockUsers })
    })
  })

  describe('findById', () => {
    it('deve retornar usuário por ID', async () => {
      const mockRequest = createMockRequest({}, { id: '123e4567-e89b-12d3-a456-426614174000' })

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Test User',
        email: 'test@example.com'
      }

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser)

      const result = await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        select: expect.any(Object)
      })
      expect(result).toEqual({ data: mockUser })
    })
  })

  describe('update', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const mockRequest = createMockRequest(
        { nome: 'Updated User', email: 'updated@example.com' },
        { id: '123e4567-e89b-12d3-a456-426614174000' }
      )

      const mockUpdatedUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Updated User',
        email: 'updated@example.com'
      }

      mockPrisma.usuario.findFirst.mockResolvedValue(null)
      mockPrisma.usuario.update.mockResolvedValue(mockUpdatedUser)

      const result = await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: { nome: 'Updated User', email: 'updated@example.com' },
        select: expect.any(Object)
      })
      expect(result).toEqual({ data: mockUpdatedUser })
    })
  })

  describe('delete', () => {
    it('deve deletar usuário com sucesso', async () => {
      const mockRequest = createMockRequest({}, { id: '123e4567-e89b-12d3-a456-426614174000' })

      const mockDeletedUser = { id: '123e4567-e89b-12d3-a456-426614174000', nome: 'Deleted User' }

      mockPrisma.usuario.delete.mockResolvedValue(mockDeletedUser)

      const result = await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.usuario.delete).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        select: expect.any(Object)
      })
      expect(result).toEqual({ data: mockDeletedUser })
    })
  })

  describe('changePassword', () => {
    it('deve alterar senha com sucesso', async () => {
      const mockRequest = createMockRequest({
        senhaAtual: 'currentPassword',
        novaSenha: 'newPassword123'
      }, {}, {}, { userId: '123e4567-e89b-12d3-a456-426614174000' })

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        senha: 'hashed-current-password'
      }

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser)
        ; (bcrypt.compare as any).mockResolvedValue(true)
        ; (bcrypt.hash as any).mockResolvedValue('hashed-new-password')
      mockPrisma.usuario.update.mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174000' })

      await controller.changePassword(mockRequest as any, mockReply)

      expect(bcrypt.compare).toHaveBeenCalledWith('currentPassword', 'hashed-current-password')
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10)
      expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: { senha: 'hashed-new-password' }
      })
    })

    it('deve retornar erro se senha atual está incorreta', async () => {
      const mockRequest = createMockRequest({
        senhaAtual: 'wrongPassword',
        novaSenha: 'newPassword123'
      }, {}, {}, { userId: '123e4567-e89b-12d3-a456-426614174000' })

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        senha: 'hashed-current-password'
      }

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser)
        ; (bcrypt.compare as any).mockResolvedValue(false)

      await controller.changePassword(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Senha atual incorreta'
      })
    })
  })
})
