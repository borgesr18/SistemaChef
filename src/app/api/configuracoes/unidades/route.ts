// src/app/api/configuracoes/unidades/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const unidades = await prisma.unidade.findMany({
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(unidades);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    return NextResponse.json({ error: 'Erro ao buscar unidades' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const { nome, sigla } = await req.json();

    if (!nome || !sigla) {
      return NextResponse.json({ error: 'Nome e sigla são obrigatórios' }, { status: 400 });
    }

    const unidade = await prisma.unidade.create({
      data: { nome, sigla },
    });

    return NextResponse.json(unidade);
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    return NextResponse.json({ error: 'Erro ao criar unidade' }, { status: 500 });
  }
}

