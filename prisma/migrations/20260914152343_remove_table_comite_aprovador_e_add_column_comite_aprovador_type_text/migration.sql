/*
  Warnings:

  - You are about to drop the column `comite_aprovador_id` on the `atribuicoes_papel_dominio` table. All the data in the column will be lost.
  - You are about to drop the `comites_aprovadores` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comite_aprovador` to the `atribuicoes_papel_dominio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."atribuicoes_papel_dominio" DROP CONSTRAINT "atribuicoes_papel_dominio_comite_aprovador_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."comites_aprovadores" DROP CONSTRAINT "comites_aprovadores_empresa_id_fkey";

-- DropIndex
DROP INDEX "public"."atribuicoes_papel_dominio_comite_aprovador_id_idx";

-- AlterTable
ALTER TABLE "atribuicoes_papel_dominio" DROP COLUMN "comite_aprovador_id",
ADD COLUMN     "comite_aprovador" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."comites_aprovadores";
