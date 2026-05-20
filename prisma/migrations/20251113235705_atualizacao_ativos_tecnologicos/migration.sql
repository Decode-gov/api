/*
  Warnings:

  - You are about to drop the column `descricao` on the `bancos` table. All the data in the column will be lost.
  - You are about to drop the column `tabela_id` on the `codificacoes` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `necessidade_info_id` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `politica_interna_id` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `questao_gerencial_id` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_dados_id` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `processo_id` on the `kpis` table. All the data in the column will be lost.
  - You are about to drop the column `sistema_id` on the `processos_atualizados` table. All the data in the column will be lost.
  - You are about to drop the column `necessidade_info_id` on the `tabelas` table. All the data in the column will be lost.
  - You are about to drop the column `questao_gerencial_id` on the `tabelas` table. All the data in the column will be lost.
  - You are about to drop the column `sistema_id` on the `tabelas` table. All the data in the column will be lost.
  - You are about to drop the `repositorios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repositorios_bancos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `politica_id` to the `regras_negocio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repositorio` to the `sistemas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."codificacoes" DROP CONSTRAINT "codificacoes_coluna_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."codificacoes" DROP CONSTRAINT "codificacoes_tabela_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_necessidade_info_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_politica_interna_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_questao_gerencial_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_tipo_dados_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."kpis" DROP CONSTRAINT "kpis_processo_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."processos_atualizados" DROP CONSTRAINT "processos_atualizados_sistema_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."repositorios_bancos" DROP CONSTRAINT "repositorios_bancos_banco_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."repositorios_bancos" DROP CONSTRAINT "repositorios_bancos_repositorio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_necessidade_info_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_questao_gerencial_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_sistema_id_fkey";

-- DropIndex
DROP INDEX "public"."codificacoes_tabela_id_idx";

-- DropIndex
DROP INDEX "public"."colunas_necessidade_info_id_idx";

-- DropIndex
DROP INDEX "public"."colunas_politica_interna_id_idx";

-- DropIndex
DROP INDEX "public"."colunas_questao_gerencial_id_idx";

-- DropIndex
DROP INDEX "public"."colunas_tipo_dados_id_idx";

-- DropIndex
DROP INDEX "public"."kpis_processo_id_idx";

-- DropIndex
DROP INDEX "public"."processos_atualizados_sistema_id_idx";

-- DropIndex
DROP INDEX "public"."tabelas_necessidade_info_id_idx";

-- DropIndex
DROP INDEX "public"."tabelas_questao_gerencial_id_idx";

-- DropIndex
DROP INDEX "public"."tabelas_sistema_id_idx";

-- DropIndex
DROP INDEX "public"."tabelas_termo_id_idx";

-- DropIndex
DROP INDEX "public"."uq_sistema_tabela";

-- AlterTable
ALTER TABLE "bancos" DROP COLUMN "descricao",
ADD COLUMN     "sistema_id" UUID;

-- AlterTable
ALTER TABLE "codificacoes" DROP COLUMN "tabela_id";

-- AlterTable
ALTER TABLE "colunas" DROP COLUMN "ativo",
DROP COLUMN "necessidade_info_id",
DROP COLUMN "politica_interna_id",
DROP COLUMN "questao_gerencial_id",
DROP COLUMN "tipo_dados_id",
ADD COLUMN     "necessidadeInformacaoId" UUID,
ADD COLUMN     "politicaInternaId" UUID;

-- AlterTable
ALTER TABLE "kpis" DROP COLUMN "processo_id";

-- AlterTable
ALTER TABLE "processos_atualizados" DROP COLUMN "sistema_id";

-- AlterTable
ALTER TABLE "regras_negocio" ADD COLUMN     "politica_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "sistemas" ADD COLUMN     "repositorio" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tabelas" DROP COLUMN "necessidade_info_id",
DROP COLUMN "questao_gerencial_id",
DROP COLUMN "sistema_id",
ADD COLUMN     "necessidadeInformacaoId" UUID;

-- DropTable
DROP TABLE "public"."repositorios";

-- DropTable
DROP TABLE "public"."repositorios_bancos";

-- CreateIndex
CREATE INDEX "colunas_necessidadeInformacaoId_idx" ON "colunas"("necessidadeInformacaoId");

-- AddForeignKey
ALTER TABLE "bancos" ADD CONSTRAINT "bancos_sistema_id_fkey" FOREIGN KEY ("sistema_id") REFERENCES "sistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_necessidadeInformacaoId_fkey" FOREIGN KEY ("necessidadeInformacaoId") REFERENCES "necessidades_informacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_necessidadeInformacaoId_fkey" FOREIGN KEY ("necessidadeInformacaoId") REFERENCES "necessidades_informacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_politicaInternaId_fkey" FOREIGN KEY ("politicaInternaId") REFERENCES "politicas_internas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_negocio" ADD CONSTRAINT "regras_negocio_politica_id_fkey" FOREIGN KEY ("politica_id") REFERENCES "politicas_internas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
