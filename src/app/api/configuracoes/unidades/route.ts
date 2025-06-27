// src/app/api/configuracoes/unidades/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const supabase = createClient();
    const { data: unidades, error } = await supabase
      .from('unidades')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json(unidades);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { nome } = await req.json();

    if (!nome || typeof nome !== 'string') {
      return NextResponse.json({ error: 'Nome inválido' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: nova, error } = await supabase
      .from('unidades')
      .insert({ nome })
      .single();

    if (error) throw error;

    return NextResponse.json(nova);
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
