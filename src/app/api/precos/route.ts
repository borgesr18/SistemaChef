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
    const { data: precos, error } = await supabase
      .from('precos_venda')
      .select('*, producao:producoes(*, ficha:fichas_tecnicas(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(precos);
  } catch (error) {
    console.error('Get preços error:', error);
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
    const { data: preco, error } = await supabase
      .from('precos_venda')
      .insert({
        producao_id: data.producaoId,
        ficha_id: data.fichaId,
        custo_unitario: data.custoUnitario,
        lucro1: data.lucro1,
        preco1: data.preco1,
        lucro2: data.lucro2,
        preco2: data.preco2,
        lucro3: data.lucro3,
        preco3: data.preco3,
        user_id: user.id
      })
      .select('*, producao:producoes(*, ficha:fichas_tecnicas(*))')
      .single();

    if (error) throw error;

    return NextResponse.json(preco);
  } catch (error) {
    console.error('Create preço error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
