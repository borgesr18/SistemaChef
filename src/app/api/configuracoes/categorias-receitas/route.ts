//src/app/api/configuracoes/categorias-receitas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    const categorias = await prisma.categoriaReceita.findMany({
      orderBy: { nome: 'asc' },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias de receitas:', error);
    return NextResponse.json({ error: 'Erro ao listar categorias' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const { nome } = await req.json();

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const categoria = await prisma.categoriaReceita.create({
      data: { nome },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao criar categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
