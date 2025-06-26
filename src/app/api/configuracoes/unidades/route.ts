// src/app/api/configuracoes/unidades/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const unidades = await prisma.unidade.findMany({
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(unidades);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { nome } = await req.json();

    if (!nome || typeof nome !== 'string') {
      return NextResponse.json({ error: 'Nome inválido' }, { status: 400 });
    }

    const nova = await prisma.unidade.create({
      data: { nome },
    });

    return NextResponse.json(nova);
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Autenticação necessária' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
