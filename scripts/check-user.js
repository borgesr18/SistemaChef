const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndCreateUser() {
  try {
    console.log('🔍 Verificando usuário rba1807@gmail.com...');
    
    const existingUser = await prisma.usuario.findUnique({
      where: { email: 'rba1807@gmail.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário rba1807@gmail.com encontrado!');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Nome: ${existingUser.nome}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   Senha definida: ${existingUser.senhaHash ? 'SIM' : 'NÃO'}`);
      
      if (!existingUser.senhaHash) {
        console.log('⚠️  Usuário sem senha definida. Definindo senha Rb180780@...');
        const hashedPassword = await bcrypt.hash('Rb180780@', 10);
        
        await prisma.usuario.update({
          where: { id: existingUser.id },
          data: { senhaHash: hashedPassword }
        });
        
        console.log('✅ Senha definida com sucesso!');
      } else {
        console.log('✅ Usuário já possui senha definida.');
      }
    } else {
      console.log('❌ Usuário rba1807@gmail.com não encontrado.');
      console.log('🔧 Criando usuário com senha Rb180780@...');
      
      const hashedPassword = await bcrypt.hash('Rb180780@', 10);
      
      const newUser = await prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: 'rba1807@gmail.com',
          senhaHash: hashedPassword,
          role: 'admin'
        }
      });
      
      console.log('✅ Usuário criado com sucesso!');
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Nome: ${newUser.nome}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Role: ${newUser.role}`);
    }

    console.log('\n📋 Lista de todos os usuários no banco:');
    const allUsers = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (allUsers.length === 0) {
      console.log('   Nenhum usuário encontrado no banco.');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role} - Criado: ${user.createdAt.toLocaleDateString('pt-BR')}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro ao verificar/criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateUser();
