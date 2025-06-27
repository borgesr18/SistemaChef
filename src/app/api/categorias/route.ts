import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }
    
    await requireAuth();
    const supabase = createClient();
    const { data: categorias, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Get categorias error:', error);
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
    
    await requireAuth();
    
    const { nome } = await req.json();
    
    const supabase = createClient();
    const { data: categoria, error } = await supabase
      .from('categorias')
      .insert({ nome })
      .single();

    if (error) {
      if ((error as any).code === '23505') {
        return NextResponse.json({ error: 'Categoria já existe' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(categoria);
  } catch (error: any) {
    console.error('Create categoria error:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Categoria já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
