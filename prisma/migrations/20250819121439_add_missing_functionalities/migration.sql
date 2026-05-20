-- AlterTable
ALTER TABLE "public"."colunas" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "obrigatorio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "politica_interna_id" UUID,
ADD COLUMN     "questao_gerencial_id" UUID,
ADD COLUMN     "tipo_dados_id" UUID,
ADD COLUMN     "unicidade" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."tabelas" ADD COLUMN     "questao_gerencial_id" UUID;

-- CreateTable
CREATE TABLE "public"."tipos_dados" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "tipos_dados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classificacoes_informacao" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "politica_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "classificacoes_informacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."termos_classificacao" (
    "id" UUID NOT NULL,
    "termo_id" UUID NOT NULL,
    "classificacao_informacao_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "termos_classificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bancos_dados" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "tecnologia" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "sistema_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bancos_dados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."repositorios_documentos" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "repositorios_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."repositorios_bancos" (
    "id" UUID NOT NULL,
    "banco_id" UUID NOT NULL,
    "repositorio_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "repositorios_bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listas_referencia" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valores" TEXT NOT NULL,
    "tabela_id" UUID,
    "coluna_id" UUID,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "listas_referencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documentos_tabela" (
    "id" UUID NOT NULL,
    "termo_id" UUID NOT NULL,
    "repositorio_id" UUID NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "data_upload" TIMESTAMP(3) NOT NULL,
    "tabela_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "documentos_tabela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documentos_repositorio" (
    "id" UUID NOT NULL,
    "termo_id" UUID NOT NULL,
    "repositorio_id" UUID NOT NULL,
    "caminho_arquivo" TEXT NOT NULL,
    "data_upload" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "documentos_repositorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dimensoes_qualidade" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "politica_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "dimensoes_qualidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regras_qualidade" (
    "id" UUID NOT NULL,
    "descricao" TEXT NOT NULL,
    "dimensao_id" UUID NOT NULL,
    "tabela_id" UUID,
    "coluna_id" UUID,
    "responsavel_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "regras_qualidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partes_envolvidas" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "contato" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "partes_envolvidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."regulacoes_completas" (
    "id" UUID NOT NULL,
    "epigrafe" TEXT NOT NULL,
    "orgao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "regulacoes_completas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."criticidades_regulatorias" (
    "id" UUID NOT NULL,
    "regulacao_id" UUID NOT NULL,
    "regra_qualidade_id" UUID NOT NULL,
    "grau_criticidade" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "criticidades_regulatorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."processos_atualizados" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "sistema_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "processos_atualizados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs_auditoria" (
    "id" UUID NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidade_id" UUID NOT NULL,
    "operacao" TEXT NOT NULL,
    "dados_antes" TEXT,
    "dados_depois" TEXT,
    "usuario_id" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "classificacoes_informacao_politica_id_idx" ON "public"."classificacoes_informacao"("politica_id");

-- CreateIndex
CREATE INDEX "termos_classificacao_termo_id_idx" ON "public"."termos_classificacao"("termo_id");

-- CreateIndex
CREATE INDEX "termos_classificacao_classificacao_informacao_id_idx" ON "public"."termos_classificacao"("classificacao_informacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "termos_classificacao_termo_id_classificacao_informacao_id_key" ON "public"."termos_classificacao"("termo_id", "classificacao_informacao_id");

-- CreateIndex
CREATE INDEX "bancos_dados_sistema_id_idx" ON "public"."bancos_dados"("sistema_id");

-- CreateIndex
CREATE INDEX "repositorios_bancos_banco_id_idx" ON "public"."repositorios_bancos"("banco_id");

-- CreateIndex
CREATE INDEX "repositorios_bancos_repositorio_id_idx" ON "public"."repositorios_bancos"("repositorio_id");

-- CreateIndex
CREATE UNIQUE INDEX "repositorios_bancos_banco_id_repositorio_id_key" ON "public"."repositorios_bancos"("banco_id", "repositorio_id");

-- CreateIndex
CREATE INDEX "listas_referencia_tabela_id_idx" ON "public"."listas_referencia"("tabela_id");

-- CreateIndex
CREATE INDEX "listas_referencia_coluna_id_idx" ON "public"."listas_referencia"("coluna_id");

-- CreateIndex
CREATE INDEX "documentos_tabela_termo_id_idx" ON "public"."documentos_tabela"("termo_id");

-- CreateIndex
CREATE INDEX "documentos_tabela_repositorio_id_idx" ON "public"."documentos_tabela"("repositorio_id");

-- CreateIndex
CREATE INDEX "documentos_tabela_tabela_id_idx" ON "public"."documentos_tabela"("tabela_id");

-- CreateIndex
CREATE INDEX "documentos_repositorio_termo_id_idx" ON "public"."documentos_repositorio"("termo_id");

-- CreateIndex
CREATE INDEX "documentos_repositorio_repositorio_id_idx" ON "public"."documentos_repositorio"("repositorio_id");

-- CreateIndex
CREATE INDEX "dimensoes_qualidade_politica_id_idx" ON "public"."dimensoes_qualidade"("politica_id");

-- CreateIndex
CREATE INDEX "regras_qualidade_dimensao_id_idx" ON "public"."regras_qualidade"("dimensao_id");

-- CreateIndex
CREATE INDEX "regras_qualidade_tabela_id_idx" ON "public"."regras_qualidade"("tabela_id");

-- CreateIndex
CREATE INDEX "regras_qualidade_coluna_id_idx" ON "public"."regras_qualidade"("coluna_id");

-- CreateIndex
CREATE INDEX "regras_qualidade_responsavel_id_idx" ON "public"."regras_qualidade"("responsavel_id");

-- CreateIndex
CREATE INDEX "criticidades_regulatorias_regulacao_id_idx" ON "public"."criticidades_regulatorias"("regulacao_id");

-- CreateIndex
CREATE INDEX "criticidades_regulatorias_regra_qualidade_id_idx" ON "public"."criticidades_regulatorias"("regra_qualidade_id");

-- CreateIndex
CREATE UNIQUE INDEX "criticidades_regulatorias_regulacao_id_regra_qualidade_id_key" ON "public"."criticidades_regulatorias"("regulacao_id", "regra_qualidade_id");

-- CreateIndex
CREATE INDEX "processos_atualizados_sistema_id_idx" ON "public"."processos_atualizados"("sistema_id");

-- CreateIndex
CREATE INDEX "processos_atualizados_usuario_id_idx" ON "public"."processos_atualizados"("usuario_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_entidade_idx" ON "public"."logs_auditoria"("entidade");

-- CreateIndex
CREATE INDEX "logs_auditoria_entidade_id_idx" ON "public"."logs_auditoria"("entidade_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_usuario_id_idx" ON "public"."logs_auditoria"("usuario_id");

-- CreateIndex
CREATE INDEX "logs_auditoria_timestamp_idx" ON "public"."logs_auditoria"("timestamp");

-- CreateIndex
CREATE INDEX "colunas_questao_gerencial_id_idx" ON "public"."colunas"("questao_gerencial_id");

-- CreateIndex
CREATE INDEX "colunas_politica_interna_id_idx" ON "public"."colunas"("politica_interna_id");

-- CreateIndex
CREATE INDEX "colunas_tipo_dados_id_idx" ON "public"."colunas"("tipo_dados_id");

-- CreateIndex
CREATE INDEX "tabelas_questao_gerencial_id_idx" ON "public"."tabelas"("questao_gerencial_id");

-- AddForeignKey
ALTER TABLE "public"."tabelas" ADD CONSTRAINT "tabelas_questao_gerencial_id_fkey" FOREIGN KEY ("questao_gerencial_id") REFERENCES "public"."necessidades_informacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."colunas" ADD CONSTRAINT "colunas_tipo_dados_id_fkey" FOREIGN KEY ("tipo_dados_id") REFERENCES "public"."tipos_dados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."colunas" ADD CONSTRAINT "colunas_politica_interna_id_fkey" FOREIGN KEY ("politica_interna_id") REFERENCES "public"."politicas_internas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."colunas" ADD CONSTRAINT "colunas_questao_gerencial_id_fkey" FOREIGN KEY ("questao_gerencial_id") REFERENCES "public"."necessidades_informacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classificacoes_informacao" ADD CONSTRAINT "classificacoes_informacao_politica_id_fkey" FOREIGN KEY ("politica_id") REFERENCES "public"."politicas_internas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."termos_classificacao" ADD CONSTRAINT "termos_classificacao_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "public"."definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."termos_classificacao" ADD CONSTRAINT "termos_classificacao_classificacao_informacao_id_fkey" FOREIGN KEY ("classificacao_informacao_id") REFERENCES "public"."classificacoes_informacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bancos_dados" ADD CONSTRAINT "bancos_dados_sistema_id_fkey" FOREIGN KEY ("sistema_id") REFERENCES "public"."sistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repositorios_bancos" ADD CONSTRAINT "repositorios_bancos_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "public"."bancos_dados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repositorios_bancos" ADD CONSTRAINT "repositorios_bancos_repositorio_id_fkey" FOREIGN KEY ("repositorio_id") REFERENCES "public"."repositorios_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listas_referencia" ADD CONSTRAINT "listas_referencia_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "public"."tabelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listas_referencia" ADD CONSTRAINT "listas_referencia_coluna_id_fkey" FOREIGN KEY ("coluna_id") REFERENCES "public"."colunas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos_tabela" ADD CONSTRAINT "documentos_tabela_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "public"."definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos_tabela" ADD CONSTRAINT "documentos_tabela_repositorio_id_fkey" FOREIGN KEY ("repositorio_id") REFERENCES "public"."repositorios_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos_tabela" ADD CONSTRAINT "documentos_tabela_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "public"."tabelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos_repositorio" ADD CONSTRAINT "documentos_repositorio_termo_id_fkey" FOREIGN KEY ("termo_id") REFERENCES "public"."definicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos_repositorio" ADD CONSTRAINT "documentos_repositorio_repositorio_id_fkey" FOREIGN KEY ("repositorio_id") REFERENCES "public"."repositorios_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dimensoes_qualidade" ADD CONSTRAINT "dimensoes_qualidade_politica_id_fkey" FOREIGN KEY ("politica_id") REFERENCES "public"."politicas_internas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regras_qualidade" ADD CONSTRAINT "regras_qualidade_dimensao_id_fkey" FOREIGN KEY ("dimensao_id") REFERENCES "public"."dimensoes_qualidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regras_qualidade" ADD CONSTRAINT "regras_qualidade_tabela_id_fkey" FOREIGN KEY ("tabela_id") REFERENCES "public"."tabelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regras_qualidade" ADD CONSTRAINT "regras_qualidade_coluna_id_fkey" FOREIGN KEY ("coluna_id") REFERENCES "public"."colunas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."regras_qualidade" ADD CONSTRAINT "regras_qualidade_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."criticidades_regulatorias" ADD CONSTRAINT "criticidades_regulatorias_regulacao_id_fkey" FOREIGN KEY ("regulacao_id") REFERENCES "public"."regulacoes_completas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."criticidades_regulatorias" ADD CONSTRAINT "criticidades_regulatorias_regra_qualidade_id_fkey" FOREIGN KEY ("regra_qualidade_id") REFERENCES "public"."regras_qualidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processos_atualizados" ADD CONSTRAINT "processos_atualizados_sistema_id_fkey" FOREIGN KEY ("sistema_id") REFERENCES "public"."sistemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processos_atualizados" ADD CONSTRAINT "processos_atualizados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
