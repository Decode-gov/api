/*
  Warnings:

  - Made the column `necessidadeInformacaoId` on table `colunas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_necessidadeInformacaoId_fkey";

-- AlterTable
ALTER TABLE "colunas" ALTER COLUMN "necessidadeInformacaoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_necessidadeInformacaoId_fkey" FOREIGN KEY ("necessidadeInformacaoId") REFERENCES "necessidades_informacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
