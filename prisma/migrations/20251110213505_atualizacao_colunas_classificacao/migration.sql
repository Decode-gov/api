/*
  Warnings:

  - You are about to drop the column `descricao` on the `classificacoes` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `classificacoes` table. All the data in the column will be lost.
  - Added the required column `classificacao_id` to the `classificacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termo_id` to the `classificacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classificacoes" DROP COLUMN "descricao",
DROP COLUMN "nome",
ADD COLUMN     "classificacao_id" UUID NOT NULL,
ADD COLUMN     "termo_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "classificacoes" ADD CONSTRAINT "classificacoes_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classificacoes" ADD CONSTRAINT "classificacoes_classificacao_id_fkey" FOREIGN KEY ("classificacao_id") REFERENCES "lista_classificacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
