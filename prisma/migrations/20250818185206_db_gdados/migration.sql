-- CreateEnum
CREATE TYPE "StatusPolitica" AS ENUM ('Em_elaboracao', 'Vigente', 'Revogada');

-- CreateTable
CREATE TABLE "comunidades" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "comunidade_id" UUID,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "comunidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "politicas_internas" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "escopo" TEXT NOT NULL,
    "dominio_dados_id" UUID,
    "responsavel" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL,
    "data_inicio_vigencia" TIMESTAMP(3) NOT NULL,
    "data_termino" TIMESTAMP(3),
    "status" "StatusPolitica" NOT NULL,
    "versao" TEXT NOT NULL,
    "anexos_url" TEXT,
    "relacionamento" TEXT,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "politicas_internas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "necessidades_informacao" (
    "id" UUID NOT NULL,
    "questao_gerencial" TEXT NOT NULL,
    "elemento_estrategico" TEXT,
    "elemento_tatico" TEXT,
    "origem_questao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "necessidades_informacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "definicoes" (
    "id" UUID NOT NULL,
    "termo" TEXT NOT NULL,
    "definicao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "definicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_classificacoes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "politica_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lista_classificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classificacoes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "classificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sistemas" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sistemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repositorios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "ged" BOOLEAN,
    "drive" BOOLEAN,
    "descricao" TEXT,
    "url_documentos" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "repositorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tabelas" (
    "id" UUID NOT NULL,
    "tabela" TEXT NOT NULL,
    "banco_id" UUID,
    "sistema_id" UUID,
    "termo_id" UUID,
    "necessidade_info_id" UUID,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tabelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colunas" (
    "id" UUID NOT NULL,
    "coluna" TEXT NOT NULL,
    "tabela_id" UUID NOT NULL,
    "necessidade_info_id" UUID,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "colunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codificacoes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "tabela_id" UUID,
    "coluna_id" UUID,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "codificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processos" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "processos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regras_negocio" (
    "id" UUID NOT NULL,
    "processo_id" UUID NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "regras_negocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_dimensoes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "politica_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lista_dimensoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualidades" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "qualidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lista_partes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lista_partes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulacoes" (
    "id" UUID NOT NULL,
    "norma" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "regulacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criticidades" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "epigrafe_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "criticidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papeis" (
    "id" UUID NOT NULL,
    "lista_papel_id" UUID NOT NULL,
    "comunidade_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "politica_id" UUID NOT NULL,
    "documento_atribuicao" TEXT,
    "comite_aprovador_id" UUID,
    "onboarding" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "papeis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "comunidade_id" UUID,
    "processo_id" UUID,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos_dados" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "periodicidade" TEXT,
    "formato" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "produtos_dados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comunidades_comunidade_id_idx" ON "comunidades"("comunidade_id");

-- CreateIndex
CREATE INDEX "politicas_internas_dominio_dados_id_idx" ON "politicas_internas"("dominio_dados_id");

-- CreateIndex
CREATE INDEX "lista_classificacoes_politica_id_idx" ON "lista_classificacoes"("politica_id");

-- CreateIndex
CREATE INDEX "tabelas_termo_id_idx" ON "tabelas"("termo_id");

-- CreateIndex
CREATE INDEX "tabelas_necessidade_info_id_idx" ON "tabelas"("necessidade_info_id");

-- CreateIndex
CREATE INDEX "tabelas_banco_id_idx" ON "tabelas"("banco_id");

-- CreateIndex
CREATE INDEX "tabelas_sistema_id_idx" ON "tabelas"("sistema_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_banco_tabela" ON "tabelas"("banco_id", "tabela");

-- CreateIndex
CREATE UNIQUE INDEX "uq_sistema_tabela" ON "tabelas"("sistema_id", "tabela");

-- CreateIndex
CREATE INDEX "colunas_tabela_id_idx" ON "colunas"("tabela_id");

-- CreateIndex
CREATE INDEX "colunas_necessidade_info_id_idx" ON "colunas"("necessidade_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_tabela_coluna" ON "colunas"("tabela_id", "coluna");

-- CreateIndex
CREATE INDEX "codificacoes_tabela_id_idx" ON "codificacoes"("tabela_id");

-- CreateIndex
CREATE INDEX "codificacoes_coluna_id_idx" ON "codificacoes"("coluna_id");

-- CreateIndex
CREATE INDEX "regras_negocio_processo_id_idx" ON "regras_negocio"("processo_id");

-- CreateIndex
CREATE INDEX "lista_dimensoes_politica_id_idx" ON "lista_dimensoes"("politica_id");

-- CreateIndex
CREATE INDEX "criticidades_epigrafe_id_idx" ON "criticidades"("epigrafe_id");

-- CreateIndex
CREATE INDEX "papeis_comunidade_id_idx" ON "papeis"("comunidade_id");

-- CreateIndex
CREATE INDEX "papeis_politica_id_idx" ON "papeis"("politica_id");

-- CreateIndex
CREATE INDEX "kpis_comunidade_id_idx" ON "kpis"("comunidade_id");

-- CreateIndex
CREATE INDEX "kpis_processo_id_idx" ON "kpis"("processo_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "comunidades" ADD CONSTRAINT "comunidades_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "politicas_internas" ADD CONSTRAINT "politicas_internas_dominio_dados_id_fkey" FOREIGN KEY ("dominio_dados_id") REFERENCES "comunidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_classificacoes" ADD CONSTRAINT "lista_classificacoes_politica_id_fkey" FOREIGN KEY ("politica_id") REFERENCES "politicas_internas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_sistema_id_fkey" FOREIGN KEY ("sistema_id") REFERENCES "sistemas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "definicoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tabelas" ADD CONSTRAINT "tabelas_necessidade_info_id_fkey" FOREIGN KEY ("necessidade_info_id") REFERENCES "necessidades_informacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "tabelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_necessidade_info_id_fkey" FOREIGN KEY ("necessidade_info_id") REFERENCES "necessidades_informacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codificacoes" ADD CONSTRAINT "codificacoes_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "tabelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codificacoes" ADD CONSTRAINT "codificacoes_coluna_id_fkey" FOREIGN KEY ("coluna_id") REFERENCES "colunas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regras_negocio" ADD CONSTRAINT "regras_negocio_processo_id_fkey" FOREIGN KEY ("processo_id") REFERENCES "processos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_dimensoes" ADD CONSTRAINT "lista_dimensoes_politica_id_fkey" FOREIGN KEY ("politica_id") REFERENCES "politicas_internas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criticidades" ADD CONSTRAINT "criticidades_epigrafe_id_fkey" FOREIGN KEY ("epigrafe_id") REFERENCES "regulacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papeis" ADD CONSTRAINT "papeis_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papeis" ADD CONSTRAINT "papeis_politica_id_fkey" FOREIGN KEY ("politica_id") REFERENCES "politicas_internas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_comunidade_id_fkey" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_processo_id_fkey" FOREIGN KEY ("processo_id") REFERENCES "processos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
