import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth();
    
    const supabase = createClient();
    const { data: fichasTecnicas, error } = await supabase
      .from('fichas_tecnicas')
      .select('*, ingredientes:ingredientes_ficha(*, produto:produtos(*))')
      .eq('user_id', user.id)
      .order('nome', { ascending: true });

    if (error) throw error;

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
    
    const user = await requireAuth();
    
    const data = await req.json();
    
    let custoTotal = 0;
    const ingredientesComCusto = [];
    
    console.log('🧮 Calculating costs for ingredients:', data.ingredientes?.length || 0);
    
    if (data.ingredientes && data.ingredientes.length > 0) {
      for (const ingrediente of data.ingredientes) {
        const supabase = createClient();
        const { data: produto } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', ingrediente.produtoId)
          .single();
        
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
    
    const supabase = createClient();
    const { data: fichaTecnica, error } = await supabase
      .from('fichas_tecnicas')
      .insert({
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        modo_preparo: data.modoPreparo,
        tempo_preparo: data.tempoPreparo?.toString(),
        rendimento_total: data.rendimentoTotal,
        unidade_rendimento: data.unidadeRendimento,
        custo_total: custoTotal,
        custo_porcao: custoPorcao,
        observacoes: data.observacoes,
        user_id: user.id,
      })
      .select('*, ingredientes:ingredientes_ficha(*)')
      .single();

    if (error) throw error;

    return NextResponse.json(fichaTecnica);
  } catch (error) {
    console.error('Create ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
