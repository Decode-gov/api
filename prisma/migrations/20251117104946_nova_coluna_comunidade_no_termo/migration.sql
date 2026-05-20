-- AlterTable
ALTER TABLE "definicoes" ADD COLUMN     "comunidadeId" UUID;

-- AddForeignKey
ALTER TABLE "definicoes" ADD CONSTRAINT "definicoes_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "comunidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
