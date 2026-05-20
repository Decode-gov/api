-- AlterTable
ALTER TABLE "definicoes" ADD COLUMN     "comunidade_id" UUID;

-- AddForeignKey
ALTER TABLE "definicoes" ADD CONSTRAINT "definicoes_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
