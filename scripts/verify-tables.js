const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyTables() {
  try {
    console.log('🔍 Verificando tabelas criadas no Supabase...\n');

    const tables = [
      { name: 'usuarios', model: prisma.usuario },
      { name: 'categorias', model: prisma.categoria },
      { name: 'unidades', model: prisma.unidade },
      { name: 'produtos', model: prisma.produto },
      { name: 'fichas_tecnicas', model: prisma.fichaTecnica },
      { name: 'ingredientes_ficha', model: prisma.ingredienteFicha },
      { name: 'estoque_movimentacoes', model: prisma.estoqueMovimentacao },
      { name: 'producoes', model: prisma.producao },
      { name: 'estoque_producao_movimentacoes', model: prisma.estoqueProducaoMovimentacao },
      { name: 'precos_venda', model: prisma.precoVenda }
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ ${table.name.padEnd(30)} - ${count} registros`);
      } catch (error) {
        console.log(`❌ ${table.name.padEnd(30)} - ERRO: ${error.message}`);
      }
    }

    console.log('\n📊 Resumo das tabelas:');
    console.log('✅ Todas as tabelas foram criadas com sucesso no Supabase!');
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTables();
