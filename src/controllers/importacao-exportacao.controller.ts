import type { FastifyRequest, FastifyReply } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { BaseController } from './base.controller.js'

interface ImportacaoParams {
  id: string
}

interface ImportacaoBody {
  arquivo: string // Base64 ou caminho do arquivo
  tipoEntidade: string
  sobrescrever?: boolean
  usuarioId: string
}

interface ExportacaoQuery {
  tipoEntidade?: string
  formato?: 'json' | 'csv' | 'excel'
  filtros?: string
}

export class ImportacaoExportacaoController extends BaseController {
  constructor(prisma: PrismaClient) {
    super(prisma, 'importacaoExportacao')
  }

  // Método para exportar dados
  async exportar(request: FastifyRequest<{ Querystring: ExportacaoQuery }>, reply: FastifyReply) {
    try {
      const { tipoEntidade, formato = 'json', filtros } = request.query

      if (!tipoEntidade) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Tipo de entidade é obrigatório'
        })
      }

      // Validar se a entidade existe no Prisma
      const entidadesValidas = [
        'usuario', 'sistema', 'processo', 'comunidade',
        'politica', 'tabela', 'coluna', 'termo',
        'tipoDados', 'classificacaoInformacao',
        'repositorioDocumento', 'dimensaoQualidade', 'regraQualidade',
        'parteEnvolvida', 'regulacaoCompleta', 'criticidadeRegulatoria'
      ]

      if (!entidadesValidas.includes(tipoEntidade)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Tipo de entidade inválido. Entidades válidas: ${entidadesValidas.join(', ')}`
        })
      }

      // Construir filtros se fornecidos
      let where = {}
      if (filtros) {
        try {
          where = JSON.parse(filtros)
        } catch (error) {
          return reply.status(400).send({
            error: 'BadRequest',
            message: 'Filtros devem estar em formato JSON válido'
          })
        }
      }

      // Buscar dados
      const dados = await (this.prisma as any)[tipoEntidade].findMany({
        where,
        include: this.getIncludeForEntity(tipoEntidade)
      })

      // Preparar resposta baseada no formato
      let dadosFormatados: any
      let contentType: string
      let filename: string

      switch (formato) {
        case 'csv':
          dadosFormatados = this.convertToCSV(dados)
          contentType = 'text/csv'
          filename = `${tipoEntidade}_${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'excel':
          // Para Excel, vamos usar JSON por simplicidade (seria necessário biblioteca específica)
          dadosFormatados = JSON.stringify(dados, null, 2)
          contentType = 'application/json'
          filename = `${tipoEntidade}_${new Date().toISOString().split('T')[0]}.json`
          break
        default: // json
          dadosFormatados = JSON.stringify(dados, null, 2)
          contentType = 'application/json'
          filename = `${tipoEntidade}_${new Date().toISOString().split('T')[0]}.json`
      }

      // Registrar log de auditoria para exportação
      const logAuditoria = await (this.prisma as any).logAuditoria.create({
        data: {
          entidade: 'ExportacaoDados',
          entidadeId: `export_${tipoEntidade}_${Date.now()}`,
          operacao: 'CREATE',
          dadosDepois: JSON.stringify({
            tipoEntidade,
            formato,
            totalRegistros: dados.length,
            filtros: where
          }),
          usuarioId: request.headers['user-id'] as string || 'sistema'
        }
      })

      return reply
        .header('Content-Type', contentType)
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .status(200)
        .send({
          message: 'Dados exportados com sucesso',
          data: {
            tipoEntidade,
            formato,
            totalRegistros: dados.length,
            arquivo: dadosFormatados,
            logId: logAuditoria.id
          }
        })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para importar dados
  async importar(request: FastifyRequest<{ Body: ImportacaoBody }>, reply: FastifyReply) {
    try {
      const { arquivo, tipoEntidade, sobrescrever = false, usuarioId } = request.body

      // Validar dados obrigatórios
      if (!arquivo || !tipoEntidade || !usuarioId) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Arquivo, tipo de entidade e usuário são obrigatórios'
        })
      }

      // Validar se o usuário existe
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: usuarioId }
      })

      if (!usuario) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Usuário não encontrado'
        })
      }

      // Validar entidade
      const entidadesValidas = [
        'usuario', 'sistema', 'processo', 'comunidade',
        'politica', 'tabela', 'coluna', 'termo',
        'tipoDados', 'classificacaoInformacao',
        'repositorioDocumento', 'dimensaoQualidade', 'regraQualidade',
        'parteEnvolvida', 'regulacaoCompleta', 'criticidadeRegulatoria'
      ]

      if (!entidadesValidas.includes(tipoEntidade)) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: `Tipo de entidade inválido. Entidades válidas: ${entidadesValidas.join(', ')}`
        })
      }

      // Parse do arquivo (assumindo JSON)
      let dadosImportacao: any[]
      try {
        dadosImportacao = JSON.parse(arquivo)
        if (!Array.isArray(dadosImportacao)) {
          throw new Error('Dados devem ser um array')
        }
      } catch (error) {
        return reply.status(400).send({
          error: 'BadRequest',
          message: 'Arquivo deve conter um JSON válido com array de objetos'
        })
      }

      // Criar registro de importação
      const importacao = await (this.prisma as any).importacaoExportacao.create({
        data: {
          tipo: 'IMPORTACAO',
          entidade: tipoEntidade,
          arquivo: `import_${tipoEntidade}_${Date.now()}.json`,
          status: 'PROCESSANDO',
          totalRegistros: dadosImportacao.length,
          usuarioId
        }
      })

      let registrosProcessados = 0
      let registrosComErro = 0
      const erros: any[] = []

      // Processar importação
      for (const [index, item] of dadosImportacao.entries()) {
        try {
          // Remover campos de sistema
          const { id, createdAt, updatedAt, ...dadosLimpos } = item

          // Validar campos obrigatórios específicos da entidade
          if (!this.validarCamposObrigatorios(tipoEntidade, dadosLimpos)) {
            throw new Error('Campos obrigatórios faltando')
          }

          // Se não sobrescrever e registro existe, pular
          if (!sobrescrever && id) {
            const existe = await (this.prisma as any)[tipoEntidade].findUnique({
              where: { id }
            })
            if (existe) {
              erros.push({
                linha: index + 1,
                erro: 'Registro já existe e sobrescrever=false'
              })
              registrosComErro++
              continue
            }
          }

          // Criar ou atualizar registro
          if (sobrescrever && id) {
            await (this.prisma as any)[tipoEntidade].upsert({
              where: { id },
              update: dadosLimpos,
              create: dadosLimpos
            })
          } else {
            await (this.prisma as any)[tipoEntidade].create({
              data: dadosLimpos
            })
          }

          registrosProcessados++
        } catch (error: any) {
          registrosComErro++
          erros.push({
            linha: index + 1,
            erro: error.message
          })
        }
      }

      // Atualizar registro de importação
      const importacaoFinalizada = await (this.prisma as any).importacaoExportacao.update({
        where: { id: importacao.id },
        data: {
          status: registrosComErro > 0 ? 'CONCLUIDO_COM_ERROS' : 'CONCLUIDO',
          registrosProcessados,
          registrosComErro,
          erros: JSON.stringify(erros),
          dataFinalizacao: new Date()
        }
      })

      // Criar log de auditoria
      await (this.prisma as any).logAuditoria.create({
        data: {
          entidade: 'ImportacaoDados',
          entidadeId: importacao.id,
          operacao: 'CREATE',
          dadosDepois: JSON.stringify({
            tipoEntidade,
            totalRegistros: dadosImportacao.length,
            registrosProcessados,
            registrosComErro,
            sobrescrever
          }),
          usuarioId
        }
      })

      return reply.status(200).send({
        message: 'Importação processada',
        data: {
          importacaoId: importacao.id,
          status: importacaoFinalizada.status,
          totalRegistros: dadosImportacao.length,
          registrosProcessados,
          registrosComErro,
          erros: erros.slice(0, 10) // Retornar apenas os primeiros 10 erros
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para listar importações/exportações
  async findMany(request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) {
    try {
      const query = request.query as any
      const { skip = 0, take = 10, tipo, status, usuarioId } = query

      this.validatePagination({ skip, take })

      const where: any = {}
      if (tipo) where.tipo = tipo
      if (status) where.status = status
      if (usuarioId) where.usuarioId = usuarioId

      const operacoes = await (this.prisma as any).importacaoExportacao.findMany({
        skip,
        take,
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const total = await (this.prisma as any).importacaoExportacao.count({ where })

      return reply.status(200).send({
        message: 'Operações de importação/exportação encontradas',
        data: operacoes,
        pagination: {
          total,
          skip,
          take,
          pages: Math.ceil(total / take)
        }
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Método para obter detalhes de uma importação/exportação
  async findById(request: FastifyRequest<{ Params: ImportacaoParams }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      this.validateId(id)

      const operacao = await (this.prisma as any).importacaoExportacao.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      })

      if (!operacao) {
        return reply.status(404).send({
          error: 'NotFound',
          message: 'Operação não encontrada'
        })
      }

      // Parse dos erros se existirem
      const operacaoFormatada = {
        ...operacao,
        erros: operacao.erros ? JSON.parse(operacao.erros) : []
      }

      return reply.status(200).send({
        message: 'Operação encontrada',
        data: operacaoFormatada
      })
    } catch (error) {
      this.handleError(reply, error)
    }
  }

  // Métodos auxiliares
  private getIncludeForEntity(tipoEntidade: string): any {
    const includes: { [key: string]: any } = {
      tabela: { include: { sistema: true, processo: true, colunas: true } },
      coluna: { include: { tabela: true, tipoDados: true } },
      usuario: { include: { sistemas: true, processos: true } },
      // Adicionar outros includes conforme necessário
    }

    return includes[tipoEntidade] || {}
  }

  private convertToCSV(dados: any[]): string {
    if (dados.length === 0) return ''

    const headers = Object.keys(dados[0])
    const csvHeaders = headers.join(',')

    const csvRows = dados.map(item => {
      return headers.map(header => {
        const value = item[header]
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }
        return `"${String(value || '').replace(/"/g, '""')}"`
      }).join(',')
    })

    return [csvHeaders, ...csvRows].join('\n')
  }

  private validarCamposObrigatorios(tipoEntidade: string, dados: any): boolean {
    const camposObrigatorios: { [key: string]: string[] } = {
      usuario: ['nome', 'email'],
      sistema: ['nome'],
      processo: ['nome'],
      tabela: ['nome', 'sistemaId'],
      coluna: ['nome', 'tabelaId'],
      // Adicionar outros campos obrigatórios conforme necessário
    }

    const campos = camposObrigatorios[tipoEntidade] || []
    return campos.every(campo => dados[campo] !== undefined && dados[campo] !== null && dados[campo] !== '')
  }

  // Métodos herdados que não se aplicam
  async create(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Use os endpoints específicos /importar ou /exportar'
    })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Operações de importação/exportação não podem ser alteradas'
    })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(405).send({
      error: 'MethodNotAllowed',
      message: 'Operações de importação/exportação não podem ser deletadas'
    })
  }
}
