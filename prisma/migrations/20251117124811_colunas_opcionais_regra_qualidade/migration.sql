-- DropForeignKey
ALTER TABLE "public"."regras_qualidade" DROP CONSTRAINT "regras_qualidade_coluna_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."regras_qualidade" DROP CONSTRAINT "regras_qualidade_tabela_id_fkey";

-- AlterTable
ALTER TABLE "regras_qualidade" ALTER COLUMN "tabela_id" DROP NOT NULL,
ALTER COLUMN "coluna_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "tabelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_coluna_id_fkey" FOREIGN KEY ("coluna_id") REFERENCES "colunas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
