import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireAuth();
    
    const supabase = createClient();
    const { data: categoria, error } = await supabase
      .from('categorias_receitas')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Get categoria receita error:', error);
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
    
    const { nome } = await req.json();
    
    const supabase = createClient();
    const { data: categoria, error } = await supabase
      .from('categorias_receitas')
      .update({ nome })
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Update categoria receita error:', error);
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
      .from('categorias_receitas')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    console.error('Delete categoria receita error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
