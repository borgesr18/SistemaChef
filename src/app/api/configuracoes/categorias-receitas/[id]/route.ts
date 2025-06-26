import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID da categoria não fornecido' }, { status: 400 });
    }

    await prisma.categoriaReceita.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Categoria de receita excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria de receita:', error);
    return NextResponse.json({ error: 'Erro ao excluir categoria de receita' }, { status: 500 });
  }
}

