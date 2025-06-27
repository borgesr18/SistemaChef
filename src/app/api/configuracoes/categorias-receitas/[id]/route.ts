import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { nome } = await req.json();
    const { id } = params;

    if (!nome || !id) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const categoria = await prisma.categoriaReceita.update({
      where: { id },
      data: { nome },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const { id } = params;

    await prisma.categoriaReceita.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
  }
}
