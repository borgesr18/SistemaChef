// src/app/api/configuracoes/unidades/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const unidades = await prisma.unidade.findMany({ orderBy: { nome: 'asc' } });
    return NextResponse.json(unidades);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { nome } = await req.json();

    const unidade = await prisma.unidade.create({ data: { nome } });
    return NextResponse.json(unidade);
  } catch (error) {
    console.error('Erro ao criar unidade:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
