/*
  Warnings:

  - You are about to drop the column `definicaoId` on the `tabelas` table. All the data in the column will be lost.
  - You are about to drop the column `necessidadeInformacaoId` on the `tabelas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_definicaoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tabelas" DROP CONSTRAINT "tabelas_necessidadeInformacaoId_fkey";

-- AlterTable
ALTER TABLE "tabelas" DROP COLUMN "definicaoId",
DROP COLUMN "necessidadeInformacaoId";
