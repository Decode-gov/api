-- CreateTable
CREATE TABLE "arquivos" (
    "id" UUID NOT NULL,
    "nome_original" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "diretorio_arquivo" TEXT NOT NULL,
    "tipo_mime" TEXT NOT NULL,
    "tamanho_bytes" BIGINT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "usuario_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "arquivos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "arquivos_empresa_id_idx" ON "arquivos"("empresa_id");

-- CreateIndex
CREATE INDEX "arquivos_usuario_id_idx" ON "arquivos"("usuario_id");

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arquivos" ADD CONSTRAINT "arquivos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
