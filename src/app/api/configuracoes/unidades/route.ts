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
    console.error('Erro ao buscar unidades de medida:', error);
    return NextResponse.json({ error: 'Erro ao buscar unidades' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const data = await req.json();

    if (!data.nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const novaUnidade = await prisma.unidade.create({
      data: {
        nome: data.nome,
      },
    });

    return NextResponse.json(novaUnidade);
  } catch (error) {
    console.error('Erro ao criar unidade de medida:', error);
    return NextResponse.json({ error: 'Erro ao criar unidade' }, { status: 500 });
  }
}

