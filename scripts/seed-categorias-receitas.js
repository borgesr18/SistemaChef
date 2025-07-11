const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categoriasPadrao = [
  { nome: 'Entrada' },
  { nome: 'Prato Principal' },
  { nome: 'Acompanhamento' },
  { nome: 'Sobremesa' },
  { nome: 'Bebida' },
  { nome: 'Molho/Condimento' },
  { nome: 'Outro' },
];

async function seedCategoriasReceitas() {
  console.log('Seeding categorias de receitas...');
  
  for (const categoria of categoriasPadrao) {
    try {
      await prisma.categoriaReceita.upsert({
        where: { nome: categoria.nome },
        update: {},
        create: { nome: categoria.nome }
      });
      console.log(`✅ Categoria "${categoria.nome}" criada/atualizada`);
    } catch (error) {
      console.error(`❌ Erro ao criar categoria "${categoria.nome}":`, error);
    }
  }
  
  console.log('✅ Seed de categorias de receitas concluído!');
}

seedCategoriasReceitas()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
