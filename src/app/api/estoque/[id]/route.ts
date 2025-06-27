import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth();
    
    const data = await req.json();
    
    const supabase = createClient();
    const { data: movimentacao, error } = await supabase
      .from('estoque_movimentacoes')
      .update({
        produto_id: data.produtoId,
        quantidade: data.quantidade,
        preco: data.preco,
        fornecedor: data.fornecedor,
        marca: data.marca,
        data: data.data || new Date().toISOString(),
        tipo: data.tipo,
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('*, produto:produtos(*)')
      .single();

    if (error) throw error;

    return NextResponse.json(movimentacao);
  } catch (error) {
    console.error('Update estoque movimentação error:', error);
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
    
    const supabase = createClient();
    const { error } = await supabase
      .from('estoque_movimentacoes')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete estoque movimentação error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
