//src/app/api/configuracoes/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        criadoEm: true,
      },
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const data = await req.json();

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        role: data.role || 'usuario',
      },
    });

    return NextResponse.json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
  }
}
