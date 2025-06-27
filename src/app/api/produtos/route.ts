import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: Request) {
  try {
    const user = await requireAuth();

    const supabase = createClient();
    const { data: produtos, error } = await supabase
      .from('produtos')
      .select('*, categoriaRef:categorias(*), unidadeRef:unidades(*)')
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
