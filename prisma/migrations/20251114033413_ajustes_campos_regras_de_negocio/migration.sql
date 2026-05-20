/*
  Warnings:

  - You are about to drop the column `processo_id` on the `regras_negocio` table. All the data in the column will be lost.
  - Added the required column `responsavel_id` to the `regras_negocio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termo_id` to the `regras_negocio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."regras_negocio" DROP CONSTRAINT "regras_negocio_processo_id_fkey";

-- DropIndex
DROP INDEX "public"."regras_negocio_processo_id_idx";

-- AlterTable
ALTER TABLE "regras_negocio" DROP COLUMN "processo_id",
ADD COLUMN     "responsavel_id" UUID NOT NULL,
ADD COLUMN     "sistema_id" UUID,
ADD COLUMN     "termo_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "regras_negocio" ADD CONSTRAINT "regras_negocio_sistema_id_fkey" FOREIGN KEY ("sistema_id") REFERENCES "sistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_negocio" ADD CONSTRAINT "regras_negocio_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "papeis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_negocio" ADD CONSTRAINT "regras_negocio_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
