import type { FastifyInstance } from 'fastify'

// Importar todas as rotas Zod
import { usuarioZodFinalRoutes } from './usuario-zod-final.routes.js'
import { atribuicaoPapelDominioRoutes } from './atribuicao-papel-dominio-zod.routes.js'
import { auditoriaZodRoutes } from './auditoria-zod.routes.js'
import { bancoZodRoutes } from './banco-zod.routes.js'
import { colunaZodRoutes } from './coluna-zod.routes.js'
import { comiteAprovadorZodRoutes } from './comite-aprovador-zod.routes.js'
import { comunidadeZodRoutes } from './comunidade-zod.routes.js'
import { dashboardZodRoutes } from './dashboard-zod.routes.js'
import { definicaoZodFinalRoutes } from './definicao-zod-final.routes.js'
import { documentoPolimorficoRoutes } from './documento-polimorfico-zod.routes.js'
import { documentoRepositorioZodRoutes } from './documento-repositorio-zod.routes.js'
import { importacaoExportacaoZodRoutes } from './importacao-exportacao-zod.routes.js'
import { kpiZodFinalRoutes } from './kpi-zod-final.routes.js'
import { listaClassificacaoRoutes } from './lista-classificacao-zod.routes.js'
import { listaReferenciaZodRoutes } from './lista-referencia-zod.routes.js'
import { mfaZodRoutes } from './mfa-zod.routes.js'
import { necessidadeInformacaoZodRoutes } from './necessidade-informacao-zod.routes.js'
import { papelZodRoutes } from './papel-zod.routes.js'
import { classificacaoInformacaoZodRoutes } from './classificacao-informacao-zod.routes.js'
import { parteEnvolvidaZodRoutes } from './parte-envolvida-zod.routes.js'
import { politicaInternaZodRoutes } from './politica-interna-zod.routes.js'
import { processoZodFinalRoutes } from './processo-zod-final.routes.js'
import { produtoDadosRoutes } from './produto-dados-zod.routes.js'
import { regraNegocioZodRoutes } from './regra-negocio-zod.routes.js'
import { repositorioDocumentoZodRoutes } from './repositorio-documento-zod.routes.js'
import { sistemaZodRoutes } from './sistema-zod.routes.js'
import { tabelaZodRoutes } from './tabela-zod.routes.js'
import { tipoDadosZodRoutes } from './tipo-dados-zod.routes.js'
import { operacaoZodRoutes } from './operacao-zod.routes.js'
import { atividadeZodRoutes } from './atividade-zod.routes.js'
import { dimensaoQualidadeZodRoutes } from './dimensao-qualidade-zod.routes.js'
import { regraQualidadeZodRoutes } from './regra-qualidade-zod.routes.js'
import { regulacaoCompletaZodRoutes } from './regulacao-completa-zod.routes.js'
import { criticidadeRegulatoriaZodRoutes } from './criticidade-regulatoria-zod.routes.js'

// Rotas que ainda não foram convertidas para Zod

export async function registerAllRoutes(app: FastifyInstance) {
  try {


    // Rotas principais do sistema - seguindo especificação do prompt
    await app.register(usuarioZodFinalRoutes, { prefix: '/usuarios' })


    await app.register(sistemaZodRoutes, { prefix: '/sistemas' })


    await app.register(bancoZodRoutes, { prefix: '/bancos' })


    await app.register(tabelaZodRoutes, { prefix: '/tabelas' })


    await app.register(colunaZodRoutes, { prefix: '/colunas' })


    // Rotas de gestão de dados
    await app.register(comunidadeZodRoutes, { prefix: '/comunidades' })


    await app.register(politicaInternaZodRoutes, { prefix: '/politicas-internas' })


    await app.register(processoZodFinalRoutes, { prefix: '/processos' })


    await app.register(kpiZodFinalRoutes, { prefix: '/kpis' })


    await app.register(definicaoZodFinalRoutes, { prefix: '/definicoes' })


    // Rotas de governança
    await app.register(papelZodRoutes, { prefix: '/papeis' })

    await app.register(comiteAprovadorZodRoutes, { prefix: '/comites-aprovadores' })

    await app.register(necessidadeInformacaoZodRoutes, { prefix: '/necessidades-informacao' })

    await app.register(regraNegocioZodRoutes, { prefix: '/regras-negocio' })


    // Rotas de utilidades
    await app.register(dashboardZodRoutes, { prefix: '/dashboard' })


    await app.register(auditoriaZodRoutes, { prefix: '/auditoria' })


    await app.register(importacaoExportacaoZodRoutes, { prefix: '/importacao-exportacao' })


    // Rotas de segurança e autenticação
    await app.register(mfaZodRoutes, { prefix: '/mfa' })


    // Rotas adicionais
    await app.register(listaReferenciaZodRoutes, { prefix: '/listas-referencia' })

    await app.register(repositorioDocumentoZodRoutes, { prefix: '/repositorios-documento' })

    await app.register(produtoDadosRoutes, { prefix: '/produtos-dados' })

    await app.register(listaClassificacaoRoutes, { prefix: '/listas-classificacao' })

    await app.register(atribuicaoPapelDominioRoutes, { prefix: '/atribuicoes' })

    await app.register(documentoPolimorficoRoutes, { prefix: '/documentos' })

    await app.register(documentoRepositorioZodRoutes, { prefix: '/documentos-repositorio' })

    // Rotas com Zod moderno e middleware de autenticação
    await app.register(classificacaoInformacaoZodRoutes, { prefix: '/classificacoes-informacao' })

    await app.register(parteEnvolvidaZodRoutes, { prefix: '/partes-envolvidas' })

    await app.register(tipoDadosZodRoutes, { prefix: '/tipos-dados' })

    await app.register(operacaoZodRoutes, { prefix: '/operacoes' })

    await app.register(atividadeZodRoutes, { prefix: '/atividades' })

    await app.register(dimensaoQualidadeZodRoutes, { prefix: '/dimensoes-qualidade' })

    await app.register(regraQualidadeZodRoutes, { prefix: '/regras-qualidade' })

    await app.register(regulacaoCompletaZodRoutes, { prefix: '/regulacoes-completas' })

    await app.register(criticidadeRegulatoriaZodRoutes, { prefix: '/criticidades-regulatorias' })

  } catch (error) {
    // Erro ao registrar rotas - falha crítica na inicialização
    throw error
  }
}
