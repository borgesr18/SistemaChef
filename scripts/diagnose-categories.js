const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseCategorias() {
  console.log('🔍 Diagnosticando categorias no Supabase...\n');
  
  try {
    const categoriasProdutos = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' }
    });
    console.log(`✅ Categorias de Produtos encontradas: ${categoriasProdutos.length}`);
    categoriasProdutos.forEach(cat => console.log(`  - ${cat.nome} (ID: ${cat.id})`));
    
    const categoriasReceitas = await prisma.categoriaReceita.findMany({
      orderBy: { nome: 'asc' }
    });
    console.log(`\n✅ Categorias de Receitas encontradas: ${categoriasReceitas.length}`);
    categoriasReceitas.forEach(cat => console.log(`  - ${cat.nome} (ID: ${cat.id})`));
    
    const adminUser = await prisma.usuario.findUnique({
      where: { email: 'rba1807@gmail.com' }
    });
    console.log(`\n✅ Usuário admin encontrado: ${adminUser ? 'Sim' : 'Não'}`);
    if (adminUser) {
      console.log(`  - ID: ${adminUser.id}`);
      console.log(`  - Nome: ${adminUser.nome}`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseCategorias();
