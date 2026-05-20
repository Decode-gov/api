/*
  Warnings:

  - You are about to drop the column `comite_aprovador_id` on the `papeis` table. All the data in the column will be lost.
  - You are about to drop the column `comunidade_id` on the `papeis` table. All the data in the column will be lost.
  - You are about to drop the column `documento_atribuicao` on the `papeis` table. All the data in the column will be lost.
  - You are about to drop the column `lista_papel_id` on the `papeis` table. All the data in the column will be lost.
  - You are about to drop the column `onboarding` on the `papeis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."papeis" DROP CONSTRAINT "papeis_comunidade_id_fkey";

-- DropIndex
DROP INDEX "public"."papeis_comunidade_id_idx";

-- AlterTable
ALTER TABLE "papeis" DROP COLUMN "comite_aprovador_id",
DROP COLUMN "comunidade_id",
DROP COLUMN "documento_atribuicao",
DROP COLUMN "lista_papel_id",
DROP COLUMN "onboarding",
ADD COLUMN     "comunidadeId" UUID;

-- AddForeignKey
ALTER TABLE "papeis" ADD CONSTRAINT "papeis_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "comunidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
