import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireAuth();
    
    const supabase = createClient();
    const { data: produto, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Get produto error:', error);
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
    
    await requireAuth();
    
    const data = await req.json();
    
    const supabase = createClient();
    const { data: produto, error } = await supabase
      .from('produtos')
      .update({
        nome: data.nome,
        categoria: data.categoria,
        marca: data.marca,
        unidade_medida: data.unidadeMedida,
        preco: data.preco,
        preco_unitario: data.precoUnitario,
        fornecedor: data.fornecedor,
        peso_embalagem: data.pesoEmbalagem,
        info_nutricional: data.infoNutricional
      })
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Update produto error:', error);
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
    
    await requireAuth();
    
    const supabase = createClient();
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete produto error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
