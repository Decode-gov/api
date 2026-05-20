/*
  Warnings:

  - You are about to drop the `bancos_dados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."bancos_dados" DROP CONSTRAINT "bancos_dados_sistema_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."repositorios_bancos" DROP CONSTRAINT "repositorios_bancos_banco_id_fkey";

-- DropTable
DROP TABLE "public"."bancos_dados";

-- AddForeignKey
ALTER TABLE "public"."repositorios_bancos" ADD CONSTRAINT "repositorios_bancos_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "public"."bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
