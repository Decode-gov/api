/*
  Warnings:

  - You are about to drop the column `comunidade_id` on the `definicoes` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `lista_classificacoes` table. All the data in the column will be lost.
  - Added the required column `classificacao` to the `lista_classificacoes` table without a default value. This is not possible if the table is not empty.
  - Made the column `descricao` on table `lista_classificacoes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."definicoes" DROP CONSTRAINT "definicoes_comunidade_id_fkey";

-- AlterTable
ALTER TABLE "definicoes" DROP COLUMN "comunidade_id";

-- AlterTable
ALTER TABLE "lista_classificacoes" DROP COLUMN "nome",
ADD COLUMN     "classificacao" TEXT NOT NULL,
ALTER COLUMN "descricao" SET NOT NULL;
