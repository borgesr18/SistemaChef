import { NextRequest, NextResponse } from 'next/server';
import { findByEmail, verificarSenha, ensureAdmin } from '@/lib/serverUsuarios';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    await ensureAdmin();

    const { email, senha } = await req.json();

    const user = await findByEmail(email);
    if (!user || !verificarSenha(senha, user.senhaHash)) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
