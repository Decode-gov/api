import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface ClassificacaoInformacaoParams {
  id: string
}

interface ClassificacaoInformacaoQuery {
  skip?: number
  take?: number
  orderBy?: string
  politicaId?: string
}

interface ClassificacaoInformacaoBody {
  nome: string
  descricao?: string
  politicaId: string
  termoId?: string
}

export class ClassificacaoInformacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'classificacaoInformacao')
  }

  async findMany(request: FastifyRequest<{ Querystring: ClassificacaoInformacaoQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'nome', politicaId } = request.query

      this.validatePagination({ skip, take })

      const where = politicaId ? { politicaId } : {}

      const classificacoes = await (this.prisma as any).classificacaoInformacao.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          termos: {
            include: {
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Classificações de informação encontradas',
        data: classificacoes
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: ClassificacaoInformacaoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const classificacao = await (this.prisma as any).classificacaoInformacao.findUnique({
        where: { id },
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          termos: {
            include: {
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          }
        }
      })

      if (!classificacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Classificação de informação não encontrada'
        })
      }

      return reply.status(200).send({
        message: 'Classificação de informação encontrada',
        data: classificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: ClassificacaoInformacaoBody }>, reply: FastifyReply) {
    try {
      const { nome, descricao, politicaId, termoId } = request.body

      // Validar se a política existe
      const politica = await this.prisma.politicaInterna.findUnique({
        where: { id: politicaId }
      })

      if (!politica) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Política interna não encontrada'
        })
      }

      // Se termoId foi fornecido, validar se o termo existe
      if (termoId) {
        const termo = await this.prisma.definicao.findUnique({
          where: { id: termoId }
        })

        if (!termo) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Termo de definição não encontrado'
          })
        }
      }

      const classificacao = await (this.prisma as any).classificacaoInformacao.create({
        data: {
          nome,
          descricao,
          politicaId
        },
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      // Se termoId foi fornecido, criar a associação
      if (termoId) {
        await (this.prisma as any).termoClassificacao.create({
          data: {
            termoId,
            classificacaoInformacaoId: classificacao.id
          }
        })
      }

      // Buscar a classificação criada com todas as relações
      const classificacaoCompleta = await (this.prisma as any).classificacaoInformacao.findUnique({
        where: { id: classificacao.id },
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          termos: {
            include: {
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Classificação de informação criada com sucesso',
        data: classificacaoCompleta
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: ClassificacaoInformacaoParams; Body: Partial<ClassificacaoInformacaoBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const updateData = { ...request.body }
      const { termoId, ...classificacaoData } = updateData

      if (Object.keys(updateData).length === 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      // Se está atualizando politicaId, validar se existe
      if (classificacaoData.politicaId) {
        const politica = await this.prisma.politicaInterna.findUnique({
          where: { id: classificacaoData.politicaId }
        })

        if (!politica) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Política interna não encontrada'
          })
        }
      }

      // Se está atualizando termoId, validar se existe
      if (termoId) {
        const termo = await this.prisma.definicao.findUnique({
          where: { id: termoId }
        })

        if (!termo) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Termo de definição não encontrado'
          })
        }

        // Remover termos existentes e adicionar o novo
        await (this.prisma as any).termoClassificacao.deleteMany({
          where: { classificacaoInformacaoId: id }
        })

        await (this.prisma as any).termoClassificacao.create({
          data: {
            termoId,
            classificacaoInformacaoId: id
          }
        })
      }

      // Atualizar apenas os dados da classificação (sem termoId)
      if (Object.keys(classificacaoData).length > 0) {
        await (this.prisma as any).classificacaoInformacao.update({
          where: { id },
          data: classificacaoData
        })
      }

      // Buscar a classificação atualizada com todas as relações
      const classificacao = await (this.prisma as any).classificacaoInformacao.findUnique({
        where: { id },
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          termos: {
            include: {
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Classificação de informação atualizada com sucesso',
        data: classificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: ClassificacaoInformacaoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      await (this.prisma as any).classificacaoInformacao.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Classificação de informação deletada com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método específico para atualizar apenas o termo de definição
  async atualizarTermo(request: FastifyRequest<{ Params: { id: string }; Body: { termoId: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { termoId } = request.body

      this.validateId(id)
      this.validateId(termoId)

      // Verificar se a classificação existe
      const classificacao = await (this.prisma as any).classificacaoInformacao.findUnique({
        where: { id }
      })

      if (!classificacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Classificação de informação não encontrada'
        })
      }

      // Verificar se o termo existe
      const termo = await this.prisma.definicao.findUnique({
        where: { id: termoId }
      })

      if (!termo) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Termo não encontrado'
        })
      }

      // Remover termos existentes e adicionar o novo
      await (this.prisma as any).termoClassificacao.deleteMany({
        where: { classificacaoInformacaoId: id }
      })

      const termoClassificacao = await (this.prisma as any).termoClassificacao.create({
        data: {
          termoId,
          classificacaoInformacaoId: id
        },
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          classificacaoInformacao: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Termo de definição atualizado com sucesso',
        data: termoClassificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para listar todas as classificações (sem paginação)
  async listarTodas(request: FastifyRequest, reply: FastifyReply) {
    try {
      const classificacoes = await (this.prisma as any).classificacaoInformacao.findMany({
        include: {
          politica: {
            select: {
              id: true,
              nome: true
            }
          },
          termos: {
            include: {
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          }
        },
        orderBy: { nome: 'asc' }
      })

      return reply.status(200).send({
        message: 'Todas as classificações de informação encontradas',
        data: classificacoes,
        total: classificacoes.length
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método específico para atribuir classificação a um termo
  async atribuirTermo(request: FastifyRequest<{ Params: { id: string }; Body: { termoId: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { termoId } = request.body

      this.validateId(id)
      this.validateId(termoId)

      // Verificar se a classificação existe
      const classificacao = await (this.prisma as any).classificacaoInformacao.findUnique({
        where: { id }
      })

      if (!classificacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Classificação de informação não encontrada'
        })
      }

      // Verificar se o termo existe
      const termo = await this.prisma.definicao.findUnique({
        where: { id: termoId }
      })

      if (!termo) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Termo não encontrado'
        })
      }

      // Criar a associação
      const termoClassificacao = await (this.prisma as any).termoClassificacao.create({
        data: {
          termoId,
          classificacaoInformacaoId: id
        },
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          classificacaoInformacao: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Termo atribuído à classificação com sucesso',
        data: termoClassificacao
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para listar classificações por nível (DEPRECADO - campo nivel não existe no schema)
  /*
  async listarPorNivel(request: FastifyRequest<{ Params: { nivel: string } }>, reply: FastifyReply) {
    try {
      const { nivel } = request.params

      // Validar nível
      const niveisValidos = ['PUBLICO', 'INTERNO', 'CONFIDENCIAL', 'SECRETO']
      if (!niveisValidos.includes(nivel)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Nível deve ser um dos seguintes: ${niveisValidos.join(', ')}`
        })
      }

      const classificacoes = await (this.prisma as any).classificacaoInformacao.findMany({
        where: { nivel },
        include: {
          politica: {
            select: {
              nome: true,
              versao: true
            }
          }
        },
        orderBy: { nome: 'asc' }
      })

      return reply.status(200).send({
        message: `Classificações do nível ${nivel} encontradas`,
        data: classificacoes
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
  */
}
