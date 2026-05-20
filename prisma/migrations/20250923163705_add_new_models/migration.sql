-- CreateEnum
CREATE TYPE "public"."EscopoPolitica" AS ENUM ('Seguranca', 'Qualidade', 'Governanca', 'Outro');

-- CreateEnum
CREATE TYPE "public"."CategoriaSeguranca" AS ENUM ('Publico', 'Interno', 'Confidencial', 'Restrito');

-- CreateEnum
CREATE TYPE "public"."PeriodicidadeKPI" AS ENUM ('Diario', 'Semanal', 'Mensal', 'Trimestral', 'Anual');

-- CreateEnum
CREATE TYPE "public"."TipoEntidadeDocumento" AS ENUM ('Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna');

-- CreateTable
CREATE TABLE "public"."documentos_polimorficos" (
    "id" UUID NOT NULL,
    "entidade_id" UUID NOT NULL,
    "tipo_entidade" "public"."TipoEntidadeDocumento" NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "tamanho_bytes" BIGINT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "descricao" TEXT,
    "metadados" TEXT,
    "checksum" TEXT,
    "versao" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "documentos_polimorficos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."atribuicoes_papel_dominio" (
    "id" UUID NOT NULL,
    "papel_id" UUID NOT NULL,
    "dominio_id" UUID NOT NULL,
    "tipoEntidade" "public"."TipoEntidadeDocumento" NOT NULL,
    "documento_atribuicao" TEXT,
    "comite_aprovador_id" UUID,
    "onboarding" BOOLEAN NOT NULL DEFAULT false,
    "data_inicio_vigencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_termino" TIMESTAMP(3),
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "atribuicoes_papel_dominio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documentos_polimorficos_entidade_id_idx" ON "public"."documentos_polimorficos"("entidade_id");

-- CreateIndex
CREATE INDEX "documentos_polimorficos_tipo_entidade_idx" ON "public"."documentos_polimorficos"("tipo_entidade");

-- CreateIndex
CREATE INDEX "documentos_polimorficos_ativo_idx" ON "public"."documentos_polimorficos"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "documentos_polimorficos_entidade_id_tipo_entidade_nome_arqu_key" ON "public"."documentos_polimorficos"("entidade_id", "tipo_entidade", "nome_arquivo", "versao");

-- CreateIndex
CREATE INDEX "atribuicoes_papel_dominio_papel_id_idx" ON "public"."atribuicoes_papel_dominio"("papel_id");

-- CreateIndex
CREATE INDEX "atribuicoes_papel_dominio_dominio_id_idx" ON "public"."atribuicoes_papel_dominio"("dominio_id");

-- CreateIndex
CREATE INDEX "atribuicoes_papel_dominio_tipoEntidade_idx" ON "public"."atribuicoes_papel_dominio"("tipoEntidade");

-- CreateIndex
CREATE UNIQUE INDEX "atribuicoes_papel_dominio_papel_id_dominio_id_key" ON "public"."atribuicoes_papel_dominio"("papel_id", "dominio_id");

-- AddForeignKey
ALTER TABLE "public"."atribuicoes_papel_dominio" ADD CONSTRAINT "atribuicoes_papel_dominio_papel_id_fkey" FOREIGN KEY ("papel_id") REFERENCES "public"."papeis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."atribuicoes_papel_dominio" ADD CONSTRAINT "atribuicoes_papel_dominio_dominio_id_fkey" FOREIGN KEY ("dominio_id") REFERENCES "public"."comunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
