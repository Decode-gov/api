import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { BaseController } from './base.controller.js'
import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateUserRequest
} from '../types/auth.js'
import { generateToken } from '../middleware/auth.js'

export class UsuarioController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'usuario')
  }

  // Helper para converter Date para string ISO
  private formatUserData(user: any) {
    return {
      ...user,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString()
    }
  }

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { nome, email, senha } = request.body as RegisterRequest

      // Verificar se o email já existe
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email }
      })

      if (existingUser) {
        return reply.status(409).send({
          error: 'Email já cadastrado'
        })
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(senha, 10)

      // Criar o usuário
      const user = await this.prisma.usuario.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          ativo: true
        },
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      reply.status(201).send({
        message: 'Usuário criado com sucesso',
        data: this.formatUserData(user)
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { email, senha } = request.body as LoginRequest

      // Buscar o usuário pelo email
      const user = await this.prisma.usuario.findUnique({
        where: { email }
      })

      if (!user) {
        return reply.status(401).send({
          error: 'Credenciais inválidas'
        })
      }

      if (!user.ativo) {
        return reply.status(401).send({
          error: 'Usuário inativo'
        })
      }

      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(senha, user.senha)

      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Credenciais inválidas'
        })
      }

      // Gerar token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email
      })

      // Salvar token em cookie seguro
      reply.setCookie('authToken', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 1,
        // domain: process.env.ENV_DOMAIN,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })

      reply.status(200).send({
        message: 'Login realizado com sucesso',
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Remover cookie de autenticação
    reply.clearCookie('authToken', {
      path: '/'
    })

    reply.send({
      message: 'Logout realizado com sucesso'
    })
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { senhaAtual, novaSenha } = request.body as ChangePasswordRequest
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({
          error: 'Usuário não autenticado'
        })
      }

      // Buscar o usuário
      const user = await this.prisma.usuario.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return reply.status(404).send({
          error: 'Usuário não encontrado'
        })
      }

      // Verificar a senha atual
      const isCurrentPasswordValid = await bcrypt.compare(senhaAtual, user.senha)

      if (!isCurrentPasswordValid) {
        return reply.status(400).send({
          error: 'Senha atual incorreta'
        })
      }

      // Criptografar a nova senha
      const hashedNewPassword = await bcrypt.hash(novaSenha, 10)

      // Atualizar a senha
      await this.prisma.usuario.update({
        where: { id: userId },
        data: { senha: hashedNewPassword }
      })

      reply.send({
        message: 'Senha alterada com sucesso'
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user?.userId

      if (!userId) {
        return reply.status(401).send({
          error: 'Usuário não autenticado'
        })
      }

      const user = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        return reply.status(404).send({
          error: 'Usuário não encontrado'
        })
      }

      reply.send({
        message: 'Perfil do usuário',
        data: this.formatUserData(user)
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user?.userId
      const updateData = request.body as UpdateUserRequest

      if (!userId) {
        return reply.status(401).send({
          error: 'Usuário não autenticado'
        })
      }

      // Se está tentando atualizar o email, verificar se já existe
      if (updateData.email) {
        const existingUser = await this.prisma.usuario.findFirst({
          where: {
            email: updateData.email,
            id: { not: userId }
          }
        })

        if (existingUser) {
          return reply.status(409).send({
            error: 'Email já está em uso'
          })
        }
      }

      const updatedUser = await this.prisma.usuario.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      reply.send({
        message: 'Perfil atualizado com sucesso',
        data: this.formatUserData(updatedUser)
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  // Implementação dos métodos abstratos do BaseController
  async findMany(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const { skip, take, orderBy } = this.validatePagination(request.query)

      const data = await this.prisma.usuario.findMany({
        skip,
        take,
        orderBy,
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      const formattedData = data.map(user => this.formatUserData(user))

      reply.send({
        message: 'Usuários encontrados',
        data: formattedData
      })
      return { data: formattedData }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }



  async findById(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.usuario.findUnique({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!data) {
        return reply.status(404).send({
          error: 'Usuário não encontrado'
        })
      }

      const formattedData = this.formatUserData(data)

      reply.send({
        message: 'Usuário encontrado',
        data: formattedData
      })
      return { data: formattedData }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const { nome, email, senha, ativo } = request.body as RegisterRequest & { ativo?: boolean }

      // Verificar se o email já existe
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email }
      })

      if (existingUser) {
        return reply.status(409).send({
          error: 'Email já cadastrado'
        })
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(senha, 10)

      // Criar o usuário
      const data = await this.prisma.usuario.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          ativo: ativo ?? true
        },
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      reply.status(201).send({
        message: 'Usuário criado com sucesso',
        data: this.formatUserData(data)
      })
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)
      const updateData = request.body as UpdateUserRequest

      // Se está tentando atualizar o email, verificar se já existe
      if (updateData.email) {
        const existingUser = await this.prisma.usuario.findFirst({
          where: {
            email: updateData.email,
            id: { not: validId }
          }
        })

        if (existingUser) {
          return reply.status(409).send({
            error: 'Email já está em uso'
          })
        }
      }

      const data = await this.prisma.usuario.update({
        where: { id: validId },
        data: updateData,
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true,
          createdAt: true,
          updatedAt: true
        }
      })

      reply.send({
        message: 'Usuário atualizado com sucesso',
        data: this.formatUserData(data)
      })
      return { data: this.formatUserData(data) }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<any> {
    try {
      const { id } = request.params as { id: string }
      const validId = this.validateId(id)

      const data = await this.prisma.usuario.delete({
        where: { id: validId },
        select: {
          id: true,
          nome: true,
          email: true
        }
      })

      reply.send({
        message: 'Usuário excluído com sucesso',
        data
      })
      return { data }
    } catch (error) {
      return this.handleError(reply, error)
    }
  }
}
