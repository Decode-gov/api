## Entidades / Funcionalidades (26) — Padrões de UI esperados
> Para cada item abaixo, implementar **Listagem** (Tabela) e **Form de Criar/Editar** (em página, Dialog ou Sheet conforme padrão do projeto). **Detalhes** somente se já for padrão do projeto.

## 🔌 APIs Backend Disponíveis
**Base URL:** `http://localhost:3333` (ajustar conforme ambiente)  
**Autenticação:** Todas as rotas (exceto login/register) requerem JWT token no header `Authorization: Bearer <token>`

### 1) Necessidade de Informação
- **Campos:** `questaoGerencial*`, `elementoEstrategico`, `elementoTatico`, `origemQuestao*`, `comunidadeId*`.  
- **Listagem:** questão gerencial, origem questão, comunidade; filtros por search (questão gerencial).  
- **Form:** textarea para questão gerencial; inputs de texto para elemento estratégico/tático/origem; select de comunidade.
- **Relacionamentos:** Retorna `comunidade`, `tabelas`, `colunas`, `tabelasQuestaoGerencial`, `colunasQuestaoGerencial`.

**🔌 API Endpoints:**
- `GET /necessidades-informacao` - Listar (query: skip, take, orderBy, search)
- `GET /necessidades-informacao/:id` - Buscar por ID com relacionamentos completos
- `POST /necessidades-informacao` - Criar (body: `questaoGerencial*`, `elementoEstrategico`, `elementoTatico`, `origemQuestao*`, `comunidadeId*`)
- `PUT /necessidades-informacao/:id` - Atualizar (body: todos os campos opcionais)
- `DELETE /necessidades-informacao/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Campo principal é `questaoGerencial` (não `nome`)
- ✅ Possui relacionamento obrigatório com `Comunidade`
- ✅ Possui múltiplos relacionamentos com Tabela e Coluna

### 2) Políticas Internas
- **Campos:** `nome*`, `descricao*`, `categoria*`, `objetivo*`, `escopo*`, `dominioDadosId`, `responsavel*`, `dataCriacao*`, `dataInicioVigencia*`, `dataTermino`, `status*`, `versao*`, `anexosUrl`, `relacionamento`, `observacoes`.  
- **Listagem:** filtros por `escopo`, `status`, nome; exibir status como badge.  
- **Form:** Select/Combobox para status; inputs texto; DatePicker para datas; select para comunidade (domínio dados); textarea para descrição/observações.
- **Enums:**
  - `status`: `'Em_elaboracao' | 'Vigente' | 'Revogada'`
  - `escopo`: (String livre, não é enum no Prisma)

**🔌 API Endpoints:**
- `GET /politicas-internas` - Listar (query: skip, take, orderBy, escopo, status, nome)
- `GET /politicas-internas/:id` - Buscar por ID
- `POST /politicas-internas` - Criar (body: `nome*`, `descricao*`, `categoria*`, `objetivo*`, `escopo*`, `dominioDadosId`, `responsavel*`, `dataCriacao*`, `dataInicioVigencia*`, `dataTermino`, `status*`, `versao*`, `anexosUrl`, `relacionamento`, `observacoes`)
- `PUT /politicas-internas/:id` - Atualizar (body: todos os campos opcionais)
- `DELETE /politicas-internas/:id` - Deletar

**📝 Notas Importantes:**
- ⚠️ Enum `StatusPolitica` usa snake_case: `Em_elaboracao`, `Vigente`, `Revogada`
- ✅ Campo `escopo` é String livre (não é enum no schema atual)
- ✅ Múltiplos campos obrigatórios incluindo datas e versão

### 3) Papéis de Governança
- **Campos:** `listaPapelId*`, `comunidadeId*`, `nome*`, `descricao`, `politicaId*`, `documentoAtribuicao`, `comiteAprovadorId`, `onboarding` (default: false).  
- **Listagem:** nome, comunidade, política (badge), onboarding; busca por texto.  
- **Form:** Select de `política`; select de `comunidade`; textarea de descrição; inputs para documento/comitê; toggle para onboarding.
- **Relacionamentos:** Retorna `politica` e `comunidade` completos.

**🔌 API Endpoints:**
- `GET /papeis` - Listar com relacionamento política (query: skip, take, orderBy, nome, politicaId)
- `GET /papeis/:id` - Buscar por ID com relacionamento política
- `POST /papeis` - Criar (body: `listaPapelId*`, `comunidadeId*`, `nome*`, `descricao`, `politicaId*`, `documentoAtribuicao`, `comiteAprovadorId`, `onboarding`)
- `PUT /papeis/:id` - Atualizar (body: todos os campos opcionais)
- `DELETE /papeis/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Requer `listaPapelId` (UUID) - campo obrigatório adicional
- ✅ Requer `comunidadeId` - relacionamento obrigatório
- ✅ Campo `onboarding` boolean com default false
- ✅ Possui relacionamento inverso com `AtribuicaoPapelDominio`

### 4) Domínios / Comunidades
- **Campos:** `nome*`, `parentId`.  
- **Listagem:** nome, hierarquia (parent/children), contadores de papéis e KPIs.  
- **Form:** input de texto para nome; select para comunidade pai (opcional).
- **Relacionamentos:** `parent` (Comunidade pai), `children` (Comunidades filhas), `papeis` (Papéis), `kpis` (KPIs).

**🔌 API Endpoints:**
- `GET /comunidades` - Listar (query: skip, take, orderBy) - Retorna comunidades com parent, children e _count
- `GET /comunidades/:id` - Buscar por ID - Retorna comunidade com parent, children, papeis e kpis completos
- `POST /comunidades` - Criar (body: `nome*`, `parentId`)
- `PUT /comunidades/:id` - Atualizar (body: `nome`, `parentId`)
- `DELETE /comunidades/:id` - Deletar

**📝 Notas Importantes:**
- ❌ **NÃO existe campo `descricao`** - removido do modelo
- ✅ Campo `parentId` é UUID opcional para criar hierarquia de comunidades
- ✅ Relacionamentos carregados automaticamente: GET lista retorna _count, GET :id retorna relacionamentos completos

### 5) Atribuições Papel↔Domínio
- **Campos:** `papelId*`, `dominioId*`, `tipoEntidade*`, `documentoAtribuicao`, `comiteAprovadorId`, `onboarding`, `dataInicioVigencia*`, `dataTermino`, `observacoes`.  
- **Listagem:** papel (nome), domínio (nome), tipo de entidade, data início vigência, onboarding.  
- **Form:** selects para papel e domínio; select para tipo de entidade (enum); textarea para documento/observações; toggle para onboarding; datepickers para vigência.
- **Enums:**
  - `tipoEntidade`: `'Politica' | 'Papel' | 'Atribuicao' | 'Processo' | 'Termo' | 'KPI' | 'RegraNegocio' | 'RegraQualidade' | 'Dominio' | 'Sistema' | 'Tabela' | 'Coluna'`
- **Relacionamentos:** Retorna objetos `papel` e `dominio` completos com suas informações.

**🔌 API Endpoints:**
- `GET /atribuicoes` - Listar com relacionamentos papel e domínio (query: skip, take, orderBy, papelId, dominioId, tipoEntidade)
- `GET /atribuicoes/:id` - Buscar por ID com relacionamentos completos
- `POST /atribuicoes` - Criar (body: `papelId*`, `dominioId*`, `tipoEntidade*`, `documentoAtribuicao`, `comiteAprovadorId`, `onboarding` (default: false), `dataInicioVigencia*` (default: now), `dataTermino`, `observacoes`)
- `PUT /atribuicoes/:id` - Atualizar (body: todos os campos do POST opcionais, aceita `null` para limpar valores)
- `DELETE /atribuicoes/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Todas as responses incluem relacionamentos `papel` e `dominio` completos (id, nome, descricao)
- ✅ Campo `onboarding` tem valor padrão `false`
- ✅ Campo `dataInicioVigencia` tem valor padrão `now()`
- ✅ Campos nullable podem receber `null` explicitamente no PUT para limpar valores

### 6) Termos de Negócio (Definições)
- **Campos:** `termo*`, `definicao*`, `sigla`.  
- **Listagem:** termo (único), sigla, busca; opção de ver termos relacionados.  
- **Form:** inputs de texto; campo para sigla (abreviação); campo termo deve ser único.

**🔌 API Endpoints:**
- `GET /definicoes` - Listar termos (query: skip, take, orderBy, nome)
- `GET /definicoes/:id` - Buscar termo por ID
- `POST /definicoes` - Criar termo (body: `termo*`, `definicao*`, `sigla`)
- `PUT /definicoes/:id` - Atualizar termo (body: `termo`, `definicao`, `sigla`)
- `DELETE /definicoes/:id` - Deletar termo

**📝 Notas Importantes:**
- ⚠️ Campo principal é `termo` (não `nome`) e deve ser **único**
- ✅ Campo `definicao` é obrigatório
- ✅ Possui constraint `@@unique([termo])` no banco

### 7) Referencial de Classificação (Listas de Classificação)
- **Campos:** `nome*`, `descricao`, `politicaId*`.  
- **Listagem:** nome, descrição, política associada.  
- **Form:** input de nome; textarea para descrição; select de política (obrigatório).
- **Relacionamentos:** Retorna `politica` completa.

**🔌 API Endpoints:**
- `GET /listas-classificacao` - Listar (query: skip, take, orderBy, nome)
- `GET /listas-classificacao/:id` - Buscar por ID
- `POST /listas-classificacao` - Criar (body: `nome*`, `descricao`, `politicaId*`)
- `PUT /listas-classificacao/:id` - Atualizar (body: `nome`, `descricao`, `politicaId`)
- `DELETE /listas-classificacao/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Requer `politicaId` obrigatório - relacionamento com `PoliticaInterna`
- ✅ Campo `descricao` é opcional

### 8) Classificação das Informações
- **Campos:** `nome*`, `descricao`, `politicaId*`, `termoId`.  
- **Listagem:** nome, política, termo associado.  
- **Form:** input nome; select política; select termo (opcional); textarea descrição.

**🔌 API Endpoints:**
- `GET /classificacoes-informacao` - Listar (query: skip, take, orderBy, politicaId)
- `GET /classificacoes-informacao/todas` - Listar todas (sem paginação)
- `GET /classificacoes-informacao/:id` - Buscar por ID
- `POST /classificacoes-informacao` - Criar (body: `nome*`, `descricao`, `politicaId*`, `termoId`)
- `PUT /classificacoes-informacao/:id` - Atualizar (body: `nome`, `descricao`, `politicaId`, `termoId`)
- `PUT /classificacoes-informacao/:id/termo` - Atualizar apenas termo (body: `termoId*`)
- `DELETE /classificacoes-informacao/:id` - Deletar

### 9) Ativos Tecnológicos

#### 9.1) Sistemas
- **Campos:** `nome*`, `descricao`.  
- **Listagem:** sistema, descrição; busca.  
- **Form:** inputs texto.

**🔌 API Endpoints - Sistemas:**
- `GET /sistemas` - Listar sistemas (query: skip, take, orderBy)
- `GET /sistemas/:id` - Buscar sistema por ID
- `POST /sistemas` - Criar sistema (body: `nome*`, `descricao`)
- `PUT /sistemas/:id` - Atualizar sistema (body: `nome`, `descricao`)
- `DELETE /sistemas/:id` - Deletar sistema

#### 9.2) Bancos de Dados
- **Campos:** `nome*`, `descricao`.  
- **Listagem:** banco, descrição; busca.  
- **Form:** inputs texto.

**🔌 API Endpoints - Bancos:**
- `GET /bancos` - Listar bancos (query: skip, take, orderBy)
- `GET /bancos/:id` - Buscar banco por ID
- `POST /bancos` - Criar banco (body: `nome*`, `descricao`)
- `PUT /bancos/:id` - Atualizar banco (body: `nome`, `descricao`)
- `DELETE /bancos/:id` - Deletar banco

### 10) Tabelas e Colunas

#### 10.1) Tabelas
- **Campos:** `nome*`, `descricao`, `bancoId*`, `sistemaId*`.  
- **Listagem:** nome, sistema, banco; filtros por sistema/banco.  
- **Form:** selects para sistema e banco; inputs texto.

**🔌 API Endpoints - Tabelas:**
- `GET /tabelas` - Listar tabelas (query: skip, take, orderBy, sistemaId, bancoId, nome)
- `GET /tabelas/:id` - Buscar tabela por ID
- `POST /tabelas` - Criar tabela (body: `nome*`, `descricao`, `bancoId*`, `sistemaId*`)
- `PUT /tabelas/:id` - Atualizar tabela (body: `nome`, `descricao`, `bancoId`, `sistemaId`)
- `DELETE /tabelas/:id` - Deletar tabela

#### 10.2) Colunas
- **Campos:** `nome*`, `descricao`, `tabelaId*`, `tipoDadosId*`.  
- **Listagem:** nome, tabela, tipo de dado; filtros por tabela/tipo.  
- **Form:** selects para tabela e tipo de dado; inputs texto.

**🔌 API Endpoints - Colunas:**
- `GET /colunas` - Listar colunas (query: skip, take, orderBy, tabelaId, tipoDadosId, nome)
- `GET /colunas/:id` - Buscar coluna por ID
- `POST /colunas` - Criar coluna (body: `nome*`, `descricao`, `tabelaId*`, `tipoDadosId*`)
- `PUT /colunas/:id` - Atualizar coluna (body: `nome`, `descricao`, `tabelaId`, `tipoDadosId`)
- `DELETE /colunas/:id` - Deletar coluna

#### 10.3) Tipos de Dados
- **Campos:** `nome*`, `descricao`.  
- **Listagem:** nome, descrição; filtros por nome.  
- **Form:** inputs texto.

**🔌 API Endpoints - Tipos de Dados:**
- `GET /tipos-dados` - Listar tipos (query: skip, take, orderBy, nome)
- `GET /tipos-dados/:id` - Buscar tipo por ID
- `POST /tipos-dados` - Criar tipo (body: `nome*`, `descricao`)
- `PUT /tipos-dados/:id` - Atualizar tipo (body: `nome`, `descricao`)
- `DELETE /tipos-dados/:id` - Deletar tipo

### 11) Listas de Referência (códigos)
- **Campos:** `nome*`, `descricao`.  
- **Listagem:** nome, descrição.  
- **Form:** inputs de texto.

**🔌 API Endpoints:**
- `GET /listas-referencia` - Listar (query: skip, take, orderBy, nome)
- `GET /listas-referencia/:id` - Buscar por ID
- `POST /listas-referencia` - Criar (body: `nome*`, `descricao`)
- `PUT /listas-referencia/:id` - Atualizar (body: `nome`, `descricao`)
- `DELETE /listas-referencia/:id` - Deletar

### 12) Documentos Corporativos

#### 12.1) Documentos Repositório (Termo ↔ Repositório)
**📋 Finalidade:** Associar termos de negócio a repositórios de documentos corporativos (SharePoint, etc.)

- **Campos:** `termoId*`, `repositorioId*`.  
- **Listagem:** termo (nome), repositório (nome, tipo, localização), data criação.  
- **Form:** Select termo de negócio; select repositório de documentos.
- **Relacionamentos:** Retorna `termo` completo (termo, definição, sigla) e `repositorio` completo (nome, tipo, localização, responsável).

**🔌 API Endpoints:**
- `GET /documentos-repositorio` - Listar (query: skip, take, orderBy, termoId, repositorioId)
- `GET /documentos-repositorio/:id` - Buscar por ID com relacionamentos
- `POST /documentos-repositorio` - Criar (body: `termoId*`, `repositorioId*`)
- `PUT /documentos-repositorio/:id` - Atualizar (body: `termoId`, `repositorioId`)
- `DELETE /documentos-repositorio/:id` - Deletar

**📝 Notas Importantes:**
- ✅ **Caso de Uso Principal:** Indicar que um termo de negócio nomeia documentos em um repositório
- ✅ Validação FK: verifica existência de termo e repositório antes de criar
- ✅ Validação de unicidade: impede duplicação da mesma associação termo-repositório
- ✅ Ao consultar termo via `/definicoes/:id`, retorna documentos associados
- ✅ Exemplo: Termo "Relatório de Monitoramento Ambiental" → Repositório "SharePoint Ambiental"

**🔌 API Endpoints - Repositórios de Documentos:**
- `GET /repositorios-documento` - Listar repositórios (query: skip, take, orderBy)
- `GET /repositorios-documento/:id` - Buscar repositório por ID
- `POST /repositorios-documento` - Criar repositório (body: `nome*`, `tipo*`, `localizacao*`, `responsavel*`)
- `PUT /repositorios-documento/:id` - Atualizar repositório
- `DELETE /repositorios-documento/:id` - Deletar repositório

#### 12.2) Documentos Polimórficos (Sistema Genérico)
**📋 Finalidade:** Sistema de upload genérico para anexar arquivos a qualquer entidade do sistema

- **Campos:** `entidadeId*`, `tipoEntidade*`, `nomeArquivo*`, `tamanhoBytes*`, `tipoArquivo*`, `caminhoArquivo*`, `descricao`, `metadados`, `checksum`, `versao` (default: 1), `ativo` (default: true).  
- **Listagem:** nome arquivo, tipo entidade, tamanho, tipo arquivo, versão, ativo.  
- **Form:** Upload de arquivo; select tipo entidade (enum); campos automáticos (tamanho, tipo, caminho); textarea para descrição; input JSON para metadados.
- **Enums:**
  - `tipoEntidade`: `'Politica' | 'Papel' | 'Atribuicao' | 'Processo' | 'Termo' | 'KPI' | 'RegraNegocio' | 'RegraQualidade' | 'Dominio' | 'Sistema' | 'Tabela' | 'Coluna'`

**🔌 API Endpoints:**
- `GET /documentos` - Listar (query: skip, take, orderBy, entidadeId, tipoEntidade, ativo)
- `GET /documentos/:id` - Buscar por ID
- `POST /documentos` - Criar/Upload (body: `entidadeId*`, `tipoEntidade*`, `nomeArquivo*`, `tamanhoBytes*`, `tipoArquivo*`, `caminhoArquivo*`, `descricao`, `metadados`, `checksum`, `versao`, `ativo`)
- `PUT /documentos/:id` - Atualizar metadados (body: `descricao`, `metadados`, `ativo`)
- `DELETE /documentos/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Sistema polimórfico: associa documentos a qualquer entidade via `entidadeId` + `tipoEntidade`
- ✅ Controle de versão: campo `versao` (int) com default 1
- ✅ Constraint unique: `[entidadeId, tipoEntidade, nomeArquivo, versao]`
- ✅ Soft delete via campo `ativo` (boolean)
- ✅ `tamanhoBytes` é BigInt, `metadados` é String (JSON)
- ⚠️ **Diferença:** Use **12.1** para termos de negócio; **12.2** para anexos gerais

### 13) Dimensões de Qualidade
- **Campos:** `nome*`, `descricao`, `politicaId*`.  
- **Listagem:** nome, descrição, política associada.  
- **Form:** input texto para nome (obrigatório); textarea para descrição (opcional); select para política (obrigatório).
- **Relacionamentos:** Retorna `politica` completa e array de `regrasQualidade`.

**� API Endpoints:**
- `GET /dimensoes-qualidade` - Listar (query: skip, take, orderBy, politicaId)
- `GET /dimensoes-qualidade/:id` - Buscar por ID
- `POST /dimensoes-qualidade` - Criar (body: `nome*`, `descricao`, `politicaId*`)
- `PUT /dimensoes-qualidade/:id` - Atualizar (body: `nome`, `descricao`, `politicaId`)
- `DELETE /dimensoes-qualidade/:id` - Deletar

**📝 Notas Importantes:**
- Campo `nome` é obrigatório e identifica a dimensão
- Campo `descricao` é opcional (pode ser null)
- Campo `politicaId` é obrigatório (FK para PoliticaInterna)
- Retorna relacionamento com política (id, nome)
- Retorna lista de regras de qualidade associadas (id, descricao)

### 14) Regras de Negócio
- **Campos:** `processoId*`, `descricao*`.  
- **Listagem:** descrição, processo associado.  
- **Form:** textarea de descrição; select de processo (obrigatório).
- **Relacionamentos:** Retorna `processo` completo.

**🔌 API Endpoints:**
- `GET /regras-negocio` - Listar (query: skip, take, orderBy, processoId)
- `GET /regras-negocio/:id` - Buscar por ID
- `POST /regras-negocio` - Criar (body: `processoId*`, `descricao*`)
- `PUT /regras-negocio/:id` - Atualizar (body: `processoId`, `descricao`)
- `DELETE /regras-negocio/:id` - Deletar

**📝 Notas Importantes:**
- ⚠️ NÃO possui campo `nome` - apenas `processoId*` e `descricao*`
- ✅ Relacionamento obrigatório com `Processo`

### 15) Regras de Qualidade
- **Campos:** `dimensaoId*`, `descricao*`, `tabelaId`, `colunaId`, `responsavelId*`.  
- **Listagem:** dimensão, descrição, alvo (tabela/coluna), responsável.  
- **Form:** select dimensão (obrigatório); textarea descrição (obrigatório); selects tabela/coluna (opcionais); select responsável (obrigatório).
- **Relacionamentos:** Retorna `dimensao`, `tabela`, `coluna` e `responsavel` completos.

**� API Endpoints:**
- `GET /regras-qualidade` - Listar (query: skip, take, orderBy, dimensaoId, tabelaId, colunaId, responsavelId)
- `GET /regras-qualidade/:id` - Buscar por ID
- `POST /regras-qualidade` - Criar (body: `dimensaoId*`, `descricao*`, `tabelaId`, `colunaId`, `responsavelId*`)
- `PUT /regras-qualidade/:id` - Atualizar (body: `dimensaoId`, `descricao`, `tabelaId`, `colunaId`, `responsavelId`)
- `DELETE /regras-qualidade/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Campos obrigatórios: `dimensaoId*`, `descricao*`, `responsavelId*`
- ✅ Campos opcionais: `tabelaId`, `colunaId` (podem ser null)
- ✅ Relacionamento com `DimensaoQualidade` (obrigatório)
- ✅ Relacionamento com `Usuario` como responsável (obrigatório)
- ✅ Relacionamentos opcionais com `Tabela` e `Coluna`
- ⚠️ Se `colunaId` e `tabelaId` fornecidos, coluna deve pertencer à tabela

### 16) Partes Envolvidas
- **Campos:** `nome*`, `descricao`, `contato*`.  
- **Listagem:** nome, descrição, contato.  
- **Form:** inputs texto (nome, descrição opcional, contato obrigatório).

**🔌 API Endpoints:**
- `GET /partes-envolvidas` - Listar (query: skip, take, orderBy, search)
- `GET /partes-envolvidas/:id` - Buscar por ID
- `POST /partes-envolvidas` - Criar (body: `nome*`, `descricao`, `contato*`)
- `PUT /partes-envolvidas/:id` - Atualizar (body: `nome`, `descricao`, `contato`)
- `DELETE /partes-envolvidas/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Validação de unicidade: nome e contato devem ser únicos no sistema
- ✅ Campo `search` (query) pesquisa em nome, descrição e contato simultaneamente
- ✅ Campo `descricao` é opcional (pode ser null)

### 17) Regulação Completa
- **Campos:** `epigrafe*`, `orgao*`, `descricao*`, `dataInicio*`, `dataFim?`.  
- **Listagem:** epígrafe, órgão, data início, data fim, status (vigente/expirada).  
- **Form:** inputs texto; datepickers para vigência; status calculado automaticamente.
- **Relacionamentos:** Retorna `criticidadesRegulatorias` com regras de qualidade associadas.

**🔌 API Endpoints:**
- `GET /regulacoes-completas` - Listar (query: skip, take, orderBy, orgao, ativo)
- `GET /regulacoes-completas/:id` - Buscar por ID
- `POST /regulacoes-completas` - Criar (body: `epigrafe*`, `orgao*`, `descricao*`, `dataInicio*`, `dataFim`)
- `PUT /regulacoes-completas/:id` - Atualizar (body: `epigrafe`, `orgao`, `descricao`, `dataInicio`, `dataFim`)
- `DELETE /regulacoes-completas/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Campo `ativo` (query) filtra regulações vigentes vs expiradas baseado em datas
- ✅ Validação automática: dataFim deve ser posterior a dataInicio
- ✅ Impede deleção se houver criticidades regulatórias associadas

### 18) Criticidade Regulatória
- **Campos:** `regulacaoId*`, `regraQualidadeId*`, `grauCriticidade*`.  
- **Listagem:** regulação (epígrafe), regra de qualidade (descrição), grau criticidade (badge).  
- **Form:** select regulação; select regra qualidade; input/select grau criticidade.
- **Relacionamentos:** Retorna `regulacao` completa e `regraQualidade` com dimensão.

**🔌 API Endpoints:**
- `GET /criticidades-regulatorias` - Listar (query: skip, take, orderBy, regulacaoId, regraQualidadeId)
- `GET /criticidades-regulatorias/:id` - Buscar por ID
- `POST /criticidades-regulatorias` - Criar (body: `regulacaoId*`, `regraQualidadeId*`, `grauCriticidade*`)
- `PUT /criticidades-regulatorias/:id` - Atualizar (body: `regulacaoId`, `regraQualidadeId`, `grauCriticidade`)
- `DELETE /criticidades-regulatorias/:id` - Deletar

**📝 Notas Importantes:**
- ✅ Constraint unique: combinação `[regulacaoId, regraQualidadeId]` deve ser única
- ✅ Validação FK: verifica existência de regulação e regra de qualidade antes de criar
- ✅ Impede duplicação da mesma combinação regulação + regra de qualidade

### 19) KPIs
- **Campos:** `nome*`, `comunidadeId`, `processoId`.  
- **Listagem:** nome, comunidade, processo.  
- **Form:** input de texto para nome; selects para comunidade/processo (ambos opcionais).
- **Relacionamentos:** Retorna `comunidade` e `processo` quando presentes.

**🔌 API Endpoints - KPIs:**
- `GET /kpis` - Listar KPIs (query: skip, take, orderBy, nome, processoId, comunidadeId)
- `GET /kpis/:id` - Buscar KPI por ID
- `POST /kpis` - Criar KPI (body: `nome*`, `comunidadeId`, `processoId`)
- `PUT /kpis/:id` - Atualizar KPI (body: `nome`, `comunidadeId`, `processoId`)
- `DELETE /kpis/:id` - Deletar KPI

**📝 Notas Importantes:**
- ⚠️ Apenas `nome` é obrigatório (não `processoId`, `comunidadeId` ou `usuarioId`)
- ✅ `comunidadeId` e `processoId` são opcionais
- ❌ NÃO existe campo `usuarioId` no modelo KPI
- ❌ NÃO existe campo `descricao` no modelo KPI

**🔌 API Endpoints - Processos:**
- `GET /processos` - Listar processos (query: skip, take, orderBy, comunidadeId, nome)
- `GET /processos/:id` - Buscar processo por ID
- `POST /processos` - Criar processo (body: `nome*`, `descricao`)
- `PUT /processos/:id` - Atualizar processo (body: `nome`, `descricao`)
- `DELETE /processos/:id` - Deletar processo

**📝 Notas para Processos:**
- ⚠️ Modelo Processo NÃO possui campo `comunidadeId` obrigatório
- ✅ Campos: `nome*`, `descricao` (opcional)

### 20) Produto de Dados
- **Campos:** `nome*`, `descricao`.  
- **Listagem:** nome, descrição.  
- **Form:** inputs de texto.

**🔌 API Endpoints:**
- `GET /produtos-dados` - Listar (query: skip, take, orderBy, nome)
- `GET /produtos-dados/:id` - Buscar por ID
- `POST /produtos-dados` - Criar (body: `nome*`, `descricao`)
- `PUT /produtos-dados/:id` - Atualizar (body: `nome`, `descricao`)
- `DELETE /produtos-dados/:id` - Deletar

### 21) Atividades
**📝 Nota:** Modelo não existe no `schema.prisma` - funcionalidade não disponível no backend.

### 22) Operações
**📝 Nota:** Modelo não existe no `schema.prisma` - funcionalidade não disponível no backend.

### 23) Auditoria & Logs
- **Campos:** Apenas visualização (somente leitura).
- **Listagem:** timestamp, usuário, operação, entidade; filtros avançados por data/usuário/entidade.
- **Form:** Não aplicável.

**🔌 API Endpoints:**
- `GET /auditoria` - Listar logs (query: skip, take, orderBy, usuarioId, acao, entidade, dataInicio, dataFim)
- `GET /auditoria/:id` - Buscar log por ID

**📝 Notas Importantes:**
- ✅ API somente leitura - não permite criar/editar/deletar logs
- ✅ Campos: usuarioId, acao, entidade, entidadeId, detalhes (JSON), ipAddress, userAgent
- ✅ Filtros avançados por período, usuário e tipo de ação

### 24) Dashboard & Métricas
- **Campos:** Métricas calculadas, gráficos, estatísticas consolidadas.
- **Listagem:** Cards de métricas, gráficos interativos, filtros por período.
- **Form:** Não aplicável (dashboard é somente visualização).

**🔌 API Endpoints:**
- `GET /dashboard/geral` - Métricas gerais (contadores, estatísticas principais)
- `GET /dashboard/usuario/:usuarioId` - Métricas específicas do usuário
- `GET /dashboard/qualidade` - Métricas de qualidade de dados

**📝 Notas Importantes:**
- ✅ API de análise e agregação de dados do sistema
- ✅ Retorna estatísticas consolidadas de múltiplas entidades
- ✅ Endpoints otimizados para visualização

### 25) Importação/Exportação
- **Campos:** `formato*`, `entidades*`, `filtros`, `opcoes`.
- **Listagem:** Histórico de importações/exportações com status.
- **Form:** Seleção de formato (Excel, CSV, JSON), entidades, configurações.

**🔌 API Endpoints:**
- `POST /importacao-exportacao/exportar` - Exportar dados (body: formato, entidade, filtros)
- `POST /importacao-exportacao/importar` - Importar dados (body: formato, arquivo, entidade)
- `GET /importacao-exportacao/historico` - Histórico de operações

**📝 Notas Importantes:**
- ✅ Suporta formatos: Excel, CSV, JSON
- ✅ Permite exportação com filtros personalizados
- ✅ Validação de dados na importação

### 26) MFA/Autenticação Multifator
- **Campos:** `tipo*`, `status*`, `configuracao`, `backup_codes`.
- **Listagem:** Status MFA por usuário, métodos configurados.
- **Form:** Configurar TOTP, SMS, backup codes.

**🔌 API Endpoints:**
- `POST /mfa/setup` - Configurar MFA (body: tipo, configuracao)
- `POST /mfa/enable` - Ativar MFA (body: codigo)
- `POST /mfa/disable` - Desativar MFA (body: senha)
- `POST /mfa/verify` - Verificar código MFA (body: codigo)
- `GET /mfa/status` - Status da configuração MFA

**📝 Notas Importantes:**
- ✅ Suporta TOTP (autenticador) e SMS
- ✅ Geração de backup codes para recuperação
- ✅ Integrado com autenticação JWT

---

## 🚀 Instruções para Claude Sonnet 4 - Frontend

### 🔐 Autenticação
**Endpoints disponíveis (prefixo `/usuarios`):**
- `POST /usuarios/register` - Registrar usuário (body: `nome*`, `email*`, `senha*`)
- `POST /usuarios/login` - Login (body: `email*`, `senha*`) - retorna JWT no cookie httpOnly
- `POST /usuarios/logout` - Logout (limpa cookie JWT)
- `GET /usuarios/perfil` - Obter perfil do usuário logado (requer autenticação)
- `PUT /usuarios/change-password` - Alterar senha (body: `senhaAtual*`, `novaSenha*`) (requer autenticação)
- `GET /usuarios` - Listar usuários (query: skip, take, orderBy) (requer autenticação)
- `GET /usuarios/:id` - Buscar usuário por ID (requer autenticação)
- `PUT /usuarios/:id` - Atualizar usuário (body: `nome`, `email`, `ativo`) (requer autenticação)
- `DELETE /usuarios/:id` - Deletar usuário (requer autenticação)

### 📝 Padrões de Response
Todas as APIs retornam no formato:
```json
{
  "message": "Mensagem descritiva",
  "data": {} // ou []
}
```

### 🎯 Funcionalidades Adicionais Disponíveis
- **Dashboard Completo**: Métricas gerais, por usuário e qualidade de dados
- **Auditoria Completa**: Logs detalhados com filtros avançados por data/usuário/entidade
- **Import/Export Completo**: Suporte a múltiplos formatos (Excel, CSV, JSON)
- **MFA Completo**: TOTP, SMS, backup codes com setup/enable/disable
- **Regulação Completa**: Gestão de regulações com controle de vigência
- **Criticidade Regulatória**: Associação de regulações com regras de qualidade

### ⚙️ Parâmetros de Query Padrão
Todas as listagens aceitam:
- `skip`: número (offset para paginação)
- `take`: número (limite de registros, máx 100)
- `orderBy`: string (campo para ordenação)

### ⚠️ APIs Não Implementadas
As seguintes funcionalidades não possuem modelos no `schema.prisma`:
- ❌ **Atividades** - Modelo não existe no banco de dados
- ❌ **Operações** - Modelo não existe no banco de dados

### ✨ Funcionalidades Implementadas
- **24 APIs REST completas** com CRUD e paginação
- **70+ Endpoints** documentados e testados
- Validação com **Zod v4.1.11**
- Autenticação **JWT** com httpOnly cookies

### 🔧 Implementação Recomendada
1. **Usar React Query/SWR** para cache e sincronização
2. **Interceptors Axios** para JWT automático
3. **Zod** para validação client-side (schemas compatíveis)
4. **React Hook Form** para forms com validação
5. **Shadcn/ui** para componentes (seguir padrão do projeto)

### 📋 Enums e Validações Disponíveis

**Enums Disponíveis:**
```typescript
// Políticas Internas  
status: 'ATIVA' | 'REVOGADA' | 'EM_REVISAO'
escopo: 'SEGURANCA' | 'QUALIDADE' | 'GOVERNANCA' | 'OUTRO'
```

**Campos Obrigatórios por Entidade:**
- `*` = Campo obrigatório
- `?` = Campo opcional
- Todos os IDs são UUIDs v4
- Todas as entidades têm `createdAt` e `updatedAt` automáticos

**Validações de Tamanho:**
- **Nomes**: 1-255 caracteres
- **Descrições**: até 2000 caracteres  
- **URLs**: formato URL válido
- **Emails**: formato email válido
- **Datas**: formato ISO 8601

---