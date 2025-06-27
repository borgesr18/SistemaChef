import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { nome } = await req.json();
    const { id } = params;

    if (!nome || !id) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: categoria, error } = await supabase
      .from('categorias_receitas')
      .update({ nome })
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { id } = params;

    const supabase = createClient();
    const { error } = await supabase
      .from('categorias_receitas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
  }
}
