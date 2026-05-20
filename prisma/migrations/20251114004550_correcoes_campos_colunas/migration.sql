/*
  Warnings:

  - You are about to drop the column `obrigatorio` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `politicaInternaId` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `unicidade` on the `colunas` table. All the data in the column will be lost.
  - You are about to drop the column `termo_id` on the `tabelas` table. All the data in the column will be lost.
  - Added the required column `termo_id` to the `colunas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."colunas" DROP CONSTRAINT "colunas_politicaInternaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_termo_id_fkey";

-- AlterTable
ALTER TABLE "colunas" DROP COLUMN "obrigatorio",
DROP COLUMN "politicaInternaId",
DROP COLUMN "unicidade",
ADD COLUMN     "termo_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tabelas" DROP COLUMN "termo_id",
ADD COLUMN     "definicaoId" UUID;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_definicaoId_fkey" FOREIGN KEY ("definicaoId") REFERENCES "definicoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
