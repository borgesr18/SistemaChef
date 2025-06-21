const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    console.log('🔧 Redefinindo senha do usuário rba1807@gmail.com para Rb080859@...');
    
    const existingUser = await prisma.usuario.findUnique({
      where: { email: 'rba1807@gmail.com' }
    });

    if (!existingUser) {
      console.log('❌ Usuário rba1807@gmail.com não encontrado!');
      console.log('🔧 Criando usuário com senha Rb080859@...');
      
      const hashedPassword = await bcrypt.hash('Rb080859@', 10);
      
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
      console.log(`   Nova senha: Rb080859@`);
    } else {
      console.log('✅ Usuário encontrado. Redefinindo senha...');
      
      const hashedPassword = await bcrypt.hash('Rb080859@', 10);
      
      const updatedUser = await prisma.usuario.update({
        where: { id: existingUser.id },
        data: { senhaHash: hashedPassword }
      });
      
      console.log('✅ Senha redefinida com sucesso!');
      console.log(`   ID: ${updatedUser.id}`);
      console.log(`   Nome: ${updatedUser.nome}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Role: ${updatedUser.role}`);
      console.log(`   Nova senha: Rb080859@`);
    }

    const verifyUser = await prisma.usuario.findUnique({
      where: { email: 'rba1807@gmail.com' }
    });

    if (verifyUser && verifyUser.senhaHash) {
      const passwordMatch = await bcrypt.compare('Rb080859@', verifyUser.senhaHash);
      if (passwordMatch) {
        console.log('✅ Verificação: Senha Rb080859@ está funcionando corretamente!');
      } else {
        console.log('❌ Erro: Senha não está funcionando após redefinição!');
      }
    }

  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
