import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';

export async function GET(req: Request) {
  try {
    const { user } = await requireAuth(req);

    const produtos = await prisma.produto.findMany({
      where: {
        userId: user.id,
      },
      include: {
        categoriaRef: true,
        unidadeRef: true,
      },
    });

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
