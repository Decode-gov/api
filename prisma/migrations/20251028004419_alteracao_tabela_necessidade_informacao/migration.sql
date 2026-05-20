/*
  Warnings:

  - You are about to drop the column `comunidade_id` on the `necessidades_informacao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."necessidades_informacao" DROP CONSTRAINT "necessidades_informacao_comunidade_id_fkey";

-- DropIndex
DROP INDEX "public"."necessidades_informacao_comunidade_id_idx";

-- AlterTable
ALTER TABLE "necessidades_informacao" DROP COLUMN "comunidade_id";
