// 📁 src/app/api/auth/users/route.ts
import { NextResponse } from 'next/server';
import { getServerSupabaseClient, requireRole } from '@/lib/auth';

export async function GET() {
  try {
    // Garante que apenas administradores vejam os usuários
    await requireRole('admin');

    const supabase = getServerSupabaseClient();

    const { data: perfis, error } = await supabase
      .from('perfis_usuarios')
      .select(`
        id_usuario,
        nome,
        email,
        papel
      `);

    if (error) {
      console.error('Erro ao buscar perfis:', error.message);
      return NextResponse.json({ error: 'Erro ao buscar perfis de usuários' }, { status: 500 });
    }

    return NextResponse.json(perfis);
  } catch (error) {
    console.error('Erro na rota GET /api/auth/users:', error);
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json({ error: 'Token de autenticação necessário' }, { status: 401 });
      }
      if (error.message === 'Insufficient permissions') {
        return NextResponse.json({ error: 'Permissões insuficientes' }, { status: 403 });
      }
    }

    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
