//src/app/api/configuracoes/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();

    const { id } = params;

    const supabase = createClient();
    const { data: usuarioExistente, error: getError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
