import type { FastifyInstance } from 'fastify'
import { usuarioZodFinalRoutes } from './usuario-zod-final.routes.js'
import { colunaZodFinalRoutes } from './coluna-zod-final.routes.js'
import { kpiZodFinalRoutes } from './kpi-zod-final.routes.js'
import { processoZodFinalRoutes } from './processo-zod-final.routes.js'
import { definicaoZodFinalRoutes } from './definicao-zod-final.routes.js'
import { papelZodRoutes } from './papel-zod.routes.js'
import { necessidadeZodRoutes } from './necessidade-zod.routes.js'
import { regraNegocioZodRoutes } from './regra-negocio-zod.routes.js'
import { comunidadeRoutes } from './comunidade.routes.js'
import { politicaInternaRoutes } from './politica-interna.routes.js'
import { tabelaRoutes } from './tabela.routes.js'
import { sistemaRoutes } from './sistema.routes.js'
import { bancoRoutes } from './banco.routes.js'
import { classificacaoInformacaoRoutes } from './classificacao-informacao.routes.js'
import { repositorioDocumentoRoutes } from './repositorio-documento.routes.js'
import { dashboardRoutes } from './dashboard.routes.js'
import { mfaRoutes } from './mfa.routes.js'
import { auditoriaRoutes } from './auditoria.routes.js'
import { importacaoExportacaoRoutes } from './importacao-exportacao.routes.js'
import { listaReferenciaRoutes } from './lista-referencia.routes.js'
import { tipoDadosRoutes } from './tipo-dados.routes.js'

export async function registerAllRoutes(app: FastifyInstance) {

  await app.register(usuarioZodFinalRoutes, { prefix: '/usuarios' })
  await app.register(colunaZodFinalRoutes, { prefix: '/colunas' })
  await app.register(kpiZodFinalRoutes, { prefix: '/kpis' })
  await app.register(processoZodFinalRoutes, { prefix: '/processos' })
  await app.register(definicaoZodFinalRoutes, { prefix: '/definicoes' })
  await app.register(papelZodRoutes, { prefix: '/papeis' })
  await app.register(necessidadeZodRoutes, { prefix: '/necessidades-informacao' })
  await app.register(regraNegocioZodRoutes, { prefix: '/regras-negocio' })
  await app.register(comunidadeRoutes, { prefix: '/comunidades' })
  await app.register(tabelaRoutes, { prefix: '/tabelas' })
  await app.register(sistemaRoutes, { prefix: '/sistemas' })
  await app.register(bancoRoutes, { prefix: '/bancos' })
  await app.register(politicaInternaRoutes, { prefix: '/politicas-internas' })
  await app.register(tipoDadosRoutes, { prefix: '/tipos-dados' })
  await app.register(classificacaoInformacaoRoutes, { prefix: '/classificacoes-informacao' })
  await app.register(repositorioDocumentoRoutes, { prefix: '/repositorios-documento' })
  await app.register(dashboardRoutes, { prefix: '/dashboard' })
  await app.register(mfaRoutes, { prefix: '/mfa' })
  await app.register(auditoriaRoutes, { prefix: '/auditoria' })
  await app.register(importacaoExportacaoRoutes, { prefix: '/importacao-exportacao' })
  await app.register(listaReferenciaRoutes, { prefix: '/listas-referencia' })
}