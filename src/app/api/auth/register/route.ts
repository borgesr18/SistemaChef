import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { requireRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    await requireRole('admin');

    const { nome, email, senha, role } = await req.json();

    const { data: existing } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, role: role || 'viewer' }
      }
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'Erro ao criar usuário' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.user.id,
      nome,
      email,
      role: role || 'viewer'
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Permissões insuficientes' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
