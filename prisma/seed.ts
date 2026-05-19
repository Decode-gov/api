import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verificar se já existe um usuário admin
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: 'admin@decodegov.com' },
  });

  if (existingAdmin) {
    console.log('⚠️  Usuário admin já existe. Pulando criação...');
    return;
  }

  // Criar senha hash para o usuário padrão
  const senhaHash = await bcrypt.hash('mudar@123', 10);

  // Criar usuário admin padrão
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador do Sistema',
      email: 'admin@decodegov.com',
      tipo: "ADMIN",
      senha: senhaHash,
      ativo: true,
      empresa: {
        create: {
          nome: 'DecodeGov'
        }
      }
    },
  });

  console.log('✅ Usuário admin criado com sucesso!');
  console.log('📧 Email:', admin.email);
  console.log('🔑 Senha: mudar@123');
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro acesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
