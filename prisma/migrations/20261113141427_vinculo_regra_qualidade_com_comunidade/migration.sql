-- AlterTable
ALTER TABLE "regras_qualidade" ADD COLUMN     "dominio_id" UUID;

-- AddForeignKey
ALTER TABLE "regras_qualidade" ADD CONSTRAINT "regras_qualidade_dominio_id_fkey" FOREIGN KEY ("dominio_id") REFERENCES "comunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
