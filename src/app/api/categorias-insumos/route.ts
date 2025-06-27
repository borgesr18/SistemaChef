// src/app/api/categorias-insumos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const supabase = createClient();
    const { data: categorias, error } = await supabase
      .from('categorias_insumos')
      .select('*')
      .eq('user_id', user.id)
      .order('nome', { ascending: true });

    if (error) throw error;

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias de insumos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const supabase = createClient();
    const { data: novaCategoria, error } = await supabase
      .from('categorias_insumos')
      .insert({ nome: body.nome, user_id: user.id })
      .single();

    if (error) throw error;

    return NextResponse.json(novaCategoria);
  } catch (error) {
    console.error('Erro ao criar categoria de insumo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const supabase = createClient();
    const { data: categoriaAtualizada, error } = await supabase
      .from('categorias_insumos')
      .update({ nome: body.nome })
      .eq('id', body.id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json(categoriaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar categoria de insumo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { id } = await req.json();

    const supabase = createClient();
    const { error } = await supabase
      .from('categorias_insumos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria de insumo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
