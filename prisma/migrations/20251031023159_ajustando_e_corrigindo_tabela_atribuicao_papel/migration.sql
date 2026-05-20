/*
  Warnings:

  - You are about to drop the column `data_inicio_vigencia` on the `atribuicoes_papel_dominio` table. All the data in the column will be lost.
  - You are about to drop the column `data_termino` on the `atribuicoes_papel_dominio` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `atribuicoes_papel_dominio` table. All the data in the column will be lost.
  - Added the required column `responsavel` to the `atribuicoes_papel_dominio` table without a default value. This is not possible if the table is not empty.
  - Made the column `documento_atribuicao` on table `atribuicoes_papel_dominio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comite_aprovador_id` on table `atribuicoes_papel_dominio` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."atribuicoes_papel_dominio_papel_id_dominio_id_key";

-- AlterTable
ALTER TABLE "atribuicoes_papel_dominio" DROP COLUMN "data_inicio_vigencia",
DROP COLUMN "data_termino",
DROP COLUMN "observacoes",
ADD COLUMN     "responsavel" TEXT NOT NULL,
ALTER COLUMN "documento_atribuicao" SET NOT NULL,
ALTER COLUMN "comite_aprovador_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "comites_aprovadores" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "comites_aprovadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "atribuicoes_papel_dominio_comite_aprovador_id_idx" ON "atribuicoes_papel_dominio"("comite_aprovador_id");

-- AddForeignKey
ALTER TABLE "atribuicoes_papel_dominio" ADD CONSTRAINT "atribuicoes_papel_dominio_comite_aprovador_id_fkey" FOREIGN KEY ("comite_aprovador_id") REFERENCES "comites_aprovadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
