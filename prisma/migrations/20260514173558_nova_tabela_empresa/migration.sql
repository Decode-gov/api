-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'USUARIO');

-- AlterTable
ALTER TABLE "atribuicoes_papel_dominio" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "bancos" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "classificacoes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "classificacoes_informacao" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "codificacoes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "colunas" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "comites_aprovadores" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "comunidades" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "criticidades" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "criticidades_regulatorias" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "definicoes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "dimensoes_qualidade" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "documentos" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "documentos_arquivo" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "documentos_polimorficos" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "documentos_repositorio" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "kpis" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "lista_classificacoes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "lista_dimensoes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "lista_partes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "listas_referencia" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "logs_auditoria" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "necessidades_informacao" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "papeis" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "partes_envolvidas" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "politicas_internas" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "processos" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "processos_atualizados" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "produtos_dados" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "qualidades" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "regras_negocio" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "regras_qualidade" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "regulacoes" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "regulacoes_completas" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "repositorios_documentos" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "sistemas" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "tabelas" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "termos_classificacao" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "tipos_dados" ADD COLUMN     "empresa_id" UUID;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "empresa_id" UUID,
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL DEFAULT 'USUARIO';

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "atribuicoes_papel_dominio_empresa_id_idx" ON "atribuicoes_papel_dominio"("empresa_id");

-- CreateIndex
CREATE INDEX "bancos_empresa_id_idx" ON "bancos"("empresa_id");

-- CreateIndex
CREATE INDEX "classificacoes_empresa_id_idx" ON "classificacoes"("empresa_id");

-- CreateIndex
CREATE INDEX "classificacoes_informacao_empresa_id_idx" ON "classificacoes_informacao"("empresa_id");

-- CreateIndex
CREATE INDEX "codificacoes_empresa_id_idx" ON "codificacoes"("empresa_id");

-- CreateIndex
CREATE INDEX "colunas_empresa_id_idx" ON "colunas"("empresa_id");

-- CreateIndex
CREATE INDEX "comites_aprovadores_empresa_id_idx" ON "comites_aprovadores"("empresa_id");

-- CreateIndex
CREATE INDEX "comunidades_empresa_id_idx" ON "comunidades"("empresa_id");

-- CreateIndex
CREATE INDEX "criticidades_empresa_id_idx" ON "criticidades"("empresa_id");

-- CreateIndex
CREATE INDEX "criticidades_regulatorias_empresa_id_idx" ON "criticidades_regulatorias"("empresa_id");

-- CreateIndex
CREATE INDEX "definicoes_empresa_id_idx" ON "definicoes"("empresa_id");

-- CreateIndex
CREATE INDEX "dimensoes_qualidade_empresa_id_idx" ON "dimensoes_qualidade"("empresa_id");

-- CreateIndex
CREATE INDEX "documentos_empresa_id_idx" ON "documentos"("empresa_id");

-- CreateIndex
CREATE INDEX "documentos_arquivo_empresa_id_idx" ON "documentos_arquivo"("empresa_id");

-- CreateIndex
CREATE INDEX "documentos_polimorficos_empresa_id_idx" ON "documentos_polimorficos"("empresa_id");

-- CreateIndex
CREATE INDEX "documentos_repositorio_empresa_id_idx" ON "documentos_repositorio"("empresa_id");

-- CreateIndex
CREATE INDEX "kpis_empresa_id_idx" ON "kpis"("empresa_id");

-- CreateIndex
CREATE INDEX "lista_classificacoes_empresa_id_idx" ON "lista_classificacoes"("empresa_id");

-- CreateIndex
CREATE INDEX "lista_dimensoes_empresa_id_idx" ON "lista_dimensoes"("empresa_id");

-- CreateIndex
CREATE INDEX "lista_partes_empresa_id_idx" ON "lista_partes"("empresa_id");

-- CreateIndex
CREATE INDEX "listas_referencia_empresa_id_idx" ON "listas_referencia"("empresa_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_empresa_id_idx" ON "logs_auditoria"("empresa_id");

-- CreateIndex
CREATE INDEX "necessidades_informacao_empresa_id_idx" ON "necessidades_informacao"("empresa_id");

-- CreateIndex
CREATE INDEX "papeis_empresa_id_idx" ON "papeis"("empresa_id");

-- CreateIndex
CREATE INDEX "partes_envolvidas_empresa_id_idx" ON "partes_envolvidas"("empresa_id");

-- CreateIndex
CREATE INDEX "politicas_internas_empresa_id_idx" ON "politicas_internas"("empresa_id");

-- CreateIndex
CREATE INDEX "processos_empresa_id_idx" ON "processos"("empresa_id");

-- CreateIndex
CREATE INDEX "processos_atualizados_empresa_id_idx" ON "processos_atualizados"("empresa_id");

-- CreateIndex
CREATE INDEX "produtos_dados_empresa_id_idx" ON "produtos_dados"("empresa_id");

-- CreateIndex
CREATE INDEX "qualidades_empresa_id_idx" ON "qualidades"("empresa_id");

-- CreateIndex
CREATE INDEX "regras_negocio_empresa_id_idx" ON "regras_negocio"("empresa_id");

-- CreateIndex
CREATE INDEX "regras_qualidade_empresa_id_idx" ON "regras_qualidade"("empresa_id");

-- CreateIndex
CREATE INDEX "regulacoes_empresa_id_idx" ON "regulacoes"("empresa_id");

-- CreateIndex
CREATE INDEX "regulacoes_completas_empresa_id_idx" ON "regulacoes_completas"("empresa_id");

-- CreateIndex
CREATE INDEX "repositorios_documentos_empresa_id_idx" ON "repositorios_documentos"("empresa_id");

-- CreateIndex
CREATE INDEX "sistemas_empresa_id_idx" ON "sistemas"("empresa_id");

-- CreateIndex
CREATE INDEX "tabelas_empresa_id_idx" ON "tabelas"("empresa_id");

-- CreateIndex
CREATE INDEX "termos_classificacao_empresa_id_idx" ON "termos_classificacao"("empresa_id");

-- CreateIndex
CREATE INDEX "tipos_dados_empresa_id_idx" ON "tipos_dados"("empresa_id");

-- CreateIndex
CREATE INDEX "usuarios_empresa_id_idx" ON "usuarios"("empresa_id");

-- AddForeignKey
ALTER TABLE "comunidades" ADD CONSTRAINT "comunidades_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas_internas" ADD CONSTRAINT "politicas_internas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "necessidades_informacao" ADD CONSTRAINT "necessidades_informacao_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "definicoes" ADD CONSTRAINT "definicoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_classificacoes" ADD CONSTRAINT "lista_classificacoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classificacoes" ADD CONSTRAINT "classificacoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sistemas" ADD CONSTRAINT "sistemas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bancos" ADD CONSTRAINT "bancos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codificacoes" ADD CONSTRAINT "codificacoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_polimorficos" ADD CONSTRAINT "documentos_polimorficos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_negocio" ADD CONSTRAINT "regras_negocio_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_dimensoes" ADD CONSTRAINT "lista_dimensoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qualidades" ADD CONSTRAINT "qualidades_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_partes" ADD CONSTRAINT "lista_partes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulacoes" ADD CONSTRAINT "regulacoes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criticidades" ADD CONSTRAINT "criticidades_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papeis" ADD CONSTRAINT "papeis_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos_dados" ADD CONSTRAINT "produtos_dados_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comites_aprovadores" ADD CONSTRAINT "comites_aprovadores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atribuicoes_papel_dominio" ADD CONSTRAINT "atribuicoes_papel_dominio_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_dados" ADD CONSTRAINT "tipos_dados_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classificacoes_informacao" ADD CONSTRAINT "classificacoes_informacao_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "termos_classificacao" ADD CONSTRAINT "termos_classificacao_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositorios_documentos" ADD CONSTRAINT "repositorios_documentos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listas_referencia" ADD CONSTRAINT "listas_referencia_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_arquivo" ADD CONSTRAINT "documentos_arquivo_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_repositorio" ADD CONSTRAINT "documentos_repositorio_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dimensoes_qualidade" ADD CONSTRAINT "dimensoes_qualidade_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partes_envolvidas" ADD CONSTRAINT "partes_envolvidas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulacoes_completas" ADD CONSTRAINT "regulacoes_completas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criticidades_regulatorias" ADD CONSTRAINT "criticidades_regulatorias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos_atualizados" ADD CONSTRAINT "processos_atualizados_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
