import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface RepositorioDocumentoParams {
  id: string
}

interface RepositorioDocumentoQuery {
  skip?: number
  take?: number
  orderBy?: string
  tipo?: string
}

interface RepositorioDocumentoBody {
  nome: string
  tipo: string
  localizacao: string
  responsavel: string
}

export class RepositorioDocumentoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'repositorioDocumento')
  }

  async findMany(request: FastifyRequest<{ Querystring: RepositorioDocumentoQuery }>, reply: FastifyReply) {
    try {
      const { skip = 0, take = 10, orderBy = 'nome', tipo } = request.query

      this.validatePagination({ skip, take })

      const where = tipo ? { tipo } : {}

      const repositorios = await (this.prisma as any).repositorioDocumento.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: 'asc' },
        include: {
          documentos: {
            select: {
              id: true,
              caminhoArquivo: true,
              dataUpload: true,
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          },
          bancos: {
            include: {
              banco: {
                select: {
                  id: true,
                  nome: true,
                  tecnologia: true
                }
              }
            }
          },
          documentosTabela: {
            select: {
              id: true,
              caminhoArquivo: true,
              dataUpload: true,
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              }
            }
          }
        }
      })

      return reply.status(200).send({
        message: 'Repositórios de documentos encontrados',
        data: repositorios
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async findById(request: FastifyRequest<{ Params: RepositorioDocumentoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const repositorio = await (this.prisma as any).repositorioDocumento.findUnique({
        where: { id },
        include: {
          documentos: {
            include: {
              termo: {
                select: {
                  id: true,
                  termo: true,
                  definicao: true
                }
              }
            }
          },
          bancos: {
            include: {
              banco: {
                select: {
                  id: true,
                  nome: true,
                  tecnologia: true,
                  sistema: {
                    select: {
                      id: true,
                      nome: true
                    }
                  }
                }
              }
            }
          },
          documentosTabela: {
            include: {
              tabela: {
                select: {
                  id: true,
                  nome: true
                }
              },
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

      if (!repositorio) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Repositório de documentos não encontrado'
        })
      }

      return reply.status(200).send({
        message: 'Repositório de documentos encontrado',
        data: repositorio
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async create(request: FastifyRequest<{ Body: RepositorioDocumentoBody }>, reply: FastifyReply) {
    try {
      const { nome, tipo, localizacao, responsavel } = request.body

      const repositorio = await (this.prisma as any).repositorioDocumento.create({
        data: {
          nome,
          tipo,
          localizacao,
          responsavel
        }
      })

      return reply.status(201).send({
        message: 'Repositório de documentos criado com sucesso',
        data: repositorio
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async update(request: FastifyRequest<{ Params: RepositorioDocumentoParams; Body: Partial<RepositorioDocumentoBody> }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const updateData = { ...request.body }
      if (Object.keys(updateData).length === 0) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Nenhum campo fornecido para atualização'
        })
      }

      const repositorio = await (this.prisma as any).repositorioDocumento.update({
        where: { id },
        data: updateData
      })

      return reply.status(200).send({
        message: 'Repositório de documentos atualizado com sucesso',
        data: repositorio
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  async delete(request: FastifyRequest<{ Params: RepositorioDocumentoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      await (this.prisma as any).repositorioDocumento.delete({
        where: { id }
      })

      return reply.status(200).send({
        message: 'Repositório de documentos deletado com sucesso'
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para fazer upload de documento
  async uploadDocumento(request: FastifyRequest<{
    Params: { id: string };
    Body: { termoId: string; caminhoArquivo: string }
  }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const { termoId, caminhoArquivo } = request.body

      this.validateId(id)
      this.validateId(termoId)

      // Verificar se o repositório existe
      const repositorio = await (this.prisma as any).repositorioDocumento.findUnique({
        where: { id }
      })

      if (!repositorio) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Repositório não encontrado'
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

      // Criar o documento
      const documento = await (this.prisma as any).documentoRepositorio.create({
        data: {
          termoId,
          repositorioId: id,
          caminhoArquivo,
          dataUpload: new Date()
        },
        include: {
          termo: {
            select: {
              id: true,
              termo: true,
              definicao: true
            }
          },
          repositorio: {
            select: {
              id: true,
              nome: true,
              tipo: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Documento enviado com sucesso',
        data: documento
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }
}
