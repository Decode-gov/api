import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { ClassificacaoInformacaoController } from '../../controllers/classificacao-informacao.controller.js'

// Mock do Prisma
const mockPrisma = {
  classificacaoInformacao: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  termoClassificacao: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  politicaInterna: {
    findUnique: vi.fn(),
  },
  definicao: {
    findUnique: vi.fn(),
  },
} as any

// Mock das funções de reply
const mockReply = {
  status: vi.fn().mockReturnThis(),
  send: vi.fn().mockReturnThis(),
  badRequest: vi.fn(),
  internalServerError: vi.fn(),
} as unknown as FastifyReply

// Dados mock
const mockClassificacao = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  nome: 'Classificação Teste',
  descricao: 'Descrição teste',
  politicaId: '123e4567-e89b-12d3-a456-426614174001',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPolitica = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  nome: 'Política Teste',
}

const mockTermo = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  termo: 'Termo Teste',
  definicao: 'Definição do termo teste',
}

const mockClassificacaoCompleta = {
  ...mockClassificacao,
  politica: { id: mockPolitica.id, nome: mockPolitica.nome },
  termos: [
    {
      termo: mockTermo,
    },
  ],
}

describe('ClassificacaoInformacaoController', () => {
  let controller: ClassificacaoInformacaoController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new ClassificacaoInformacaoController(mockPrisma)
  })

  describe('findMany', () => {
    it('deve listar classificações com sucesso', async () => {
      const mockRequest = {
        query: { skip: 0, take: 10, orderBy: 'nome' },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.findMany.mockResolvedValue([mockClassificacaoCompleta])

      await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.classificacaoInformacao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        orderBy: { nome: 'asc' },
        include: {
          politica: {
            select: { id: true, nome: true },
          },
          termos: {
            include: {
              termo: {
                select: { id: true, termo: true, definicao: true },
              },
            },
          },
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Classificações de informação encontradas',
        data: [mockClassificacaoCompleta],
      })
    })

    it('deve filtrar por politicaId quando fornecido', async () => {
      const politicaId = '123e4567-e89b-12d3-a456-426614174001'
      const mockRequest = {
        query: { skip: 0, take: 10, orderBy: 'nome', politicaId },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.findMany.mockResolvedValue([mockClassificacaoCompleta])

      await controller.findMany(mockRequest as any, mockReply)

      expect(mockPrisma.classificacaoInformacao.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { politicaId },
        orderBy: { nome: 'asc' },
        include: {
          politica: {
            select: { id: true, nome: true },
          },
          termos: {
            include: {
              termo: {
                select: { id: true, termo: true, definicao: true },
              },
            },
          },
        },
      })
    })
  })

  describe('findById', () => {
    it('deve buscar classificação por ID com sucesso', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacaoCompleta)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockPrisma.classificacaoInformacao.findUnique).toHaveBeenCalledWith({
        where: { id: mockClassificacao.id },
        include: {
          politica: {
            select: { id: true, nome: true },
          },
          termos: {
            include: {
              termo: {
                select: { id: true, termo: true, definicao: true },
              },
            },
          },
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Classificação de informação encontrada',
        data: mockClassificacaoCompleta,
      })
    })

    it('deve retornar 404 quando classificação não for encontrada', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(null)

      await controller.findById(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(404)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'NotFound',
        message: 'Classificação de informação não encontrada',
      })
    })
  })

  describe('create', () => {
    it('deve criar classificação sem termo com sucesso', async () => {
      const mockRequest = {
        body: {
          nome: 'Nova Classificação',
          descricao: 'Descrição da nova classificação',
          politicaId: mockPolitica.id,
        },
      } as FastifyRequest

      mockPrisma.politicaInterna.findUnique.mockResolvedValue(mockPolitica)
      mockPrisma.classificacaoInformacao.create.mockResolvedValue(mockClassificacaoCompleta)
      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacaoCompleta)

      await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.politicaInterna.findUnique).toHaveBeenCalledWith({
        where: { id: mockPolitica.id },
      })

      expect(mockPrisma.classificacaoInformacao.create).toHaveBeenCalledWith({
        data: {
          nome: 'Nova Classificação',
          descricao: 'Descrição da nova classificação',
          politicaId: mockPolitica.id,
        },
        include: {
          politica: {
            select: { id: true, nome: true },
          },
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(201)
    })

    it('deve criar classificação com termo com sucesso', async () => {
      const mockRequest = {
        body: {
          nome: 'Nova Classificação',
          descricao: 'Descrição da nova classificação',
          politicaId: mockPolitica.id,
          termoId: mockTermo.id,
        },
      } as FastifyRequest

      mockPrisma.politicaInterna.findUnique.mockResolvedValue(mockPolitica)
      mockPrisma.definicao.findUnique.mockResolvedValue(mockTermo)
      mockPrisma.classificacaoInformacao.create.mockResolvedValue(mockClassificacaoCompleta)
      mockPrisma.termoClassificacao.create.mockResolvedValue({})
      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacaoCompleta)

      await controller.create(mockRequest as any, mockReply)

      expect(mockPrisma.definicao.findUnique).toHaveBeenCalledWith({
        where: { id: mockTermo.id },
      })

      expect(mockPrisma.termoClassificacao.create).toHaveBeenCalledWith({
        data: {
          termoId: mockTermo.id,
          classificacaoInformacaoId: mockClassificacao.id,
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(201)
    })

    it('deve retornar erro quando política não for encontrada', async () => {
      const mockRequest = {
        body: {
          nome: 'Nova Classificação',
          politicaId: 'invalid-id',
        },
      } as FastifyRequest

      mockPrisma.politicaInterna.findUnique.mockResolvedValue(null)

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'BadRequest',
        message: 'Política interna não encontrada',
      })
    })

    it('deve retornar erro quando termo não for encontrado', async () => {
      const mockRequest = {
        body: {
          nome: 'Nova Classificação',
          politicaId: mockPolitica.id,
          termoId: 'invalid-id',
        },
      } as FastifyRequest

      mockPrisma.politicaInterna.findUnique.mockResolvedValue(mockPolitica)
      mockPrisma.definicao.findUnique.mockResolvedValue(null)

      await controller.create(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'BadRequest',
        message: 'Termo de definição não encontrado',
      })
    })
  })

  describe('update', () => {
    it('deve atualizar classificação sem termo com sucesso', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
        body: {
          nome: 'Nome Atualizado',
          descricao: 'Descrição atualizada',
        },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.update.mockResolvedValue(mockClassificacaoCompleta)
      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacaoCompleta)

      await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.classificacaoInformacao.update).toHaveBeenCalledWith({
        where: { id: mockClassificacao.id },
        data: {
          nome: 'Nome Atualizado',
          descricao: 'Descrição atualizada',
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
    })

    it('deve atualizar classificação com novo termo com sucesso', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
        body: {
          nome: 'Nome Atualizado',
          termoId: mockTermo.id,
        },
      } as FastifyRequest

      mockPrisma.definicao.findUnique.mockResolvedValue(mockTermo)
      mockPrisma.termoClassificacao.deleteMany.mockResolvedValue({})
      mockPrisma.termoClassificacao.create.mockResolvedValue({})
      mockPrisma.classificacaoInformacao.update.mockResolvedValue(mockClassificacaoCompleta)
      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacaoCompleta)

      await controller.update(mockRequest as any, mockReply)

      expect(mockPrisma.termoClassificacao.deleteMany).toHaveBeenCalledWith({
        where: { classificacaoInformacaoId: mockClassificacao.id },
      })

      expect(mockPrisma.termoClassificacao.create).toHaveBeenCalledWith({
        data: {
          termoId: mockTermo.id,
          classificacaoInformacaoId: mockClassificacao.id,
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
    })

    it('deve retornar erro quando nenhum campo for fornecido', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
        body: {},
      } as FastifyRequest

      await controller.update(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(400)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'BadRequest',
        message: 'Nenhum campo fornecido para atualização',
      })
    })
  })

  describe('delete', () => {
    it('deve deletar classificação com sucesso', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.delete.mockResolvedValue(mockClassificacao)

      await controller.delete(mockRequest as any, mockReply)

      expect(mockPrisma.classificacaoInformacao.delete).toHaveBeenCalledWith({
        where: { id: mockClassificacao.id },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Classificação de informação deletada com sucesso',
      })
    })
  })

  describe('atualizarTermo', () => {
    it('deve atualizar termo da classificação com sucesso', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
        body: { termoId: mockTermo.id },
      } as FastifyRequest

      const mockTermoClassificacao = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        termo: mockTermo,
        classificacaoInformacao: { id: mockClassificacao.id, nome: mockClassificacao.nome },
      }

      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacao)
      mockPrisma.definicao.findUnique.mockResolvedValue(mockTermo)
      mockPrisma.termoClassificacao.deleteMany.mockResolvedValue({})
      mockPrisma.termoClassificacao.create.mockResolvedValue(mockTermoClassificacao)

      await controller.atualizarTermo(mockRequest as any, mockReply)

      expect(mockPrisma.termoClassificacao.deleteMany).toHaveBeenCalledWith({
        where: { classificacaoInformacaoId: mockClassificacao.id },
      })

      expect(mockPrisma.termoClassificacao.create).toHaveBeenCalledWith({
        data: {
          termoId: mockTermo.id,
          classificacaoInformacaoId: mockClassificacao.id,
        },
        include: {
          termo: {
            select: { id: true, termo: true, definicao: true },
          },
          classificacaoInformacao: {
            select: { id: true, nome: true },
          },
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Termo de definição atualizado com sucesso',
        data: mockTermoClassificacao,
      })
    })

    it('deve retornar erro quando classificação não for encontrada', async () => {
      const mockRequest = {
        params: { id: '123e4567-e89b-12d3-a456-426614174000' },
        body: { termoId: mockTermo.id },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(null)

      await controller.atualizarTermo(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(404)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'NotFound',
        message: 'Classificação de informação não encontrada',
      })
    })

    it('deve retornar erro quando termo não for encontrado', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
        body: { termoId: '123e4567-e89b-12d3-a456-426614174002' },
      } as FastifyRequest

      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacao)
      mockPrisma.definicao.findUnique.mockResolvedValue(null)

      await controller.atualizarTermo(mockRequest as any, mockReply)

      expect(mockReply.status).toHaveBeenCalledWith(404)
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'NotFound',
        message: 'Termo não encontrado',
      })
    })
  })

  describe('listarTodas', () => {
    it('deve listar todas as classificações com sucesso', async () => {
      const mockRequest = {} as FastifyRequest
      const mockClassificacoes = [mockClassificacaoCompleta, { ...mockClassificacaoCompleta, id: 'outro-id' }]

      mockPrisma.classificacaoInformacao.findMany.mockResolvedValue(mockClassificacoes)

      await controller.listarTodas(mockRequest, mockReply)

      expect(mockPrisma.classificacaoInformacao.findMany).toHaveBeenCalledWith({
        include: {
          politica: {
            select: { id: true, nome: true },
          },
          termos: {
            include: {
              termo: {
                select: { id: true, termo: true, definicao: true },
              },
            },
          },
        },
        orderBy: { nome: 'asc' },
      })

      expect(mockReply.status).toHaveBeenCalledWith(200)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Todas as classificações de informação encontradas',
        data: mockClassificacoes,
        total: 2,
      })
    })
  })

  describe('atribuirTermo', () => {
    it('deve atribuir termo à classificação com sucesso', async () => {
      const mockRequest = {
        params: { id: mockClassificacao.id },
        body: { termoId: mockTermo.id },
      } as FastifyRequest

      const mockTermoClassificacao = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        termo: mockTermo,
        classificacaoInformacao: { id: mockClassificacao.id, nome: mockClassificacao.nome },
      }

      mockPrisma.classificacaoInformacao.findUnique.mockResolvedValue(mockClassificacao)
      mockPrisma.definicao.findUnique.mockResolvedValue(mockTermo)
      mockPrisma.termoClassificacao.create.mockResolvedValue(mockTermoClassificacao)

      await controller.atribuirTermo(mockRequest as any, mockReply)

      expect(mockPrisma.termoClassificacao.create).toHaveBeenCalledWith({
        data: {
          termoId: mockTermo.id,
          classificacaoInformacaoId: mockClassificacao.id,
        },
        include: {
          termo: {
            select: { id: true, termo: true, definicao: true },
          },
          classificacaoInformacao: {
            select: { id: true, nome: true },
          },
        },
      })

      expect(mockReply.status).toHaveBeenCalledWith(201)
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Termo atribuído à classificação com sucesso',
        data: mockTermoClassificacao,
      })
    })
  })
})
