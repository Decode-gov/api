# 🚀 Guia de Deploy - API GDADOS

## ✅ Pré-requisitos

- Docker instalado na VPS
- Acesso SSH à VPS
- Postgres rodando (via docker-compose ou serviço)
- Rede Docker `dean-network` criada

## 📦 1. Preparar a Imagem

### Opção A: Build na VPS (Recomendado)

```bash
# Na VPS, clonar o repositório
git clone <seu-repo>
cd api

# Build da imagem
docker build -t api-gdados:latest .
```

### Opção B: Build Local e Transfer

```bash
# No seu computador local
docker build -t api-gdados:latest .

# Salvar imagem
docker save api-gdados:latest | gzip > api-gdados.tar.gz

# Transferir para VPS (ajuste usuario e ip)
scp api-gdados.tar.gz usuario@seu-vps-ip:/tmp/

# Na VPS, carregar imagem
docker load < /tmp/api-gdados.tar.gz
```

## 🗄️ 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.production` na VPS:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@gdados:5432/decodegov?schema=public"

# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# Authentication
JWT_SECRET="seu-secret-super-seguro-mude-isso"
```

## 🚀 3. Deploy

### Passo 1: Executar Migrations

```bash
docker run --rm \
  --network dean-network \
  --env-file .env.production \
  api-gdados:latest \
  npm run db:deploy
```

**Saída esperada:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "decodegov"...
X migrations found in prisma/migrations
Applying migrations...
The following migration(s) have been applied:
migrations/
  └─ 20250818185206_db_gdados
  └─ ...
All migrations have been successfully applied.
```

### Passo 2: Executar Seed (Primeira vez)

```bash
docker run --rm \
  --network dean-network \
  --env-file .env.production \
  api-gdados:latest \
  npm run db:seed
```

**Saída esperada:**
```
🌱 Iniciando seed do banco de dados...
✅ Usuário admin criado com sucesso!
📧 Email: admin@decodegov.com
🔑 Senha: mudar@123
⚠️  IMPORTANTE: Altere a senha após o primeiro acesso!
```

### Passo 3: Iniciar Aplicação

```bash
docker run -d \
  --name api-gdados \
  --network dean-network \
  -p 3333:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  -v /app/public/anexos:/app/public/anexos \
  api-gdados:latest
```

## 🔍 4. Verificar Status

```bash
# Ver logs
docker logs api-gdados

# Ver logs em tempo real
docker logs -f api-gdados

# Verificar se está rodando
docker ps | grep api-gdados

# Testar a API
curl http://localhost:3333/docs
```

## 🔄 5. Atualizar a Aplicação

```bash
# 1. Fazer pull das mudanças (se usando git na VPS)
git pull origin main

# 2. Rebuild da imagem
docker build -t api-gdados:latest .

# 3. Parar e remover container antigo
docker stop api-gdados
docker rm api-gdados

# 4. Rodar migrations (se houver)
docker run --rm \
  --network dean-network \
  --env-file .env.production \
  api-gdados:latest \
  npm run db:deploy

# 5. Iniciar novo container
docker run -d \
  --name api-gdados \
  --network dean-network \
  -p 3333:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  -v /app/public/anexos:/app/public/anexos \
  api-gdados:latest
```

## 🛠️ 6. Comandos Úteis

### Entrar no Container
```bash
docker exec -it api-gdados sh
```

### Ver uso de recursos
```bash
docker stats api-gdados
```

### Backup do Banco de Dados
```bash
docker exec gdados pg_dump -U postgres decodegov > backup_$(date +%Y%m%d).sql
```

### Restaurar Backup
```bash
cat backup_20251021.sql | docker exec -i gdados psql -U postgres decodegov
```

### Limpar containers e imagens antigas
```bash
docker system prune -a
```

## 🐛 7. Troubleshooting

### Erro: "Cannot connect to database"
- Verificar se o Postgres está rodando: `docker ps | grep gdados`
- Verificar se a rede está correta: `docker network ls`
- Testar conexão: `docker exec gdados psql -U postgres -c "SELECT 1"`

### Erro: "Port already in use"
- Verificar processo usando a porta: `lsof -i :3333`
- Parar container: `docker stop api-gdados`

### Erro: "sh: tsx: not found" no seed
- ✅ **Resolvido:** Agora usamos `scripts/seed.js` que não precisa de tsx

### Warning: "package.json#prisma is deprecated"
- ℹ️ **Não é crítico:** Funciona normalmente até Prisma 7
- Pode ser ignorado com segurança

## 📊 8. Monitoramento

### Healthcheck
Adicione ao docker-compose.yml ou ao comando docker run:

```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/docs"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logs Estruturados
Os logs estarão disponíveis via:
```bash
docker logs api-gdados --since 1h
docker logs api-gdados --tail 100
```

## 🔐 9. Segurança

- ✅ Container roda com usuário não-root (nodejs:1001)
- ✅ Variáveis sensíveis em arquivo .env
- ✅ Imagem Alpine (menor superfície de ataque)
- ⚠️ Altere `JWT_SECRET` em produção
- ⚠️ Altere senha do admin após primeiro acesso
- ⚠️ Configure firewall para portas necessárias

## 📝 10. Notas

- A porta exposta no container é **3000**
- A porta mapeada no host é **3333** (ajustável)
- Volume para anexos: `/app/public/anexos`
- Rede Docker: `dean-network`
- Database: `decodegov` (ajuste conforme necessário)

---

✅ **Imagem validada e pronta para produção!**
