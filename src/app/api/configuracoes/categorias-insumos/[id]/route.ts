import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    await requireAuth(req); // Garante que o usuário esteja autenticado

    const { id } = context.params;

    // Verifica se a categoria existe
    const categoria = await prisma.categoriaInsumo.findUnique({
      where: { id },
    });

    if (!categoria) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }

    // Deleta a categoria
    await prisma.categoriaInsumo.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('[DELETE CATEGORIA_INSUMO]', error);
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
  }
}
