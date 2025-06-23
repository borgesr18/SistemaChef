const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const unidadesPadrao = [
  { id: 'kg', nome: 'Quilograma' },
  { id: 'g', nome: 'Grama' },
  { id: 'mg', nome: 'Miligrama' },
  { id: 'l', nome: 'Litro' },
  { id: 'ml', nome: 'Mililitro' },
  { id: 'un', nome: 'Unidade' },
  { id: 'dz', nome: 'Dúzia' },
  { id: 'pct', nome: 'Pacote' },
  { id: 'cx', nome: 'Caixa' },
  { id: 'sc', nome: 'Saco' },
  { id: 'tb', nome: 'Tablete' },
  { id: 'lata', nome: 'Lata' },
  { id: 'grf', nome: 'Garrafa' },
  { id: 'pote', nome: 'Pote' },
  { id: 'bandj', nome: 'Bandeja' }
];

async function seedUnidades() {
  console.log('🌱 Seeding unidades de medida...');
  
  for (const unidade of unidadesPadrao) {
    try {
      await prisma.unidade.upsert({
        where: { id: unidade.id },
        update: { nome: unidade.nome },
        create: unidade
      });
      console.log(`✅ Unidade criada/atualizada: ${unidade.id} - ${unidade.nome}`);
    } catch (error) {
      console.error(`❌ Erro ao criar unidade ${unidade.id}:`, error.message);
    }
  }
  
  console.log('✅ Seeding de unidades concluído!');
}

async function main() {
  try {
    await seedUnidades();
  } catch (error) {
    console.error('❌ Erro durante o seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
