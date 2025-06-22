const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categoriasPadrao = [
  { id: 'entrada', nome: 'Entrada' },
  { id: 'prato-principal', nome: 'Prato Principal' },
  { id: 'acompanhamento', nome: 'Acompanhamento' },
  { id: 'sobremesa', nome: 'Sobremesa' },
  { id: 'bebida', nome: 'Bebida' },
  { id: 'molho', nome: 'Molho/Condimento' },
  { id: 'outro', nome: 'Outro' },
];

async function seedCategoriasReceitas() {
  console.log('Seeding categorias de receitas...');
  
  for (const categoria of categoriasPadrao) {
    try {
      await prisma.categoriaReceita.upsert({
        where: { id: categoria.id },
        update: {},
        create: categoria
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
