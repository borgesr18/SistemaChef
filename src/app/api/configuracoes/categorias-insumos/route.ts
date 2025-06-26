// /src/app/api/configuracoes/categorias-insumos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const categorias = await prisma.categoriaInsumo.findMany({
      where: { oculto: false },
      orderBy: { nome: 'asc' },
    });
    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar categorias.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { nome } = await req.json();

    const novaCategoria = await prisma.categoriaInsumo.create({
      data: {
        nome,
        userId: user.id,
      },
    });

    return NextResponse.json(novaCategoria);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar categoria.' }, { status: 500 });
  }
}
