/*
  Warnings:

  - You are about to drop the column `tipoEntidade` on the `atribuicoes_papel_dominio` table. All the data in the column will be lost.
  - You are about to drop the column `caminho_arquivo` on the `documentos_repositorio` table. All the data in the column will be lost.
  - You are about to drop the column `data_upload` on the `documentos_repositorio` table. All the data in the column will be lost.
  - You are about to drop the `documentos_tabela` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."documentos_tabela" DROP CONSTRAINT "documentos_tabela_repositorio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documentos_tabela" DROP CONSTRAINT "documentos_tabela_tabela_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documentos_tabela" DROP CONSTRAINT "documentos_tabela_termo_id_fkey";

-- DropIndex
DROP INDEX "public"."atribuicoes_papel_dominio_tipoEntidade_idx";

-- AlterTable
ALTER TABLE "atribuicoes_papel_dominio" DROP COLUMN "tipoEntidade";

-- AlterTable
ALTER TABLE "documentos_repositorio" DROP COLUMN "caminho_arquivo",
DROP COLUMN "data_upload";

-- DropTable
DROP TABLE "public"."documentos_tabela";

-- CreateTable
CREATE TABLE "documentos_arquivo" (
    "id" UUID NOT NULL,
    "termo_id" UUID NOT NULL,
    "repositorio_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "documentos_arquivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documentos_arquivo_termo_id_idx" ON "documentos_arquivo"("termo_id");

-- CreateIndex
CREATE INDEX "documentos_arquivo_repositorio_id_idx" ON "documentos_arquivo"("repositorio_id");

-- AddForeignKey
ALTER TABLE "documentos_arquivo" ADD CONSTRAINT "documentos_arquivo_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_arquivo" ADD CONSTRAINT "documentos_arquivo_repositorio_id_fkey" FOREIGN KEY ("repositorio_id") REFERENCES "repositorios_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
