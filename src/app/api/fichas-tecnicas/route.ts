import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth(req);
    
    const fichasTecnicas = await prisma.fichaTecnica.findMany({
      where: { userId: user.id },
      include: {
        ingredientes: {
          include: {
            produto: true
          }
        }
      },
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json(fichasTecnicas);
  } catch (error) {
    console.error('Get fichas técnicas error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth(req);
    
    const data = await req.json();
    
    let custoTotal = 0;
    const ingredientesComCusto = [];
    
    console.log('🧮 Calculating costs for ingredients:', data.ingredientes?.length || 0);
    
    if (data.ingredientes && data.ingredientes.length > 0) {
      for (const ingrediente of data.ingredientes) {
        const produto = await prisma.produto.findUnique({
          where: { id: ingrediente.produtoId }
        });
        
        if (produto) {
          let custoIngrediente = 0;
          const quantidade = Number(ingrediente.quantidade) || 0;
          const preco = Number(produto.preco) || 0;
          
          console.log(`💰 Produto: ${produto.nome}, Quantidade: ${quantidade}, Preço: ${preco}, Unidade: ${ingrediente.unidade}`);
          
          if (preco > 0 && quantidade > 0) {
            if (ingrediente.unidade === 'kg' || ingrediente.unidade === 'Quilograma') {
              custoIngrediente = quantidade * preco;
            } else if (ingrediente.unidade === 'g' || ingrediente.unidade === 'Grama') {
              custoIngrediente = (quantidade / 1000) * preco;
            } else if (ingrediente.unidade === 'l' || ingrediente.unidade === 'Litro') {
              custoIngrediente = quantidade * preco;
            } else if (ingrediente.unidade === 'ml' || ingrediente.unidade === 'Mililitro') {
              custoIngrediente = (quantidade / 1000) * preco;
            } else if (ingrediente.unidade === 'unidade' || ingrediente.unidade === 'Unidade' || ingrediente.unidade === 'Pacote') {
              custoIngrediente = quantidade * preco;
            } else {
              custoIngrediente = quantidade * preco;
            }
          }
          
          console.log(`💵 Custo calculado para ${produto.nome}: R$ ${custoIngrediente.toFixed(2)}`);
          custoTotal += custoIngrediente;
          ingredientesComCusto.push({
            produtoId: ingrediente.produtoId,
            quantidade: ingrediente.quantidade,
            unidade: ingrediente.unidade,
            custo: custoIngrediente
          });
        } else {
          console.log(`❌ Produto não encontrado: ${ingrediente.produtoId}`);
          ingredientesComCusto.push({
            produtoId: ingrediente.produtoId,
            quantidade: ingrediente.quantidade,
            unidade: ingrediente.unidade,
            custo: 0
          });
        }
      }
    }
    
    console.log(`🎯 Custo total calculado: R$ ${custoTotal.toFixed(2)}`)
    
    const custoPorcao = data.rendimentoTotal && data.rendimentoTotal > 0 
      ? custoTotal / data.rendimentoTotal 
      : 0;
    
    const fichaTecnica = await prisma.fichaTecnica.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        modoPreparo: data.modoPreparo,
        tempoPreparo: data.tempoPreparo.toString(),
        rendimentoTotal: data.rendimentoTotal,
        unidadeRendimento: data.unidadeRendimento,
        custoTotal: custoTotal,
        custoPorcao: custoPorcao,
        observacoes: data.observacoes,
        userId: user.id,
        ingredientes: {
          create: ingredientesComCusto
        }
      },
      include: {
        ingredientes: {
          include: {
            produto: true
          }
        }
      }
    });

    return NextResponse.json(fichaTecnica);
  } catch (error) {
    console.error('Create ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
