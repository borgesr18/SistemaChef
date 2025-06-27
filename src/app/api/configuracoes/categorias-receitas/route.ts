//src/app/api/configuracoes/categorias-receitas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const supabase = createClient();
    const { data: categorias, error } = await supabase
      .from('categorias_receitas')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias de receitas:', error);
    return NextResponse.json({ error: 'Erro ao listar categorias' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const { nome } = await req.json();

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: categoria, error } = await supabase
      .from('categorias_receitas')
      .insert({ nome })
      .single();

    if (error) throw error;

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao criar categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
