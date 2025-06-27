// /src/app/api/configuracoes/categorias-insumos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: categorias, error } = await supabase
      .from('categorias_insumos')
      .select('*')
      .eq('oculto', false)
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { nome } = await req.json();

    const supabase = createClient();
    const { data: novaCategoria, error } = await supabase
      .from('categorias_insumos')
      .insert({ nome, user_id: user.id })
      .single();

    if (error) throw error;

    return NextResponse.json(novaCategoria);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar categoria.' }, { status: 500 });
  }
}
