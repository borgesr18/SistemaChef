// 📁 src/app/api/auth/login/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json();
  const supabase = createClient();

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, senha, role')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
  }

  if (user.senha !== senha) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  }

  const token = signToken({
    id: user.id,
    nome: user.nome || '',
    email: user.email || '',
    role: user.role || 'user',
  });

  cookies().set('token', token, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 4, // 4 horas
  });

  return NextResponse.json({
    id: user.id,
    nome: user.nome || '',
    email: user.email || '',
    role: user.role || 'user',
  });
}
