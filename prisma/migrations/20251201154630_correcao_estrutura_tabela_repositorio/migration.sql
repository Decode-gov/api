/*
  Warnings:

  - You are about to drop the column `repositorio_id` on the `documentos_arquivo` table. All the data in the column will be lost.
  - You are about to drop the column `repositorio_id` on the `documentos_repositorio` table. All the data in the column will be lost.
  - You are about to drop the column `localizacao` on the `repositorios_documentos` table. All the data in the column will be lost.
  - You are about to drop the column `responsavel` on the `repositorios_documentos` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `repositorios_documentos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."documentos_arquivo" DROP CONSTRAINT "documentos_arquivo_repositorio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documentos_repositorio" DROP CONSTRAINT "documentos_repositorio_repositorio_id_fkey";

-- DropIndex
DROP INDEX "public"."documentos_arquivo_repositorio_id_idx";

-- DropIndex
DROP INDEX "public"."documentos_repositorio_repositorio_id_idx";

-- AlterTable
ALTER TABLE "documentos_arquivo" DROP COLUMN "repositorio_id";

-- AlterTable
ALTER TABLE "documentos_repositorio" DROP COLUMN "repositorio_id";

-- AlterTable
ALTER TABLE "repositorios_documentos" DROP COLUMN "localizacao",
DROP COLUMN "responsavel",
DROP COLUMN "tipo",
ADD COLUMN     "ged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rede" BOOLEAN NOT NULL DEFAULT false;
