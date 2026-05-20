/*
  Warnings:

  - A unique constraint covering the columns `[termo]` on the table `definicoes` will be added. If there are existing duplicate values, this will fail.
  - Made the column `questao_gerencial_id` on table `colunas` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `comunidade_id` to the `necessidades_informacao` table without a default value. This is not possible if the table is not empty.
  - Made the column `questao_gerencial_id` on table `tabelas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_questao_gerencial_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_questao_gerencial_id_fkey";

-- AlterTable
ALTER TABLE "public"."colunas" ALTER COLUMN "questao_gerencial_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."definicoes" ADD COLUMN     "sigla" TEXT;

-- AlterTable
ALTER TABLE "public"."necessidades_informacao" ADD COLUMN     "comunidade_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."tabelas" ALTER COLUMN "questao_gerencial_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "definicoes_termo_key" ON "public"."definicoes"("termo");

-- CreateIndex
CREATE INDEX "necessidades_informacao_comunidade_id_idx" ON "public"."necessidades_informacao"("comunidade_id");

-- AddForeignKey
ALTER TABLE "public"."necessidades_informacao" ADD CONSTRAINT "necessidades_informacao_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "public"."comunidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tabelas" ADD CONSTRAINT "tabelas_questao_gerencial_id_fkey" FOREIGN KEY ("questao_gerencial_id") REFERENCES "public"."necessidades_informacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."colunas" ADD CONSTRAINT "colunas_questao_gerencial_id_fkey" FOREIGN KEY ("questao_gerencial_id") REFERENCES "public"."necessidades_informacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
