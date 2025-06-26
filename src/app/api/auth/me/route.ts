// 📁 src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const supabase = createClient();

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, role')
      .eq('email', payload.email)
      .single();

    if (error || !usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário autenticado:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
