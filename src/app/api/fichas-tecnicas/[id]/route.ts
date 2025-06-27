import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth();
    
    const supabase = createClient();
    const { data: fichaTecnica, error } = await supabase
      .from('fichas_tecnicas')
      .select('*, ingredientes:ingredientes_ficha(*, produto:produtos(*))')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    if (!fichaTecnica) {
      return NextResponse.json({ error: 'Ficha técnica não encontrada' }, { status: 404 });
    }

    return NextResponse.json(fichaTecnica);
  } catch (error) {
    console.error('Get ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth();
    
    const data = await req.json();
    
    const supabase = createClient();
    await supabase
      .from('ingredientes_ficha')
      .delete()
      .eq('ficha_id', params.id);
    
    let custoTotal = 0;
    const ingredientesComCusto = [];
    
    console.log('🧮 Recalculating costs for ingredients:', data.ingredientes?.length || 0);
    
    if (data.ingredientes && data.ingredientes.length > 0) {
      for (const ingrediente of data.ingredientes) {
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
          ingredientesComCusto.push({
            produtoId: ingrediente.produtoId,
            quantidade: ingrediente.quantidade,
            unidade: ingrediente.unidade,
            custo: 0
          });
        }
      }
    }
    
    console.log(`🎯 Custo total recalculado: R$ ${custoTotal.toFixed(2)}`);
    
    const custoPorcao = data.rendimentoTotal && data.rendimentoTotal > 0 
      ? custoTotal / data.rendimentoTotal 
      : 0;
    
    const { data: fichaTecnica, error } = await supabase
      .from('fichas_tecnicas')
      .update({
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        modo_preparo: data.modoPreparo,
        tempo_preparo: data.tempoPreparo,
        rendimento_total: data.rendimentoTotal,
        unidade_rendimento: data.unidadeRendimento,
        custo_total: custoTotal,
        custo_porcao: custoPorcao,
        observacoes: data.observacoes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('*, ingredientes:ingredientes_ficha(*)')
      .single();

    if (error) throw error;

    return NextResponse.json(fichaTecnica);
  } catch (error) {
    console.error('Update ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    const user = await requireAuth();
    
    const { error } = await supabase
      .from('fichas_tecnicas')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete ficha técnica error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
