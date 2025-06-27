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
    const { data: producao, error } = await supabase
      .from('producoes')
      .update({
        ficha_id: data.fichaId,
        quantidade_total: data.quantidadeTotal,
        unidade_quantidade: data.unidadeQuantidade,
        peso_unitario: data.pesoUnitario,
        unidade_peso: data.unidadePeso,
        unidades_geradas: data.unidadesGeradas,
        custo_total: data.custoTotal,
        custo_unitario: data.custoUnitario,
        validade: data.validade,
        data: data.data || new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select('*, ficha:fichas_tecnicas(*, ingredientes:ingredientes_ficha(*, produto:produtos(*)))')
      .single();

    if (error) throw error;

    return NextResponse.json(producao);
  } catch (error) {
    console.error('Update produção error:', error);
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
      .from('producoes')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete produção error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
