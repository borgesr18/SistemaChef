import { NextResponse } from 'next/server';
import { getUsuarios, ensureAdmin } from '@/lib/serverUsuarios';

export async function GET() {
  ensureAdmin();

  const list = getUsuarios().map((u) => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    role: u.role,
  }));

  return NextResponse.json(list);
}

