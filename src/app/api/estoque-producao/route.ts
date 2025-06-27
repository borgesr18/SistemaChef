import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    const user = await requireAuth();
    
    const supabase = createClient();
    const { data: movimentacoes, error } = await supabase
      .from('estoque_producao_movimentacoes')
      .select('*, ficha:fichas_tecnicas(*)')
      .eq('user_id', user.id)
      .order('data', { ascending: false });

    if (error) throw error;

    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error('Get estoque produção error:', error);
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
    
    const supabase = createClient();
    const { data: movimentacao, error } = await supabase
      .from('estoque_producao_movimentacoes')
      .insert({
        ficha_id: data.fichaId,
        quantidade: data.quantidade,
        validade: data.validade,
        data: data.data || new Date().toISOString(),
        tipo: data.tipo,
        user_id: user.id,
      })
      .select('*, ficha:fichas_tecnicas(*)')
      .single();

    if (error) throw error;

    return NextResponse.json(movimentacao);
  } catch (error) {
    console.error('Create estoque produção movimentação error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
