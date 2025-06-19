import { NextRequest, NextResponse } from 'next/server';
import { getUsuarios, addUsuario, hashSenha, senhaForte, ensureAdmin } from '@/lib/serverUsuarios';

export async function POST(req: NextRequest) {
  ensureAdmin();

  const { nome, email, senha, role } = await req.json();

  if (getUsuarios().some((u) => u.email === email)) {
    return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
  }

  if (!senhaForte(senha)) {
    return NextResponse.json({ error: 'Senha fraca' }, { status: 400 });
  }

  const novo = addUsuario({
    nome,
    email,
    senhaHash: hashSenha(senha),
    role: role || 'viewer',
  });

  return NextResponse.json({
    id: novo.id,
    nome: novo.nome,
    email: novo.email,
    role: novo.role,
  });
}
