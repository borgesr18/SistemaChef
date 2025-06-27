import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    await requireAuth(); // Garante que o usuário esteja autenticado

    const { id } = context.params;

    // Verifica se a categoria existe
    const supabase = createClient();
    const { data: categoria, error: getError } = await supabase
      .from('categorias_insumos')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    // Deleta a categoria
    const { error } = await supabase
      .from('categorias_insumos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('[DELETE CATEGORIA_INSUMO]', error);
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
  }
}
