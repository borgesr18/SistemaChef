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
    const { data: producoes, error } = await supabase
      .from('producoes')
      .select('*, ficha:fichas_tecnicas(*, ingredientes:ingredientes_ficha(*, produto:produtos(*)))')
      .eq('user_id', user.id)
      .order('data', { ascending: false });

    if (error) throw error;

    return NextResponse.json(producoes);
  } catch (error) {
    console.error('Get produção error:', error);
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
    const { data: producao, error } = await supabase
      .from('producoes')
      .insert({
        ficha_id: data.fichaId,
        quantidade_total: data.quantidadeTotal,
        unidade_quantidade: data.unidadeQuantidade,
        peso_unitario: data.pesoUnitario,
        unidade_peso: data.unidadePeso,
        unidades_geradas: data.unidadesGeradas,
        custo_total: data.custoTotal,
        custo_unitario: data.custoUnitario,
        validade: data.validade,
        data: data.data || new Date().toISOString(),
        user_id: user.id
      })
      .select('*, ficha:fichas_tecnicas(*, ingredientes:ingredientes_ficha(*, produto:produtos(*)))')
      .single();

    if (error) throw error;

    return NextResponse.json(producao);
  } catch (error) {
    console.error('Create produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
