const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categoriasPadrao = [
  { nome: 'Bebidas' },
  { nome: 'Carnes' },
  { nome: 'Grãos e Cereais' },
  { nome: 'Hortifruti' },
  { nome: 'Laticínios' },
  { nome: 'Outros' },
  { nome: 'Temperos' },
];

async function seedCategoriasProdutos() {
  console.log('Seeding categorias de produtos...');
  
  for (const categoria of categoriasPadrao) {
    try {
      await prisma.categoria.upsert({
        where: { nome: categoria.nome },
        update: {},
        create: { nome: categoria.nome }
      });
      console.log(`✅ Categoria "${categoria.nome}" criada/atualizada`);
    } catch (error) {
      console.error(`❌ Erro ao criar categoria "${categoria.nome}":`, error);
    }
  }
  
  console.log('✅ Seed de categorias de produtos concluído!');
}

seedCategoriasProdutos()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
