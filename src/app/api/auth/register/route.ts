import { NextRequest, NextResponse } from 'next/server';
import { findByEmail, addUsuario, hashSenha, senhaForte, ensureAdmin } from '@/lib/serverUsuarios';
import { requireRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ error: 'Database not available during build' }, { status: 503 });
    }

    await ensureAdmin();
    
    await requireRole(req, ['admin']);

    const { nome, email, senha, role } = await req.json();

    const existingUser = await findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    if (!senhaForte(senha)) {
      return NextResponse.json({ error: 'Senha fraca' }, { status: 400 });
    }

    const novo = await addUsuario({
      nome,
      email,
      senhaHash: hashSenha(senha),
      role: role || 'viewer',
      oculto: false
    });

    return NextResponse.json({
      id: novo.id,
      nome: novo.nome,
      email: novo.email,
      role: novo.role,
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Permissões insuficientes' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
