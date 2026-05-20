/*
  Warnings:

  - Made the column `tabela_id` on table `regras_qualidade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coluna_id` on table `regras_qualidade` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."regras_qualidade" DROP CONSTRAINT "regras_qualidade_coluna_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."regras_qualidade" DROP CONSTRAINT "regras_qualidade_responsavel_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."regras_qualidade" DROP CONSTRAINT "regras_qualidade_tabela_id_fkey";

-- AlterTable
ALTER TABLE "regras_qualidade" ADD COLUMN     "regra_negocio_id" UUID,
ALTER COLUMN "tabela_id" SET NOT NULL,
ALTER COLUMN "coluna_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_regra_negocio_id_fkey" FOREIGN KEY ("regra_negocio_id") REFERENCES "regras_negocio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "tabelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_coluna_id_fkey" FOREIGN KEY ("coluna_id") REFERENCES "colunas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "papeis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
